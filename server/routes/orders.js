const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const auth = require("../middleware/auth")
const { upload } = require("../middleware/upload")
const { sendOrderConfirmation } = require("../utils/notifications")

const router = express.Router()

// Create order (public)
router.post("/", async (req, res) => {
  try {
    console.log("Received order data:", JSON.stringify(req.body, null, 2))
    
    const { customerInfo, items, subtotal, shippingProtection, discountCode, total, paymentMethod, notes } = req.body

    // Normalize customer fields to prevent mobile autofill whitespace/issues
    const normalizedCustomer = {
      ...customerInfo,
      firstName: (customerInfo?.firstName || "").trim(),
      lastName: (customerInfo?.lastName || "").trim(),
      email: (customerInfo?.email || "").trim().toLowerCase(),
      phone: (customerInfo?.phone || "").trim(),
      address: (customerInfo?.address || "").trim(),
      city: (customerInfo?.city || "").trim(),
      postalCode: (customerInfo?.postalCode || "").trim(),
      country: (customerInfo?.country || "").trim(),
    }

    // Basic email validation to avoid nodemailer errors
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!normalizedCustomer.email || !emailRegex.test(normalizedCustomer.email)) {
      return res.status(400).json({ message: "Please provide a valid email address" })
    }

    // Validate products and calculate total
    let calculatedSubtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` })
      }

      const size = product.sizes.find((s) => s.name === item.size)
      if (!size) {
        return res.status(400).json({ message: `Size ${item.size} not available for ${product.name}` })
      }

      const itemTotal = size.price * item.quantity
      calculatedSubtotal += itemTotal

      orderItems.push({
        product: product._id,
        productName: product.name,
        size: item.size,
        quantity: item.quantity,
        price: size.price,
        image: product.images[0]?.url || "",
      })
    }

    // Calculate final total
    let finalTotal = calculatedSubtotal
    if (shippingProtection?.enabled) {
      finalTotal += shippingProtection.cost
    }
    if (discountCode?.discount) {
      finalTotal -= discountCode.discount
    }

    const order = new Order({
      customerInfo: normalizedCustomer,
      items: orderItems,
      subtotal: calculatedSubtotal,
      shippingProtection,
      discountCode,
      total: finalTotal,
      paymentMethod,
      notes,
    })

    await order.save()
    await order.populate("items.product")

    // Send confirmation notifications BEFORE responding to avoid serverless freeze dropping tasks
    try {
      console.log("📧 Triggering order confirmation for:", order.orderNumber, normalizedCustomer.email)
      await sendOrderConfirmation(order)
      console.log("📧 Order confirmation sent for:", order.orderNumber)
    } catch (notificationError) {
      console.error(
        "Notification error (order:",
        order.orderNumber,
        "):",
        notificationError?.message || notificationError,
      )
      // Do not fail order creation if notifications fail
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
      },
    })
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/track/:orderNumber", async (req, res) => {
  try {
    const { email } = req.query
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      "customerInfo.email": email,
    }).populate("items.product")

    if (!order) {
      return res.status(404).json({ message: "Order not found or email doesn't match" })
    }

    res.json({ order })
  } catch (error) {
    console.error("Track order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update payment details
router.patch("/:orderId/payment", upload.single("receiptImage"), async (req, res) => {
  try {
    const { orderId } = req.params
    const { transactionId } = req.body

    if (!transactionId || !req.file) {
      return res.status(400).json({ message: "Transaction ID and receipt image are required" })
    }

    const order = await Order.findOne({ orderNumber: orderId })
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.paymentDetails = {
      transactionId,
      receiptImage: req.file.path, // Cloudinary URL
      paymentConfirmedAt: new Date(),
    }
    
    // Update payment status to indicate payment proof submitted
    order.paymentStatus = "pending" // Will be confirmed by admin
    
    await order.save()

    res.json({ 
      message: "Payment details submitted successfully", 
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
      }
    })
  } catch (error) {
    console.error("Payment update error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
