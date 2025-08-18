const express = require("express")
const Coupon = require("../models/Coupon")
const router = express.Router()

// Validate coupon (public route for checkout)
router.post("/validate", async (req, res) => {
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
        _id: coupon._id,
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
