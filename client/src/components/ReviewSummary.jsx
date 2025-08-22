"use client"

import { useEffect, useState } from "react"
import { getProductReviewSummary } from "../services/api"

const ReviewSummary = ({ productId }) => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetch = async () => {
      try {
    const res = await getProductReviewSummary(productId)
    setSummary(res)
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

  if (!summary || !summary.total) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-600">
        No reviews yet
      </div>
    )
  }

  const average = (summary.average || 0).toFixed(1)
  const total = summary.total || 0
  const starCounts = summary.starCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4 sm:gap-6 flex-wrap">
        <div>
          <h3 className="text-base sm:text-xl font-semibold text-gray-900">Customer Reviews</h3>
          <p className="text-xs sm:text-sm text-gray-600">Based on {total} review{total > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
          <div className="text-2xl sm:text-3xl">⭐</div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{average}</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Average rating</div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 space-y-2">
        {[5,4,3,2,1].map((star) => {
          const count = starCounts[star] || 0
          const percent = total ? Math.round((count / total) * 100) : 0
          return (
            <div key={star} className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 sm:w-10 text-xs sm:text-sm text-gray-700">{star}★</div>
              <div className="flex-1 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }} />
              </div>
              <div className="w-8 sm:w-10 text-right text-xs sm:text-sm text-gray-600">{count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReviewSummary
