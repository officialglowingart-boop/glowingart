const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customerInfo: {
      email: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        size: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        image: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    shippingProtection: {
      enabled: {
        type: Boolean,
        default: false,
      },
      cost: {
        type: Number,
        default: 0,
      },
    },
    discountCode: {
      code: String,
      discount: {
        type: Number,
        default: 0,
      },
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
      },
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      // Allow all front-end options, including USDT (TRC-20)
      enum: ["JazzCash", "EasyPaisa", "Bank Transfer", "USDT (TRC-20)", "Crypto", "COD"],
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed", "refunded", "rejected"],
    },
    paymentDetails: {
      transactionId: String,
      receiptImage: String, // URL to uploaded receipt
      paymentConfirmedAt: Date,
      adminNotes: String, // Admin notes about payment verification
    },
    orderStatus: {
      type: String,
      default: "processing",
  enum: ["processing", "confirmed", "shipped", "enroute", "delivered", "cancelled"],
    },
    notes: String,
  },
  {
    timestamps: true,
  },
)

// Generate order number before saving
orderSchema.pre("validate", async function (next) {
  if (!this.orderNumber) {
    // Generate random 8-digit order number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000)
    const timestamp = Date.now().toString().slice(-4) // Last 4 digits of timestamp
    this.orderNumber = `GG${randomNumber}${timestamp}`
  }
  next()
})

orderSchema.post("save", async (doc) => {
  if (doc.paymentStatus === "paid" && doc.discountCode?.couponId) {
    const Coupon = mongoose.model("Coupon")
    await Coupon.findByIdAndUpdate(doc.discountCode.couponId, { $inc: { usedCount: 1 } })
  }
})

module.exports = mongoose.model("Order", orderSchema)
