const express = require("express")
const Order = require("../models/Order")
const { sendPaymentInstructions, sendStatusUpdate } = require("../utils/notifications")
const { upload, hasCloudinaryConfig } = require("../middleware/upload")
const { authenticateAdmin } = require("../middleware/auth")

const router = express.Router()

const PaymentVerification = require("../models/PaymentVerification")

// Generate payment instructions based on method
const generatePaymentInstructions = (paymentMethod, order) => {
  const instructions = {
    JazzCash: {
      title: "JazzCash Payment Instructions",
      steps: [
        "Open your JazzCash mobile app",
        "Select 'Send Money' or 'Money Transfer'",
        `Send Rs.${order.total.toLocaleString()} to: 03001234567`,
        `Reference: ${order.orderNumber}`,
        "Take a screenshot of the transaction",
        "Upload the screenshot and transaction ID below",
      ],
      accountDetails: {
        accountTitle: "Glowing Gallery",
        accountNumber: "03001234567",
        reference: order.orderNumber,
      },
    },
  Easypaisa: {
      title: "Easypaisa Payment Instructions",
      steps: [
        "Open your Easypaisa mobile app",
        "Select 'Send Money'",
        `Send Rs.${order.total.toLocaleString()} to: 03009876543`,
        `Reference: ${order.orderNumber}`,
        "Take a screenshot of the transaction",
        "Upload the screenshot and transaction ID below",
      ],
      accountDetails: {
        accountTitle: "Glowing Gallery",
        accountNumber: "03009876543",
        reference: order.orderNumber,
      },
    },
    // Alias to support client sending 'EasyPaisa'
    EasyPaisa: {
      title: "Easypaisa Payment Instructions",
      steps: [
        "Open your Easypaisa mobile app",
        "Select 'Send Money'",
        `Send Rs.${order.total.toLocaleString()} to: 03009876543`,
        `Reference: ${order.orderNumber}`,
        "Take a screenshot of the transaction",
        "Upload the screenshot and transaction ID below",
      ],
      accountDetails: {
        accountTitle: "Glowing Gallery",
        accountNumber: "03009876543",
        reference: order.orderNumber,
      },
    },
    "Bank Transfer": {
      title: "Bank Transfer Instructions",
      steps: [
        "Visit your bank or use online banking",
        "Transfer the exact amount to our account",
        `Amount: Rs.${order.total.toLocaleString()}`,
        `Reference: ${order.orderNumber}`,
        "Keep the transaction receipt",
        "Upload receipt photo and transaction details below",
      ],
      accountDetails: {
        bankName: "HBL Bank",
        accountTitle: "Glowing Gallery",
        accountNumber: "12345678901234",
        iban: "PK36HABB0012345678901234",
        reference: order.orderNumber,
      },
    },
  Crypto: {
      title: "Cryptocurrency Payment Instructions",
      steps: [
        "Choose your preferred cryptocurrency",
        `Send exact amount equivalent to Rs.${order.total.toLocaleString()}`,
        "Use the wallet address provided below",
        `Include reference: ${order.orderNumber}`,
        "Upload transaction hash and screenshot below",
        "Payment will be confirmed within 1 hour",
      ],
      walletAddresses: {
        bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        ethereum: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e3e3",
        usdt: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        reference: order.orderNumber,
      },
    },
    // Direct USDT TRC-20 method support
    "USDT (TRC-20)": {
      title: "USDT (TRC-20) Payment Instructions",
      steps: [
        `Send USDT (TRC-20) equivalent to Rs.${order.total.toLocaleString()}`,
        "Use the wallet address provided below",
        `Include reference: ${order.orderNumber}`,
        "Upload transaction hash and screenshot below",
        "Payment will be confirmed within 1 hour",
      ],
      walletAddresses: {
        usdt_trc20: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        reference: order.orderNumber,
      },
    },
    COD: {
      title: "Cash on Delivery",
      steps: [
        "Your order will be prepared for delivery",
        "Our delivery partner will contact you",
        "Pay the exact amount upon delivery",
        `Amount to pay: Rs.${order.total.toLocaleString()}`,
        "Please keep exact change ready",
        "COD fee: Rs.150 (for orders under Rs.2,000)",
      ],
      note: "COD is available in major cities only. Delivery time: 3-5 business days.",
    },
  }

  return instructions[paymentMethod] || null
}

// Get payment instructions for an order
router.get("/instructions/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    const instructions = generatePaymentInstructions(order.paymentMethod, order)

    if (!instructions) {
      return res.status(400).json({ message: "Invalid payment method" })
    }

    res.json({
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        shippingProtection: order.shippingProtection,
        paymentMethod: order.paymentMethod,
        customerEmail: order.customerInfo.email,
      },
      instructions,
    })
  } catch (error) {
    console.error("Get payment instructions error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Confirm payment submission (receipt required)
router.post(
  "/confirm/:orderNumber",
  (req, res, next) => {
    // wrap multer to capture errors and return friendly message
    upload.single("receipt")(req, res, (err) => {
      if (err) {
        const code = err.statusCode || 400
        return res.status(code).json({ message: err.message || "File upload error" })
      }
      next()
    })
  },
  async (req, res) => {
  try {
    const { transactionId, notes } = req.body

    if (!transactionId || String(transactionId).trim().length < 3) {
      return res.status(400).json({ message: "Transaction ID is required" })
    }
    if (!req.file) {
      return res.status(400).json({ message: "Payment receipt is required" })
    }

    const order = await Order.findOne({ orderNumber: req.params.orderNumber })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Create payment verification record
    const paymentVerification = new PaymentVerification({
      order: order._id,
      transactionId,
  receiptUrl: req.file && hasCloudinaryConfig ? req.file.path : null,
      notes,
    })

    try {
      await paymentVerification.save()
    } catch (err) {
      console.error("PaymentVerification save error:", err)
      return res.status(400).json({ message: err.message || "Could not save payment verification" })
    }

    // Keep within allowed enums and avoid re-validating unrelated fields (e.g., legacy paymentMethod values)
    let updatedOrder
    try {
      updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        { $set: { paymentStatus: "pending" } },
        { new: true, runValidators: false },
      )
    } catch (err) {
      console.error("Order update error:", err)
      return res.status(400).json({ message: err.message || "Could not update order status" })
    }

    // Send confirmation notification
    try {
  await sendPaymentInstructions(updatedOrder || order, "payment_submitted")
    } catch (notificationError) {
      console.error("Notification error:", notificationError)
    }

    res.json({
      message: "Payment confirmation submitted successfully",
      order: {
        orderNumber: (updatedOrder || order).orderNumber,
        paymentStatus: (updatedOrder || order).paymentStatus,
        orderStatus: (updatedOrder || order).orderStatus,
      },
    })
  } catch (error) {
    console.error("Confirm payment error:", error)
    res.status(500).json({ message: error?.message || "Server error" })
  }
}
)

router.get("/admin/verifications", authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = {}

    if (status === "pending") query.isVerified = null
    if (status === "verified") query.isVerified = true
    if (status === "rejected") query.isVerified = false

    const payments = await PaymentVerification.find(query)
      .populate("order")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await PaymentVerification.countDocuments(query)

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment verifications", error: error.message })
  }
})

router.put("/admin/verify/:id", authenticateAdmin, async (req, res) => {
  try {
    const { isVerified, notes } = req.body

    const payment = await PaymentVerification.findByIdAndUpdate(
      req.params.id,
      { isVerified, adminNotes: notes, verifiedAt: new Date() },
      { new: true },
    ).populate("order")

    if (!payment) {
      return res.status(404).json({ message: "Payment verification not found" })
    }

    // Update order status based on verification
    const order = await Order.findById(payment.order._id)
    if (isVerified) {
      order.paymentStatus = "paid"
      order.orderStatus = "confirmed"
    } else {
  order.paymentStatus = "rejected"
  // keep orderStatus unchanged or set to 'cancelled' if that's the intended business rule
    }
    await order.save()

  // Notify customer on verification result
    try {
      if (isVerified) {
        await sendPaymentInstructions(order, "confirmed")
      } else {
    // For rejected payments, send a status update so the customer is informed
    await sendStatusUpdate(order)
      }
    } catch (notificationError) {
      console.error("Notification error:", notificationError)
    }

    res.json({ message: "Payment verification updated successfully", payment })
  } catch (error) {
    res.status(500).json({ message: "Error updating payment verification", error: error.message })
  }
})

module.exports = router
