"use client"

import { useState, useEffect } from "react"
import { getAdminReviews, updateReviewStatus, deleteReview } from "../../services/api"

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {}
      const response = await getAdminReviews(params)
      setReviews(response.reviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (reviewId, isApproved) => {
    try {
      await updateReviewStatus(reviewId, { isApproved })
      fetchReviews()
      alert(`Review ${isApproved ? "approved" : "rejected"} successfully`)
    } catch (error) {
      console.error("Error updating review status:", error)
      alert("Error updating review status")
    }
  }

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId)
        fetchReviews()
        alert("Review deleted successfully")
      } catch (error) {
        console.error("Error deleting review:", error)
        alert("Error deleting review")
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Review Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === "all" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === "approved" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Approved
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="font-semibold text-lg">{review.customerName}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {review.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Product: {review.product?.name} | Order: {review.orderNumber}
                </p>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <p className="text-xs text-gray-500">Submitted: {new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {review.images && review.images.length > 0 && (
              <div className="grid grid-cols-6 gap-2 mb-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url || "/placeholder.svg"}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => window.open(image.url, "_blank")}
                  />
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              {!review.isApproved && (
                <button
                  onClick={() => handleStatusUpdate(review._id, true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Approve
                </button>
              )}
              {review.isApproved && (
                <button
                  onClick={() => handleStatusUpdate(review._id, false)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => handleDelete(review._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews found for the selected filter.</p>
        </div>
      )}
    </div>
  )
}

export default ReviewManagement
