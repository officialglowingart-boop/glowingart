const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Limited Designs", "One Piece", "More Anime", "Never Forgotten"],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    sizes: [
      {
        name: {
          type: String,
          required: true,
          enum: ["Small", "Large"],
        },
        price: {
          type: Number,
          required: true,
        },
        originalPrice: {
          type: Number,
        },
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Product", productSchema)
