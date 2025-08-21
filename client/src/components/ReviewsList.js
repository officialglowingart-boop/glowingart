"use client"

import { useState, useEffect } from "react"
import { getProductReviews } from "../services/api"

const ReviewsList = ({ productId, showSummary = true }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const getPageSize = () => {
    if (typeof window === 'undefined') return 6
    return window.matchMedia('(min-width: 1024px)').matches ? 10 : 6
  }
  const [pageSize, setPageSize] = useState(getPageSize())

  useEffect(() => {
    // reset when product changes
    setReviews([])
    setPage(1)
    setHasMore(true)
    fetchReviews(1, getPageSize())
  }, [productId])

  // Update page size on resize and refetch from page 1
  useEffect(() => {
    const handler = () => {
      const size = getPageSize()
      setPageSize(size)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // When page size changes (e.g., due to resize), reset and refetch first page
  useEffect(() => {
    setReviews([])
    setPage(1)
    setHasMore(true)
    fetchReviews(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize])

  const fetchReviews = async (nextPage = page, limitOverride) => {
    try {
      setLoading(true)
      const limit = typeof limitOverride === 'number' ? limitOverride : pageSize
      const response = await getProductReviews(productId, { page: nextPage, limit })
      const newReviews = response.reviews || []
      setReviews((prev) => (nextPage === 1 ? newReviews : [...prev, ...newReviews]))
      const totalPages = response.totalPages || 1
      setHasMore(nextPage < totalPages)
      setPage(nextPage)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
        Loading reviews...
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-gray-700 font-semibold mb-1">No reviews yet</p>
        <p className="text-gray-500 text-sm">Be the first to review this product!</p>
      </div>
    )
  }

  return (
  <div className="space-y-8">
      {/* Summary */}
      {showSummary && (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
            <p className="text-sm text-gray-600">Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl">⭐</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{(
                reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
              ).toFixed(1)}</div>
              <div className="text-xs text-gray-500">Average rating</div>
            </div>
          </div>
        </div>
        {/* Histogram */}
        <div className="mt-6 space-y-2">
          {[5,4,3,2,1].map((star) => {
            const count = reviews.filter(r => r.rating === star).length
            const percent = Math.round((count / reviews.length) * 100)
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="w-10 text-sm text-gray-700">{star}★</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }} />
                </div>
                <div className="w-10 text-right text-sm text-gray-600">{count}</div>
              </div>
            )
          })}
        </div>
      </div>
      )}

      {/* Reviews masonry-style: 2 columns on mobile, 4 on desktop */}
      <div className="columns-2 lg:columns-4 gap-4 md:gap-6 [column-fill:_balance]">
        {reviews.map((review) => (
          <div key={review._id} className="mb-4 md:mb-6 break-inside-avoid" style={{ breakInside: 'avoid' }}>
            <div className="bg-white rounded-1xl border border-gray-200 p-2 sm:p-4 relative">
              {/* Row 1: Verified (left) + Date (right) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-xs text-gray-500 ml-1">Verified</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Row 2: Name (left) + Stars (right on desktop, below on mobile) */}
              <div className="flex flex-col items-start gap-0 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
                <h4 className="font-semibold text-gray-900 pr-3 whitespace-normal leading-tight lg:truncate">{review.customerName}</h4>
                <div className="mt-0 lg:mt-0 flex-shrink-0">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-base ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-700">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
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

              {/* Footer: Customer avatar + name */}
              <div className="mt-2 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                  {getInitials(review.customerName)}
                </div>
                <span className="ml-2 text-sm text-gray-600">{review.customerName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

  {hasMore && (
        <div className="flex justify-center">
          <button
            className="px-6 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
    onClick={() => fetchReviews(page + 1)}
          >
    Load more
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewsList
