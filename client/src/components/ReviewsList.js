"use client"

import { useState, useEffect } from "react"
import { getProductReviews } from "../services/api"

const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await getProductReviews(productId)
      setReviews(response.reviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Customer Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-800">{review.customerName}</h4>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{review.comment}</p>

          {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url || "/placeholder.svg"}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(image.url, "_blank")}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewsList
