const express = require("express")
const router = express.Router()
const Review = require("../models/Review")
const Product = require("../models/Product")
const Order = require("../models/Order")
const mongoose = require("mongoose")
const { authenticateAdmin } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

// Get approved reviews for a product (public) with pagination
router.get("/product/:productId", async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query
    const filter = { product: req.params.productId, isApproved: true }

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .populate("product", "name"),
      Review.countDocuments(filter),
    ])

    res.json({
      reviews,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message })
  }
})

// Get summary for a product's reviews (average, total, per-star counts)
router.get("/product/:productId/summary", async (req, res) => {
  try {
    const productId = req.params.productId
    const match = { product: new mongoose.Types.ObjectId(productId), isApproved: true }

    const starBuckets = await Review.aggregate([
      { $match: match },
      { $group: { _id: "$rating", count: { $sum: 1 }, sum: { $sum: "$rating" } } },
    ])

    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let total = 0
    let totalSum = 0
    starBuckets.forEach((b) => {
      const rating = String(b._id)
      if (starCounts[rating] !== undefined) starCounts[rating] = b.count
      else if (starCounts[Number(rating)] !== undefined) starCounts[Number(rating)] = b.count
      total += b.count
      totalSum += b.sum
    })

    const average = total > 0 ? Math.round((totalSum / total) * 10) / 10 : 0

    res.json({ average, total, starCounts })
  } catch (error) {
    res.status(500).json({ message: "Error fetching review summary", error: error.message })
  }
})

// Get all approved reviews (public) - for home page display
router.get("/approved", async (req, res) => {
  try {
    const { limit = 50, page = 1, rating } = req.query
    const query = { isApproved: true }

    // Filter by rating if specified
    if (rating) {
      query.rating = Number.parseInt(rating)
    }

    const reviews = await Review.find(query)
      .populate("product", "name images")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments(query)

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved reviews", error: error.message })
  }
})

// Create a review (public)
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { productId, customerName, customerEmail, rating, comment, orderNumber } = req.body

    // Verify order exists and belongs to customer
    const order = await Order.findOne({
      orderNumber,
      "customerInfo.email": customerEmail,
      "items.product": productId,
    })

    if (!order) {
      return res.status(400).json({ message: "Invalid order or product not found in order" })
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      product: productId,
      customerEmail,
      orderNumber,
    })

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" })
    }

    // Process uploaded images
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }))
      : []

    const review = new Review({
      product: productId,
      customerName,
      customerEmail,
      rating: Number.parseInt(rating),
      comment,
      orderNumber,
      images,
    })

    await review.save()

    // Update product rating
    await updateProductRating(productId)

    res.status(201).json({ message: "Review submitted successfully. It will be visible after approval.", review })
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message })
  }
})

// Get all reviews (admin)
router.get("/admin", authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = {}

    if (status === "approved") query.isApproved = true
    if (status === "pending") query.isApproved = false
    if (status === "rejected") query.isApproved = null

    const reviews = await Review.find(query)
      .populate("product", "name images")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments(query)

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message })
  }
})

// Approve/reject review (admin)
router.put("/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { isApproved } = req.body

    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved }, { new: true }).populate(
      "product",
      "name",
    )

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Update product rating if approved
    if (isApproved) {
      await updateProductRating(review.product._id)
    }

    res.json({ message: "Review status updated successfully", review })
  } catch (error) {
    res.status(500).json({ message: "Error updating review status", error: error.message })
  }
})

// Delete review (admin)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Update product rating
    await updateProductRating(review.product)

    res.json({ message: "Review deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message })
  }
})

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ product: productId, isApproved: true })
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: reviews.length,
    })
  } catch (error) {
    console.error("Error updating product rating:", error)
  }
}

module.exports = router
