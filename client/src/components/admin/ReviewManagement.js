"use client"

import { useState, useEffect } from "react"
import { getAdminReviews, updateReviewStatus, deleteReview } from "../../services/api"

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("pending")
  const [selectedReviews, setSelectedReviews] = useState([])
  const [showImageModal, setShowImageModal] = useState(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = filter !== "all" ? { status: filter } : {}
      const response = await getAdminReviews(params)
      setReviews(response.reviews || [])

      // Calculate stats
      const allReviewsResponse = await getAdminReviews({})
      const allReviews = allReviewsResponse.reviews || []
      setStats({
        total: allReviews.length,
        pending: allReviews.filter((r) => r.isApproved === false).length,
        approved: allReviews.filter((r) => r.isApproved === true).length,
        rejected: allReviews.filter((r) => r.isApproved === null).length,
      })
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
      setSelectedReviews([])
      alert(`Review ${isApproved ? "approved" : "rejected"} successfully`)
    } catch (error) {
      console.error("Error updating review status:", error)
      alert("Error updating review status")
    }
  }

  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) return

    if (window.confirm(`Are you sure you want to approve ${selectedReviews.length} selected reviews?`)) {
      try {
        await Promise.all(selectedReviews.map((id) => updateReviewStatus(id, { isApproved: true })))
        fetchReviews()
        setSelectedReviews([])
        alert(`${selectedReviews.length} reviews approved successfully`)
      } catch (error) {
        console.error("Error bulk approving reviews:", error)
        alert("Error approving reviews")
      }
    }
  }

  const handleBulkReject = async () => {
    if (selectedReviews.length === 0) return

    if (window.confirm(`Are you sure you want to reject ${selectedReviews.length} selected reviews?`)) {
      try {
        await Promise.all(selectedReviews.map((id) => updateReviewStatus(id, { isApproved: false })))
        fetchReviews()
        setSelectedReviews([])
        alert(`${selectedReviews.length} reviews rejected successfully`)
      } catch (error) {
        console.error("Error bulk rejecting reviews:", error)
        alert("Error rejecting reviews")
      }
    }
  }

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
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

  const toggleReviewSelection = (reviewId) => {
    setSelectedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]))
  }

  const selectAllReviews = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(reviews.map((r) => r._id))
    }
  }

  const getStatusColor = (review) => {
    if (review.isApproved === true) return "bg-green-100 text-green-800"
    if (review.isApproved === false) return "bg-red-100 text-red-800"
    return "bg-yellow-100 text-yellow-800"
  }

  const getStatusText = (review) => {
    if (review.isApproved === true) return "Approved"
    if (review.isApproved === false) return "Rejected"
    return "Pending"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        <span className="ml-2 text-gray-600">Loading reviews...</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header with Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Management</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "approved" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "rejected" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedReviews.length} review{selectedReviews.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Approve Selected
              </button>
              <button
                onClick={handleBulkReject}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Reject Selected
              </button>
              <button
                onClick={() => setSelectedReviews([])}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border mb-4">
          <div className="p-4 border-b bg-gray-50">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                onChange={selectAllReviews}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Select All ({reviews.length} reviews)</span>
            </label>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedReviews.includes(review._id)}
                onChange={() => toggleReviewSelection(review._id)}
                className="mt-1"
              />

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-lg text-gray-900">{review.customerName}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(review)}`}>
                      {getStatusText(review)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()} at{" "}
                    {new Date(review.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <strong>Product:</strong> {review.product?.name || "Unknown Product"}
                  </div>
                  <div>
                    <strong>Order:</strong> {review.orderNumber}
                  </div>
                  <div>
                    <strong>Email:</strong> {review.customerEmail}
                  </div>
                  <div>
                    <strong>Customer:</strong> {review.customerName}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Images:</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setShowImageModal(image.url)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {review.isApproved !== true && (
                    <button
                      onClick={() => handleStatusUpdate(review._id, true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      ✓ Approve
                    </button>
                  )}
                  {review.isApproved !== false && (
                    <button
                      onClick={() => handleStatusUpdate(review._id, false)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      ✗ Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {filter === "pending" ? "No reviews are currently pending approval." : `No ${filter} reviews found.`}
          </p>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={showImageModal || "/placeholder.svg"}
              alt="Review image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewManagement
