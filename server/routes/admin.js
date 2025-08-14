const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const auth = require("../middleware/auth")
const { sendStatusUpdate } = require("../utils/notifications")

const router = express.Router()

// Get dashboard stats (admin only)
router.get("/dashboard", auth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()
    const pendingOrders = await Order.countDocuments({ orderStatus: "processing" })

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ])

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate("items.product", "name")

    res.json({
      stats: {
        totalOrders,
        totalProducts,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all orders (admin only)
router.get("/orders", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query

    const query = {}
    if (status) query.orderStatus = status
    if (paymentStatus) query.paymentStatus = paymentStatus

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("items.product", "name")

    const total = await Order.countDocuments(query)

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update order status (admin only)
router.put("/orders/:id", auth, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, notes } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus, notes },
      { new: true },
    ).populate("items.product", "name")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    try {
      await sendStatusUpdate(order)
    } catch (notificationError) {
      console.error("Notification error:", notificationError)
      // Don't fail the update if notification fails
    }

    res.json(order)
  } catch (error) {
    console.error("Update order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Confirm payment (admin only)
router.patch("/orders/:id/confirm-payment", auth, async (req, res) => {
  try {
    const { adminNotes } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (!order.paymentDetails?.transactionId) {
      return res.status(400).json({ message: "No payment details found for this order" })
    }

    order.paymentStatus = "paid"
    order.paymentDetails.adminNotes = adminNotes || "Payment confirmed by admin"
    
    await order.save()

    res.json({ 
      message: "Payment confirmed successfully",
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
      }
    })
  } catch (error) {
    console.error("Confirm payment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get order details with payment info (admin only)
router.get("/orders/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product")
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error("Get order details error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get payment verifications (admin only)
router.get("/payments/verifications", auth, async (req, res) => {
  try {
    const { status } = req.query
    
    const query = {}
    
    // Filter by payment status
    if (status === "pending") {
      query.paymentStatus = "pending"
      query["paymentDetails.transactionId"] = { $exists: true }
    } else if (status === "verified") {
      query.paymentStatus = "paid"
    }
    
    // Always include orders with payment details
    if (!status || status === "all") {
      query["paymentDetails.transactionId"] = { $exists: true }
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("items.product", "name")

    // Transform the data to match the expected format
    const payments = orders.map(order => ({
      _id: order._id,
      transactionId: order.paymentDetails?.transactionId,
      receiptUrl: order.paymentDetails?.receiptImage,
      isVerified: order.paymentStatus === "paid" ? true : (order.paymentStatus === "rejected" ? false : null),
      notes: order.paymentDetails?.adminNotes,
      createdAt: order.paymentDetails?.paymentConfirmedAt || order.createdAt,
      order: {
        orderNumber: order.orderNumber,
        customerInfo: order.customerInfo,
        paymentMethod: order.paymentMethod,
        total: order.total
      }
    }))

    res.json({ payments })
  } catch (error) {
    console.error("Get payment verifications error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Verify payment (admin only)
router.put("/payments/verify/:id", auth, async (req, res) => {
  try {
    const { isVerified, notes } = req.body
    
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (!order.paymentDetails?.transactionId) {
      return res.status(400).json({ message: "No payment details found for this order" })
    }

    // Update payment status
    order.paymentStatus = isVerified ? "paid" : "rejected"
    if (notes) {
      order.paymentDetails.adminNotes = notes
    }
    
    await order.save()

    try {
      await sendStatusUpdate(order)
    } catch (notificationError) {
      console.error("Notification error:", notificationError)
    }

    res.json({ 
      message: `Payment ${isVerified ? "verified" : "rejected"} successfully`,
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
      }
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
