const mongoose = require("mongoose")

const paymentVerificationSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
    },
    receiptUrl: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: null, // null = pending, true = verified, false = rejected
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("PaymentVerification", paymentVerificationSchema)
