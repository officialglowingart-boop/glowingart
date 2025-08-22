

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

    const userAgent = req.headers["user-agent"] || ""
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    console.log(`📱 Device type: ${isMobile ? "Mobile" : "Desktop"} - User Agent: ${userAgent}`)

    const { customerInfo, items, subtotal, shippingProtection, discountCode, total, paymentMethod, notes } = req.body

    // Helpers to sanitize common mobile autofill artifacts (zero-width chars, NBSP, etc.)
    const stripInvisibles = (str = "") =>
      String(str)
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width characters
        .replace(/\u00A0/g, " ") // non-breaking space -> normal space
        .replace(/\s+/g, " ") // collapse spaces
        .trim()

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

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!normalizedCustomer.email || !emailRegex.test(normalizedCustomer.email)) {
      console.error(`❌ Invalid email from ${isMobile ? "mobile" : "desktop"}: "${normalizedCustomer.email}"`)
      return res.status(400).json({ message: "Please provide a valid email address" })
    }

    console.log(`✅ Email validated for ${isMobile ? "mobile" : "desktop"}: ${normalizedCustomer.email}`)

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

    const emailPromise = (async () => {
      try {
        console.log(
          `📧 [${isMobile ? "MOBILE" : "DESKTOP"}] Triggering order confirmation for:`,
          order.orderNumber,
          normalizedCustomer.email,
        )

        // Add timeout protection for mobile connections
        const emailTimeout = isMobile ? 15000 : 30000 // 15s for mobile, 30s for desktop
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Email timeout after ${emailTimeout}ms`)), emailTimeout),
        )

        await Promise.race([sendOrderConfirmation(order, isMobile), timeoutPromise])

        console.log(
          `📧 [${isMobile ? "MOBILE" : "DESKTOP"}] Order confirmation sent successfully for:`,
          order.orderNumber,
        )
        return { success: true }
      } catch (notificationError) {
        console.error(
          `❌ [${isMobile ? "MOBILE" : "DESKTOP"}] Notification error (order: ${order.orderNumber}):`,
          notificationError?.message || notificationError,
        )
        // Log additional details for mobile debugging
        if (isMobile) {
          console.error(`📱 Mobile-specific error details:`, {
            errorCode: notificationError?.code,
            errorType: notificationError?.name,
            stack: notificationError?.stack?.split("\n")[0],
          })
        }
        return { success: false, error: notificationError?.message }
      }
    })()

    if (isMobile) {
      // Fire and forget for mobile - respond immediately
      emailPromise.catch(() => {}) // Prevent unhandled promise rejection
      console.log(`📱 Mobile order created, email sending in background`)
    } else {
      // Wait for email on desktop (existing behavior)
      await emailPromise
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
      },
    })
  } catch (error) {
    console.error("Payment update error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
