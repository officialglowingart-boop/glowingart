const express = require("express")
const router = express.Router()
const Category = require("../models/Category")
const { authenticateAdmin } = require("../middleware/auth")

// Get all active categories (public)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 })
    res.json({ categories })
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message })
  }
})

// Get all categories (admin)
router.get("/admin", authenticateAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 })
    res.json({ categories })
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message })
  }
})

// Create category (admin)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body

    const category = new Category({
      name,
      description,
      sortOrder: sortOrder || 0,
    })

    await category.save()
    res.status(201).json({ message: "Category created successfully", category })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" })
    }
    res.status(500).json({ message: "Error creating category", error: error.message })
  }
})

// Update category (admin)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { name, description, isActive, sortOrder } = req.body

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, isActive, sortOrder },
      { new: true, runValidators: true },
    )

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category updated successfully", category })
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message })
  }
})

// Delete category (admin)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message })
  }
})

module.exports = router
