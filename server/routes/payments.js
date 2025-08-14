const express = require("express")
const Order = require("../models/Order")
const { sendPaymentInstructions } = require("../utils/notifications")
const { upload } = require("../middleware/upload")
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

router.post("/confirm/:orderNumber", upload.single("receipt"), async (req, res) => {
  try {
    const { transactionId, notes } = req.body

    const order = await Order.findOne({ orderNumber: req.params.orderNumber })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Create payment verification record
    const paymentVerification = new PaymentVerification({
      order: order._id,
      transactionId,
      receiptUrl: req.file ? req.file.path : null,
      notes,
    })

    await paymentVerification.save()

    // Update order status to payment pending verification
    order.paymentStatus = "pending_verification"
    order.orderStatus = "payment_submitted"

    await order.save()

    // Send confirmation notification
    try {
      await sendPaymentInstructions(order, "payment_submitted")
    } catch (notificationError) {
      console.error("Notification error:", notificationError)
    }

    res.json({
      message: "Payment confirmation submitted successfully",
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    })
  } catch (error) {
    console.error("Confirm payment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

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
      order.paymentStatus = "failed"
      order.orderStatus = "payment_failed"
    }
    await order.save()

    res.json({ message: "Payment verification updated successfully", payment })
  } catch (error) {
    res.status(500).json({ message: "Error updating payment verification", error: error.message })
  }
})

module.exports = router
