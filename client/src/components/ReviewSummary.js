"use client"

import { useEffect, useState } from "react"
import { getProductReviews } from "../services/api"

const ReviewSummary = ({ productId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProductReviews(productId)
        setReviews(res.reviews || [])
      } catch (e) {
        console.error("Error fetching reviews:", e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [productId])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-600">
        Loading reviews...
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-600">
        No reviews yet
      </div>
    )
  }

  const average = (
    reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
  ).toFixed(1)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
          <p className="text-sm text-gray-600">Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <div className="text-3xl">⭐</div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{average}</div>
            <div className="text-xs text-gray-500">Average rating</div>
          </div>
        </div>
      </div>

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
  )
}

export default ReviewSummary
