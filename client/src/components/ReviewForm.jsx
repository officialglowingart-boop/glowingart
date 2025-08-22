"use client"

import { useState } from "react"
import { createReview } from "../services/api"

const ReviewForm = ({ productId, orderNumber, customerEmail, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: customerEmail || "",
    orderNumber: orderNumber || "",
    rating: 5,
    comment: "",
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateForm = () => {
    const trimmedName = formData.customerName.trim()
    const trimmedEmail = formData.customerEmail.trim().toLowerCase()
    const trimmedOrderNumber = formData.orderNumber.trim()
    const trimmedComment = formData.comment.trim()

    if (!trimmedName || trimmedName.length < 2) {
      return "Please enter a valid name (at least 2 characters)"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address"
    }

    if (!trimmedOrderNumber || trimmedOrderNumber.length < 5) {
      return "Please enter a valid order number"
    }

    if (!trimmedComment || trimmedComment.length < 10) {
      return "Please write a review with at least 10 characters"
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const validationError = validateForm()
      if (validationError) {
        setError(validationError)
        setLoading(false)
        return
      }

      const sanitizedData = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim().toLowerCase(),
        orderNumber: formData.orderNumber.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
      }

      const reviewData = new FormData()
      reviewData.append("productId", productId)
      reviewData.append("customerName", sanitizedData.customerName)
      reviewData.append("customerEmail", sanitizedData.customerEmail)
      reviewData.append("orderNumber", sanitizedData.orderNumber)
      reviewData.append("rating", sanitizedData.rating)
      reviewData.append("comment", sanitizedData.comment)

      // Append images
      images.forEach((image) => {
        reviewData.append("images", image)
      })

      await createReview(reviewData)
      alert("Review submitted successfully! It will be visible after approval.")

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: customerEmail || "",
        orderNumber: orderNumber || "",
        rating: 5,
        comment: "",
      })
      setImages([])
      onReviewSubmitted && onReviewSubmitted()
    } catch (error) {
      console.error("Error submitting review:", error)
      const errorMessage = error.response?.data?.message || "Error submitting review. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field === "orderNumber") {
      // Remove any whitespace characters including tabs and newlines
      value = value.replace(/\s/g, "")
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed")
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      {customerEmail && orderNumber ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Order Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Order Number:</span>
                <span className="ml-2 text-gray-800">{orderNumber}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-gray-800">{customerEmail}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Information Required</h3>
          <p className="text-gray-600 mb-6">
            To ensure authentic reviews, please provide your order details. This information will be verified before
            your review is published.
          </p>
        </>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!customerEmail && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange("customerEmail", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Enter the email used for your order"
              required
            />
          </div>
        )}

        {!orderNumber && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Number *</label>
            <input
              type="text"
              value={formData.orderNumber}
              onChange={(e) => handleInputChange("orderNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Enter your order number"
              required
              minLength="5"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can only review products you have purchased. Please enter your order number.
            </p>
          </div>
        )}

        {customerEmail && orderNumber && (
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Write Your Review</h4>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
            minLength="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange("rating", star)}
                className={`text-2xl ${star <= formData.rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleInputChange("comment", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows="4"
            placeholder="Share your experience with this product..."
            required
            minLength="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Optional)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum 5 images allowed</p>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
