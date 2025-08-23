// const express = require("express")
// const Order = require("../models/Order")
// const Product = require("../models/Product")
// const Coupon = require("../models/Coupon")
// const auth = require("../middleware/auth")
// const { sendStatusUpdate } = require("../utils/notifications")

// const router = express.Router()

// // Get dashboard stats (admin only)
// router.get("/dashboard", auth, async (req, res) => {
//   try {
//     const totalOrders = await Order.countDocuments()
//     const totalProducts = await Product.countDocuments()
//     const pendingOrders = await Order.countDocuments({ orderStatus: "processing" })

//     const totalRevenue = await Order.aggregate([
//       { $match: { paymentStatus: "paid" } },
//       { $group: { _id: null, total: { $sum: "$total" } } },
//     ])

//     const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate("items.product", "name")

//     res.json({
//       stats: {
//         totalOrders,
//         totalProducts,
//         pendingOrders,
//         totalRevenue: totalRevenue[0]?.total || 0,
//       },
//       recentOrders,
//     })
//   } catch (error) {
//     console.error("Dashboard error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get all orders (admin only)
// router.get("/orders", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status, paymentStatus } = req.query

//     const query = {}
//     if (status) query.orderStatus = status
//     if (paymentStatus) query.paymentStatus = paymentStatus

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate("items.product", "name")

//     const total = await Order.countDocuments(query)

//     res.json({
//       orders,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     })
//   } catch (error) {
//     console.error("Get orders error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Update order status (admin only)
// router.put("/orders/:id", auth, async (req, res) => {
//   try {
//     const { orderStatus, paymentStatus, notes } = req.body

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { orderStatus, paymentStatus, notes },
//       { new: true },
//     ).populate("items.product", "name")

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     try {
//       await sendStatusUpdate(order)
//     } catch (notificationError) {
//       console.error("Notification error:", notificationError)
//       // Don't fail the update if notification fails
//     }

//     res.json(order)
//   } catch (error) {
//     console.error("Update order error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Confirm payment (admin only)
// router.patch("/orders/:id/confirm-payment", auth, async (req, res) => {
//   try {
//     const { adminNotes } = req.body

//     const order = await Order.findById(req.params.id)
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     if (!order.paymentDetails?.transactionId) {
//       return res.status(400).json({ message: "No payment details found for this order" })
//     }

//     order.paymentStatus = "paid"
//     order.paymentDetails.adminNotes = adminNotes || "Payment confirmed by admin"

//     await order.save()

//     res.json({
//       message: "Payment confirmed successfully",
//       order: {
//         orderNumber: order.orderNumber,
//         paymentStatus: order.paymentStatus,
//       },
//     })
//   } catch (error) {
//     console.error("Confirm payment error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get order details with payment info (admin only)
// router.get("/orders/:id", auth, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("items.product")

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     res.json(order)
//   } catch (error) {
//     console.error("Get order details error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get payment verifications (admin only)
// router.get("/payments/verifications", auth, async (req, res) => {
//   try {
//     const { status } = req.query

//     const query = {}

//     // Filter by payment status
//     if (status === "pending") {
//       query.paymentStatus = "pending"
//       query["paymentDetails.transactionId"] = { $exists: true }
//     } else if (status === "verified") {
//       query.paymentStatus = "paid"
//     }

//     // Always include orders with payment details
//     if (!status || status === "all") {
//       query["paymentDetails.transactionId"] = { $exists: true }
//     }

//     const orders = await Order.find(query).sort({ createdAt: -1 }).populate("items.product", "name")

//     // Transform the data to match the expected format
//     const payments = orders.map((order) => ({
//       _id: order._id,
//       transactionId: order.paymentDetails?.transactionId,
//       receiptUrl: order.paymentDetails?.receiptImage,
//       isVerified: order.paymentStatus === "paid" ? true : order.paymentStatus === "rejected" ? false : null,
//       notes: order.paymentDetails?.adminNotes,
//       createdAt: order.paymentDetails?.paymentConfirmedAt || order.createdAt,
//       order: {
//         orderNumber: order.orderNumber,
//         customerInfo: order.customerInfo,
//         paymentMethod: order.paymentMethod,
//         total: order.total,
//       },
//     }))

//     res.json({ payments })
//   } catch (error) {
//     console.error("Get payment verifications error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Verify payment (admin only)
// router.put("/payments/verify/:id", auth, async (req, res) => {
//   try {
//     const { isVerified, notes } = req.body

//     const order = await Order.findById(req.params.id)
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     if (!order.paymentDetails?.transactionId) {
//       return res.status(400).json({ message: "No payment details found for this order" })
//     }

//     // Update payment status
//     order.paymentStatus = isVerified ? "paid" : "rejected"
//     if (notes) {
//       order.paymentDetails.adminNotes = notes
//     }

//     await order.save()

//     try {
//       await sendStatusUpdate(order)
//     } catch (notificationError) {
//       console.error("Notification error:", notificationError)
//     }

//     res.json({
//       message: `Payment ${isVerified ? "verified" : "rejected"} successfully`,
//       order: {
//         orderNumber: order.orderNumber,
//         paymentStatus: order.paymentStatus,
//       },
//     })
//   } catch (error) {
//     console.error("Verify payment error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get all coupons (admin only)
// router.get("/coupons", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status } = req.query

//     const query = {}
//     if (status === "active") {
//       query.isActive = true
//       query.validUntil = { $gte: new Date() }
//     } else if (status === "expired") {
//       query.validUntil = { $lt: new Date() }
//     } else if (status === "inactive") {
//       query.isActive = false
//     }

//     const coupons = await Coupon.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate("createdBy", "username")

//     const total = await Coupon.countDocuments(query)

//     res.json({
//       coupons,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     })
//   } catch (error) {
//     console.error("Get coupons error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Create new coupon (admin only)
// router.post("/coupons", auth, async (req, res) => {
//   try {
//     const {
//       code,
//       description,
//       discountType,
//       discountValue,
//       minimumOrderAmount,
//       maxDiscountAmount,
//       usageLimit,
//       validFrom,
//       validUntil,
//       applicableCategories,
//     } = req.body

//     // Validate required fields
//     if (!code || !description || !discountType || !discountValue || !validFrom || !validUntil) {
//       return res.status(400).json({ message: "Missing required fields" })
//     }

//     // Validate discount value
//     if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
//       return res.status(400).json({ message: "Percentage discount must be between 1 and 100" })
//     }

//     if (discountType === "fixed" && discountValue <= 0) {
//       return res.status(400).json({ message: "Fixed discount must be greater than 0" })
//     }

//     // Validate dates
//     if (new Date(validFrom) >= new Date(validUntil)) {
//       return res.status(400).json({ message: "Valid from date must be before valid until date" })
//     }

//     const coupon = new Coupon({
//       code: code.toUpperCase(),
//       description,
//       discountType,
//       discountValue,
//       minimumOrderAmount: minimumOrderAmount || 0,
//       maxDiscountAmount: discountType === "percentage" ? maxDiscountAmount : null,
//       usageLimit,
//       validFrom: new Date(validFrom),
//       validUntil: new Date(validUntil),
//       applicableCategories: applicableCategories || [],
//       createdBy: req.admin._id,
//     })

//     await coupon.save()
//     await coupon.populate("createdBy", "username")

//     res.status(201).json(coupon)
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: "Coupon code already exists" })
//     }
//     console.error("Create coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Update coupon (admin only)
// router.put("/coupons/:id", auth, async (req, res) => {
//   try {
//     const {
//       description,
//       discountType,
//       discountValue,
//       minimumOrderAmount,
//       maxDiscountAmount,
//       usageLimit,
//       validFrom,
//       validUntil,
//       isActive,
//       applicableCategories,
//     } = req.body

//     const coupon = await Coupon.findById(req.params.id)
//     if (!coupon) {
//       return res.status(404).json({ message: "Coupon not found" })
//     }

//     // Validate discount value if provided
//     if (discountValue !== undefined) {
//       if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
//         return res.status(400).json({ message: "Percentage discount must be between 1 and 100" })
//       }
//       if (discountType === "fixed" && discountValue <= 0) {
//         return res.status(400).json({ message: "Fixed discount must be greater than 0" })
//       }
//     }

//     // Validate dates if provided
//     if (validFrom && validUntil && new Date(validFrom) >= new Date(validUntil)) {
//       return res.status(400).json({ message: "Valid from date must be before valid until date" })
//     }

//     // Update fields
//     if (description !== undefined) coupon.description = description
//     if (discountType !== undefined) coupon.discountType = discountType
//     if (discountValue !== undefined) coupon.discountValue = discountValue
//     if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount
//     if (maxDiscountAmount !== undefined)
//       coupon.maxDiscountAmount = discountType === "percentage" ? maxDiscountAmount : null
//     if (usageLimit !== undefined) coupon.usageLimit = usageLimit
//     if (validFrom !== undefined) coupon.validFrom = new Date(validFrom)
//     if (validUntil !== undefined) coupon.validUntil = new Date(validUntil)
//     if (isActive !== undefined) coupon.isActive = isActive
//     if (applicableCategories !== undefined) coupon.applicableCategories = applicableCategories

//     await coupon.save()
//     await coupon.populate("createdBy", "username")

//     res.json(coupon)
//   } catch (error) {
//     console.error("Update coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Delete coupon (admin only)
// router.delete("/coupons/:id", auth, async (req, res) => {
//   try {
//     const coupon = await Coupon.findById(req.params.id)
//     if (!coupon) {
//       return res.status(404).json({ message: "Coupon not found" })
//     }

//     await Coupon.findByIdAndDelete(req.params.id)
//     res.json({ message: "Coupon deleted successfully" })
//   } catch (error) {
//     console.error("Delete coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Validate coupon (public route for checkout)
// router.post("/coupons/validate", async (req, res) => {
//   try {
//     const { code, orderTotal } = req.body

//     if (!code || orderTotal === undefined) {
//       return res.status(400).json({ message: "Coupon code and order total are required" })
//     }

//     const coupon = await Coupon.findOne({ code: code.toUpperCase() })
//     if (!coupon) {
//       return res.status(404).json({ message: "Invalid coupon code" })
//     }

//     if (!coupon.isValid()) {
//       let message = "Coupon is not valid"
//       const now = new Date()

//       if (!coupon.isActive) {
//         message = "Coupon is inactive"
//       } else if (now < coupon.validFrom) {
//         message = "Coupon is not yet active"
//       } else if (now > coupon.validUntil) {
//         message = "Coupon has expired"
//       } else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
//         message = "Coupon usage limit reached"
//       }

//       return res.status(400).json({ message })
//     }

//     if (orderTotal < coupon.minimumOrderAmount) {
//       return res.status(400).json({
//         message: `Minimum order amount of $${coupon.minimumOrderAmount} required`,
//       })
//     }

//     const discountAmount = coupon.calculateDiscount(orderTotal)
//     const newTotal = orderTotal - discountAmount

//     res.json({
//       valid: true,
//       coupon: {
//         code: coupon.code,
//         description: coupon.description,
//         discountType: coupon.discountType,
//         discountValue: coupon.discountValue,
//       },
//       discountAmount,
//       newTotal,
//     })
//   } catch (error) {
//     console.error("Validate coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// module.exports = router







































// const express = require("express")
// const Order = require("../models/Order")
// const Product = require("../models/Product")
// const Coupon = require("../models/Coupon")
// const auth = require("../middleware/auth")
// const { sendStatusUpdate } = require("../utils/notifications")

// const router = express.Router()

// // Get dashboard stats (admin only)
// router.get("/dashboard", auth, async (req, res) => {
//   try {
//     const totalOrders = await Order.countDocuments()
//     const totalProducts = await Product.countDocuments()
//     const pendingOrders = await Order.countDocuments({ orderStatus: "processing" })

//     const totalRevenue = await Order.aggregate([
//       { $match: { paymentStatus: "paid" } },
//       { $group: { _id: null, total: { $sum: "$total" } } },
//     ])

//     const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate("items.product", "name")

//     res.json({
//       stats: {
//         totalOrders,
//         totalProducts,
//         pendingOrders,
//         totalRevenue: totalRevenue[0]?.total || 0,
//       },
//       recentOrders,
//     })
//   } catch (error) {
//     console.error("Dashboard error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get all orders (admin only)
// router.get("/orders", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status, paymentStatus } = req.query

//     const query = {}
//     if (status) query.orderStatus = status
//     if (paymentStatus) query.paymentStatus = paymentStatus

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate("items.product", "name")

//     const total = await Order.countDocuments(query)

//     res.json({
//       orders,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     })
//   } catch (error) {
//     console.error("Get orders error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Update order status (admin only)
// router.put("/orders/:id", auth, async (req, res) => {
//   try {
//     const { orderStatus, paymentStatus, notes } = req.body

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { orderStatus, paymentStatus, notes },
//       { new: true },
//     ).populate("items.product", "name")

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     try {
//       await sendStatusUpdate(order)
//     } catch (notificationError) {
//       console.error("Notification error:", notificationError)
//       // Don't fail the update if notification fails
//     }

//     res.json(order)
//   } catch (error) {
//     console.error("Update order error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Confirm payment (admin only)
// router.patch("/orders/:id/confirm-payment", auth, async (req, res) => {
//   try {
//     const { adminNotes } = req.body

//     const order = await Order.findById(req.params.id)
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     if (!order.paymentDetails?.transactionId) {
//       return res.status(400).json({ message: "No payment details found for this order" })
//     }

//     order.paymentStatus = "paid"
//     order.paymentDetails.adminNotes = adminNotes || "Payment confirmed by admin"

//     await order.save()

//     res.json({
//       message: "Payment confirmed successfully",
//       order: {
//         orderNumber: order.orderNumber,
//         paymentStatus: order.paymentStatus,
//       },
//     })
//   } catch (error) {
//     console.error("Confirm payment error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get order details with payment info (admin only)
// router.get("/orders/:id", auth, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("items.product")

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     res.json(order)
//   } catch (error) {
//     console.error("Get order details error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get payment verifications (admin only)
// router.get("/payments/verifications", auth, async (req, res) => {
//   try {
//     const { status } = req.query

//     const query = {}

//     // Filter by payment status
//     if (status === "pending") {
//       query.paymentStatus = "pending"
//       query["paymentDetails.transactionId"] = { $exists: true }
//     } else if (status === "verified") {
//       query.paymentStatus = "paid"
//     }

//     // Always include orders with payment details
//     if (!status || status === "all") {
//       query["paymentDetails.transactionId"] = { $exists: true }
//     }

//     const orders = await Order.find(query).sort({ createdAt: -1 }).populate("items.product", "name")

//     // Transform the data to match the expected format
//     const payments = orders.map((order) => ({
//       _id: order._id,
//       transactionId: order.paymentDetails?.transactionId,
//       receiptUrl: order.paymentDetails?.receiptImage,
//       isVerified: order.paymentStatus === "paid" ? true : order.paymentStatus === "rejected" ? false : null,
//       notes: order.paymentDetails?.adminNotes,
//       createdAt: order.paymentDetails?.paymentConfirmedAt || order.createdAt,
//       order: {
//         orderNumber: order.orderNumber,
//         customerInfo: order.customerInfo,
//         paymentMethod: order.paymentMethod,
//         total: order.total,
//       },
//     }))

//     res.json({ payments })
//   } catch (error) {
//     console.error("Get payment verifications error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Verify payment (admin only)
// router.put("/payments/verify/:id", auth, async (req, res) => {
//   try {
//     const { isVerified, notes } = req.body

//     const order = await Order.findById(req.params.id)
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     if (!order.paymentDetails?.transactionId) {
//       return res.status(400).json({ message: "No payment details found for this order" })
//     }

//     // Update payment status
//     order.paymentStatus = isVerified ? "paid" : "rejected"
//     if (notes) {
//       order.paymentDetails.adminNotes = notes
//     }

//     await order.save()

//     try {
//       await sendStatusUpdate(order)
//     } catch (notificationError) {
//       console.error("Notification error:", notificationError)
//     }

//     res.json({
//       message: `Payment ${isVerified ? "verified" : "rejected"} successfully`,
//       order: {
//         orderNumber: order.orderNumber,
//         paymentStatus: order.paymentStatus,
//       },
//     })
//   } catch (error) {
//     console.error("Verify payment error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Get all coupons (admin only)
// router.get("/coupons", auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status } = req.query

//     const query = {}
//     if (status === "active") {
//       query.isActive = true
//       query.validUntil = { $gte: new Date() }
//     } else if (status === "expired") {
//       query.validUntil = { $lt: new Date() }
//     } else if (status === "inactive") {
//       query.isActive = false
//     }

//     const coupons = await Coupon.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .populate("createdBy", "username")

//     const total = await Coupon.countDocuments(query)

//     res.json({
//       coupons,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     })
//   } catch (error) {
//     console.error("Get coupons error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Create new coupon (admin only)
// router.post("/coupons", auth, async (req, res) => {
//   try {
//     const {
//       code,
//       description,
//       discountType,
//       discountValue,
//       minimumOrderAmount,
//       maxDiscountAmount,
//       usageLimit,
//       validFrom,
//       validUntil,
//       applicableCategories,
//     } = req.body

//     // Validate required fields
//     if (!code || !description || !discountType || !discountValue || !validFrom || !validUntil) {
//       return res.status(400).json({ message: "Missing required fields" })
//     }

//     // Validate discount value
//     if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
//       return res.status(400).json({ message: "Percentage discount must be between 1 and 100" })
//     }

//     if (discountType === "fixed" && discountValue <= 0) {
//       return res.status(400).json({ message: "Fixed discount must be greater than 0" })
//     }

//     // Validate dates
//     if (new Date(validFrom) >= new Date(validUntil)) {
//       return res.status(400).json({ message: "Valid from date must be before valid until date" })
//     }

//     const coupon = new Coupon({
//       code: code.toUpperCase(),
//       description,
//       discountType,
//       discountValue,
//       minimumOrderAmount: minimumOrderAmount || 0,
//       maxDiscountAmount: discountType === "percentage" ? maxDiscountAmount : null,
//       usageLimit,
//       validFrom: new Date(validFrom),
//       validUntil: new Date(validUntil),
//       applicableCategories: applicableCategories || [],
//       createdBy: req.admin._id,
//     })

//     await coupon.save()
//     await coupon.populate("createdBy", "username")

//     res.status(201).json(coupon)
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: "Coupon code already exists" })
//     }
//     console.error("Create coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Update coupon (admin only)
// router.put("/coupons/:id", auth, async (req, res) => {
//   try {
//     const {
//       description,
//       discountType,
//       discountValue,
//       minimumOrderAmount,
//       maxDiscountAmount,
//       usageLimit,
//       validFrom,
//       validUntil,
//       isActive,
//       applicableCategories,
//     } = req.body

//     const coupon = await Coupon.findById(req.params.id)
//     if (!coupon) {
//       return res.status(404).json({ message: "Coupon not found" })
//     }

//     // Validate discount value if provided
//     if (discountValue !== undefined) {
//       if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
//         return res.status(400).json({ message: "Percentage discount must be between 1 and 100" })
//       }
//       if (discountType === "fixed" && discountValue <= 0) {
//         return res.status(400).json({ message: "Fixed discount must be greater than 0" })
//       }
//     }

//     // Validate dates if provided
//     if (validFrom && validUntil && new Date(validFrom) >= new Date(validUntil)) {
//       return res.status(400).json({ message: "Valid from date must be before valid until date" })
//     }

//     // Update fields
//     if (description !== undefined) coupon.description = description
//     if (discountType !== undefined) coupon.discountType = discountType
//     if (discountValue !== undefined) coupon.discountValue = discountValue
//     if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount
//     if (maxDiscountAmount !== undefined)
//       coupon.maxDiscountAmount = discountType === "percentage" ? maxDiscountAmount : null
//     if (usageLimit !== undefined) coupon.usageLimit = usageLimit
//     if (validFrom !== undefined) coupon.validFrom = new Date(validFrom)
//     if (validUntil !== undefined) coupon.validUntil = new Date(validUntil)
//     if (isActive !== undefined) coupon.isActive = isActive
//     if (applicableCategories !== undefined) coupon.applicableCategories = applicableCategories

//     await coupon.save()
//     await coupon.populate("createdBy", "username")

//     res.json(coupon)
//   } catch (error) {
//     console.error("Update coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Delete coupon (admin only)
// router.delete("/coupons/:id", auth, async (req, res) => {
//   try {
//     const coupon = await Coupon.findById(req.params.id)
//     if (!coupon) {
//       return res.status(404).json({ message: "Coupon not found" })
//     }

//     await Coupon.findByIdAndDelete(req.params.id)
//     res.json({ message: "Coupon deleted successfully" })
//   } catch (error) {
//     console.error("Delete coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// // Validate coupon (public route for checkout)
// router.post("/coupons/validate", async (req, res) => {
//   try {
//     const { code, orderTotal } = req.body

//     if (!code || orderTotal === undefined) {
//       return res.status(400).json({ message: "Coupon code and order total are required" })
//     }

//     const coupon = await Coupon.findOne({ code: code.toUpperCase() })
//     if (!coupon) {
//       return res.status(404).json({ message: "Invalid coupon code" })
//     }

//     if (!coupon.isValid()) {
//       let message = "Coupon is not valid"
//       const now = new Date()

//       if (!coupon.isActive) {
//         message = "Coupon is inactive"
//       } else if (now < coupon.validFrom) {
//         message = "Coupon is not yet active"
//       } else if (now > coupon.validUntil) {
//         message = "Coupon has expired"
//       } else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
//         message = "Coupon usage limit reached"
//       }

//       return res.status(400).json({ message })
//     }

//     if (orderTotal < coupon.minimumOrderAmount) {
//       return res.status(400).json({
//         message: `Minimum order amount of $${coupon.minimumOrderAmount} required`,
//       })
//     }

//     const discountAmount = coupon.calculateDiscount(orderTotal)
//     const newTotal = orderTotal - discountAmount

//     res.json({
//       valid: true,
//       coupon: {
//         code: coupon.code,
//         description: coupon.description,
//         discountType: coupon.discountType,
//         discountValue: coupon.discountValue,
//       },
//       discountAmount,
//       newTotal,
//     })
//   } catch (error) {
//     console.error("Validate coupon error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// module.exports = router




































































































































const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const Coupon = require("../models/Coupon")
const auth = require("../middleware/auth")
const { sendStatusUpdate } = require("../utils/notifications")

const router = express.Router()

// Get dashboard stats (admin only)
router.get("/dashboard", auth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()
    const pendingOrders = await Order.countDocuments({ orderStatus: "processing" })

    const processingOrders = await Order.countDocuments({ orderStatus: "processing" })
    const confirmedOrders = await Order.countDocuments({ orderStatus: "confirmed" })
    const shippedOrders = await Order.countDocuments({ orderStatus: "shipped" })
    const enRouteOrders = await Order.countDocuments({ orderStatus: "enroute" })
    const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" })
    const cancelledOrders = await Order.countDocuments({ orderStatus: "cancelled" })

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ])

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate("items.product", "name")

    const stats = {
      totalOrders,
      totalProducts,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      processingOrders,
      confirmedOrders,
      shippedOrders,
      enRouteOrders,
      deliveredOrders,
      cancelledOrders,
    }

    res.json({
      stats,
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
      },
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

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate("items.product", "name")

    // Transform the data to match the expected format
    const payments = orders.map((order) => ({
      _id: order._id,
      transactionId: order.paymentDetails?.transactionId,
      receiptUrl: order.paymentDetails?.receiptImage,
      isVerified: order.paymentStatus === "paid" ? true : order.paymentStatus === "rejected" ? false : null,
      notes: order.paymentDetails?.adminNotes,
      createdAt: order.paymentDetails?.paymentConfirmedAt || order.createdAt,
      order: {
        orderNumber: order.orderNumber,
        customerInfo: order.customerInfo,
        paymentMethod: order.paymentMethod,
        total: order.total,
      },
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
      },
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all coupons (admin only)
router.get("/coupons", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query

    const query = {}
    if (status === "active") {
      query.isActive = true
      query.validUntil = { $gte: new Date() }
    } else if (status === "expired") {
      query.validUntil = { $lt: new Date() }
    } else if (status === "inactive") {
      query.isActive = false
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("createdBy", "username")

    const total = await Coupon.countDocuments(query)

    res.json({
      coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get coupons error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new coupon (admin only)
router.post("/coupons", auth, async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      applicableCategories,
    } = req.body

    // Validate required fields
    if (!code || !description || !discountType || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Validate discount value
    if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({ message: "Percentage discount must be between 1 and 100" })
    }

    if (discountType === "fixed" && discountValue <= 0) {
      return res.status(400).json({ message: "Fixed discount must be greater than 0" })
    }

    // Validate dates
    if (new Date(validFrom) >= new Date(validUntil)) {
      return res.status(400).json({ message: "Valid from date must be before valid until date" })
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumOrderAmount: minimumOrderAmount || 0,
      maxDiscountAmount: discountType === "percentage" ? maxDiscountAmount : null,
      usageLimit,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      applicableCategories: applicableCategories || [],
      createdBy: req.admin._id,
    })

    await coupon.save()
    await coupon.populate("createdBy", "username")

    res.status(201).json(coupon)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Coupon code already exists" })
    }
    console.error("Create coupon error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update coupon (admin only)
router.put("/coupons/:id", auth, async (req, res) => {
  try {
    const {
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      isActive,
      applicableCategories,
    } = req.body

    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    // Validate discount value if provided
    if (discountValue !== undefined) {
      if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
        return res.status(400).json({ message: "Percentage discount must be between 1 and 100" })
      }
      if (discountType === "fixed" && discountValue <= 0) {
        return res.status(400).json({ message: "Fixed discount must be greater than 0" })
      }
    }

    // Validate dates if provided
    if (validFrom && validUntil && new Date(validFrom) >= new Date(validUntil)) {
      return res.status(400).json({ message: "Valid from date must be before valid until date" })
    }

    // Update fields
    if (description !== undefined) coupon.description = description
    if (discountType !== undefined) coupon.discountType = discountType
    if (discountValue !== undefined) coupon.discountValue = discountValue
    if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount
    if (maxDiscountAmount !== undefined)
      coupon.maxDiscountAmount = discountType === "percentage" ? maxDiscountAmount : null
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit
    if (validFrom !== undefined) coupon.validFrom = new Date(validFrom)
    if (validUntil !== undefined) coupon.validUntil = new Date(validUntil)
    if (isActive !== undefined) coupon.isActive = isActive
    if (applicableCategories !== undefined) coupon.applicableCategories = applicableCategories

    await coupon.save()
    await coupon.populate("createdBy", "username")

    res.json(coupon)
  } catch (error) {
    console.error("Update coupon error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete coupon (admin only)
router.delete("/coupons/:id", auth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ message: "Coupon deleted successfully" })
  } catch (error) {
    console.error("Delete coupon error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Validate coupon (public route for checkout)
router.post("/coupons/validate", async (req, res) => {
  try {
    const { code, orderTotal } = req.body

    if (!code || orderTotal === undefined) {
      return res.status(400).json({ message: "Coupon code and order total are required" })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" })
    }

    if (!coupon.isValid()) {
      let message = "Coupon is not valid"
      const now = new Date()

      if (!coupon.isActive) {
        message = "Coupon is inactive"
      } else if (now < coupon.validFrom) {
        message = "Coupon is not yet active"
      } else if (now > coupon.validUntil) {
        message = "Coupon has expired"
      } else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        message = "Coupon usage limit reached"
      }

      return res.status(400).json({ message })
    }

    if (orderTotal < coupon.minimumOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of $${coupon.minimumOrderAmount} required`,
      })
    }

    const discountAmount = coupon.calculateDiscount(orderTotal)
    const newTotal = orderTotal - discountAmount

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      newTotal,
    })
  } catch (error) {
    console.error("Validate coupon error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
