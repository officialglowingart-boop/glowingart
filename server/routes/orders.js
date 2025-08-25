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

    const stripInvisibles = (str = "") =>
      String(str)
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width characters
        .replace(/\u00A0/g, " ") // non-breaking space -> normal space
        .replace(/[\u2000-\u206F]/g, " ") // additional Unicode spaces
        .replace(/\s+/g, " ") // collapse spaces
        .trim()

    const validateEmail = (email) => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
      const cleanEmail = stripInvisibles(email).toLowerCase()
      return emailRegex.test(cleanEmail) && !cleanEmail.includes("..") && cleanEmail.length > 5
    }

    // Normalize customer fields to prevent mobile autofill whitespace/issues
    const normalizedCustomer = {
      ...customerInfo,
      firstName: stripInvisibles(customerInfo?.firstName),
      lastName: stripInvisibles(customerInfo?.lastName),
      email: stripInvisibles(customerInfo?.email).toLowerCase(),
      phone: stripInvisibles(customerInfo?.phone).replace(/\s+/g, ""),
      address: stripInvisibles(customerInfo?.address),
      city: stripInvisibles(customerInfo?.city),
      postalCode: stripInvisibles(customerInfo?.postalCode),
      country: stripInvisibles(customerInfo?.country),
    }

    if (!normalizedCustomer.email || !validateEmail(normalizedCustomer.email)) {
      console.error("Invalid email provided:", customerInfo?.email, "normalized:", normalizedCustomer.email)
      return res.status(400).json({
        message: "Please provide a valid email address",
        details: "Email format is invalid or contains unsupported characters",
      })
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

    console.log("📦 Order created successfully:", order.orderNumber, "for", normalizedCustomer.email)
    console.log("📦 Payment method:", paymentMethod)
    console.log("📦 Email will be sent only after confirmation")

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

    try {
      console.log("📧 Sending order confirmation after payment proof submission for:", order.orderNumber)
      const userAgent = req.get("User-Agent") || ""
      const result = await sendOrderConfirmation(order, userAgent, req.ip)

      if (result.success) {
        console.log("📧 Order confirmation sent successfully after payment proof for:", order.orderNumber)
      } else {
        console.error("📧 Order confirmation failed after payment proof:", result.error)
      }
    } catch (notificationError) {
      console.error("❌ Email notification failed after payment proof for order:", order.orderNumber)
      console.error("   Error:", notificationError?.message || notificationError)
    }

    res.json({
      message: "Payment details submitted successfully",
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
      },
    })
  } catch (error) {
    console.error("Payment update error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.patch("/:orderId/confirm-cod", async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findOne({ orderNumber: orderId })
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.paymentMethod !== "COD") {
      return res.status(400).json({ message: "This endpoint is only for COD orders" })
    }

    // Update order status to confirmed
    order.paymentStatus = "confirmed"
    order.status = "confirmed"
    await order.save()

    // Send email notification for COD confirmation
    try {
      console.log("📧 Sending order confirmation for COD order:", order.orderNumber)
      const userAgent = req.get("User-Agent") || ""
      const result = await sendOrderConfirmation(order, userAgent, req.ip)

      if (result.success) {
        console.log("📧 COD order confirmation sent successfully for:", order.orderNumber)
      } else {
        console.error("📧 COD order confirmation failed:", result.error)
      }
    } catch (notificationError) {
      console.error("❌ Email notification failed for COD order:", order.orderNumber)
      console.error("   Error:", notificationError?.message || notificationError)
    }

    res.json({
      message: "COD order confirmed successfully",
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
    })
  } catch (error) {
    console.error("COD confirmation error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
