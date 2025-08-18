const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null, // Only for percentage discounts
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableCategories: [
      {
        type: String, // Can be used to restrict to specific categories
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster lookups
couponSchema.index({ code: 1 })
couponSchema.index({ validFrom: 1, validUntil: 1 })

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date()
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  )
}

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderTotal) {
  if (!this.isValid() || orderTotal < this.minimumOrderAmount) {
    return 0
  }

  let discount = 0
  if (this.discountType === "percentage") {
    discount = (orderTotal * this.discountValue) / 100
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount
    }
  } else {
    discount = this.discountValue
  }

  return Math.min(discount, orderTotal)
}

module.exports = mongoose.model("Coupon", couponSchema)
