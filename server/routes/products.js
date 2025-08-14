const express = require("express")
const Product = require("../models/Product")
const auth = require("../middleware/auth")
const { upload } = require("../middleware/upload")

const router = express.Router()

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query

    const query = {}

    if (category) {
      query.category = category
    }

    if (featured === "true") {
      query.featured = true
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Product.countDocuments(query)

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
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

// Create product (admin only)
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, category, sizes, tags, featured } = req.body

    const images =
      req.files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
      })) || []

    const product = new Product({
      name,
      description,
      category,
      images,
      sizes: JSON.parse(sizes),
      tags: tags ? JSON.parse(tags) : [],
      featured: featured === "true",
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error("Create product error:", error)
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
      sizes: JSON.parse(sizes),
      tags: tags ? JSON.parse(tags) : [],
      featured: featured === "true",
      inStock: inStock !== "false",
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
