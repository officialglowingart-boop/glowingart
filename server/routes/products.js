const express = require("express")
const Product = require("../models/Product")
const auth = require("../middleware/auth")
const { upload } = require("../middleware/upload")

const router = express.Router()

// Helper to escape user input for safe regex usage
const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
// Normalize spaces: collapse multiple spaces and trim
const normalizeSpaces = (s = "") => s.replace(/\s+/g, " ").trim()
// Convert a string to a regex pattern that is tolerant to whitespace: spaces -> \s*
const toFlexibleSpacePattern = (s = "") => escapeRegex(s).replace(/\s+/g, "\\s*")

// Build $or search across fields using a regex term (already escaped / prepared)
const buildOr = (term) => [
  { name: { $regex: term, $options: "i" } },
  { description: { $regex: term, $options: "i" } },
  { tags: { $in: [new RegExp(term, "i")] } },
]

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query

    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 12

    // Base filters (category, featured)
    const baseFilter = {}
    if (category) {
      baseFilter.category = category
    }
    if (featured === "true") {
      baseFilter.featured = true
    }

    // Advanced search behavior
    if (typeof search === "string" && search.trim().length > 0) {
      const raw = search.trim()
      const normalized = normalizeSpaces(raw)

      // 1) Exact match by full name first
      const exactPattern = `^${toFlexibleSpacePattern(normalized)}$`
      const exactFilter = {
        ...baseFilter,
        name: { $regex: exactPattern, $options: "i" },
      }

      const exactTotal = await Product.countDocuments(exactFilter)
      if (exactTotal > 0) {
        const exactProducts = await Product.find(exactFilter)
          .sort({ createdAt: -1 })
          .limit(limitNum)
          .skip((pageNum - 1) * limitNum)

        return res.json({
          products: exactProducts,
          totalPages: Math.ceil(exactTotal / limitNum),
          currentPage: pageNum,
          total: exactTotal,
          appliedSearch: normalized,
          matchType: "exact",
        })
      }

      // 2) Try the full query as-is (partial/fuzzy match across fields) before trimming
      const fullFlexible = toFlexibleSpacePattern(normalized)
      const fullFilter = { ...baseFilter, $or: buildOr(fullFlexible) }
      const fullTotal = await Product.countDocuments(fullFilter)
      if (fullTotal > 0) {
        const fullProducts = await Product.find(fullFilter)
          .sort({ createdAt: -1 })
          .limit(limitNum)
          .skip((pageNum - 1) * limitNum)

        return res.json({
          products: fullProducts,
          totalPages: Math.ceil(fullTotal / limitNum),
          currentPage: pageNum,
          total: fullTotal,
          appliedSearch: normalized,
          matchType: "full",
        })
      }

  // 3) Progressive trimming from the end (words first, then letters)
  const candidates = []
  const words = normalized.split(/\s+/).filter(Boolean)

      // Remove words from the end step-by-step
      for (let k = words.length - 1; k >= 1; k--) {
        const term = words.slice(0, k).join(" ")
        if (term && !candidates.includes(term)) candidates.push(term)
      }

      // If still nothing, remove trailing letters step-by-step (down to length >= 2)
      for (let i = normalized.length - 1; i >= 2; i--) {
        const term = normalized.slice(0, i).trim()
        if (term && !candidates.includes(term)) candidates.push(term)
      }

      let chosen = null
      for (const term of candidates) {
        const flexible = toFlexibleSpacePattern(term)
        const filter = { ...baseFilter, $or: buildOr(flexible) }
        const cnt = await Product.countDocuments(filter)
        if (cnt > 0) {
          chosen = { term, count: cnt, filter }
          break
        }
      }

      if (chosen) {
        const products = await Product.find(chosen.filter)
          .sort({ createdAt: -1 })
          .limit(limitNum)
          .skip((pageNum - 1) * limitNum)

        return res.json({
          products,
          totalPages: Math.ceil(chosen.count / limitNum),
          currentPage: pageNum,
          total: chosen.count,
          appliedSearch: chosen.term,
          matchType: "trim",
        })
      }

      // No matches at all for any trimmed variant
      return res.json({
        products: [],
        totalPages: 0,
        currentPage: pageNum,
        total: 0,
  appliedSearch: normalized,
        matchType: "none",
      })
    }

    // No search: default listing
    const products = await Product.find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)

    const total = await Product.countDocuments(baseFilter)

    res.json({
      products,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helpers
const safeJsonParse = (val, fallback) => {
  if (val === undefined || val === null || val === "") return fallback
  if (Array.isArray(val) || typeof val === "object") return val
  try {
    return JSON.parse(val)
  } catch (e) {
    return fallback
  }
}

const normalizeSizes = (sizesArr = []) => {
  if (!Array.isArray(sizesArr)) return []
  return sizesArr
    .filter((s) => s && s.name)
    .map((s) => ({
      name: s.name,
      price: Number(s.price) || 0,
      originalPrice: s.originalPrice !== undefined && s.originalPrice !== null && s.originalPrice !== ""
        ? Number(s.originalPrice)
        : undefined,
    }))
}

// Create product (admin only)
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, category, sizes, tags, featured, inStock } = req.body

    // Basic validation for required fields
    if (!name || !description || !category) {
      return res.status(400).json({ message: "name, description and category are required" })
    }

    const images = (req.files || []).map((file) => ({ url: file.path, publicId: file.filename }))

    const parsedSizes = normalizeSizes(safeJsonParse(sizes, []))
    const parsedTags = safeJsonParse(tags, [])

    if (!parsedSizes.length) {
      return res.status(400).json({ message: "At least one size with name and price is required" })
    }

    const product = new Product({
      name,
      description,
      category,
      images,
      sizes: parsedSizes,
      tags: parsedTags,
      featured: `${featured}` === "true",
      inStock: `${inStock}` !== "false",
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error("Create product error:", error)
    // If validation error from Mongoose, show it clearly
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error" })
  }
})

// Update product (admin only)
router.put("/:id", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, category, sizes, tags, featured, inStock } = req.body

    const updateData = {
      name,
      description,
      category,
      sizes: normalizeSizes(safeJsonParse(sizes, [])),
      tags: safeJsonParse(tags, []),
      featured: `${featured}` === "true",
      inStock: `${inStock}` !== "false",
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }))
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete product (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
