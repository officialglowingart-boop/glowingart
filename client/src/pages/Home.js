"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { getProducts, getAllApprovedReviews, getCategories } from "../services/api"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])

  const [allReviews, setAllReviews] = useState([])
  const [displayedReviews, setDisplayedReviews] = useState([])
  const [reviewsToShow, setReviewsToShow] = useState(6)
  const [selectedRating, setSelectedRating] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(),
          getCategories(), // public: already returns active categories sorted by sortOrder
        ])
        setProducts(prodData.products || [])
        setCategories((catData && catData.categories) || [])
      } catch (err) {
        setError("Failed to load products")
        console.error("Error fetching home data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true)
        const response = await getAllApprovedReviews()
        setAllReviews(response.reviews || [])
        setDisplayedReviews((response.reviews || []).slice(0, reviewsToShow))
      } catch (error) {
        console.error("Error fetching reviews:", error)
        // Fallback to empty array if API fails
        setAllReviews([])
        setDisplayedReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Filter and update displayed reviews when rating filter or reviewsToShow changes
  useEffect(() => {
    let filteredReviews = allReviews

    if (selectedRating) {
      filteredReviews = allReviews.filter((review) => review.rating === selectedRating)
    }

    setDisplayedReviews(filteredReviews.slice(0, reviewsToShow))
  }, [selectedRating, reviewsToShow, allReviews])

  const groupProductsByCategory = (products) => {
    const grouped = {}
    const norm = (s = "") => s.toString().toLowerCase().replace(/\s+/g, " ").trim().replace(/[^a-z0-9 ]/gi, "")
    const labelMap = {}

    // Build a quick label preference map from categories list
    const catEntries = categories.map((c) => ({
      label: typeof c === "string" ? c : c?.name,
      key: norm(typeof c === "string" ? c : c?.name || ""),
    }))

    products.forEach((product) => {
      const raw = product.category || "Other"
      const key = norm(raw)
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(product)

      // Prefer label from categories list if available, else keep first seen raw
      if (!labelMap[key]) {
        const fromCat = catEntries.find((e) => e.key === key)
        labelMap[key] = fromCat?.label || raw
      }
    })
    return { grouped, labelMap, norm }
  }

  const StarRating = ({ rating }) => {
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    )
  }

  const handleViewMoreReviews = () => {
    setReviewsLoading(true)
    setTimeout(() => {
      setReviewsToShow((prev) => prev + 20)
      setReviewsLoading(false)
    }, 500)
  }

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating === selectedRating ? null : rating)
    setReviewsToShow(6)
  }

  const getFilteredReviewsCount = (rating) => {
    return allReviews.filter((review) => review.rating === rating).length
  }

  const getTotalFilteredReviews = () => {
    if (selectedRating) {
      return allReviews.filter((review) => review.rating === selectedRating).length
    }
    return allReviews.length
  }

  const hasMoreReviews = () => {
    return displayedReviews.length < getTotalFilteredReviews()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
        <div className="text-xl text-gray-600 font-serif">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
        <div className="text-xl text-red-600 font-serif">{error}</div>
      </div>
    )
  }

  const { grouped, labelMap, norm } = groupProductsByCategory(products)
  // Determine ordered category keys from categories (already sorted by sortOrder), then append leftover keys
  const orderedKeys = categories
    .map((c) => (typeof c === "string" ? c : c?.name))
    .filter(Boolean)
    .map((name) => norm(name))
  const leftovers = Object.keys(grouped).filter((k) => !orderedKeys.includes(k))
  const finalKeys = [...orderedKeys, ...leftovers]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
      {/* Products by Category */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">
        {finalKeys.map((key) => (
          grouped[key] && (
          <div key={key} className="mb-8 sm:mb-12 md:mb-16">
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-0 font-serif"
                style={{ fontFamily: 'Times, "Times New Roman", serif' }}
              >
                {labelMap[key]}
              </h2>
              <Link
                to={`/category/${encodeURIComponent(labelMap[key].toLowerCase())}`}
                className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium font-serif self-start sm:self-auto"
                style={{ fontFamily: 'Times, "Times New Roman", serif' }}
              >
                View All →
              </Link>
            </div>

            {/* Products Grid - 2 columns on mobile, 3-4 on larger screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {grouped[key].slice(0, 8).map((product) => (
                <div key={product._id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          )
        ))}
      </div>

      {/* Reviews Section */}
      <div
        className=" mx-2 sm:mx-4 md:mx-8 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm mb-8 sm:mb-12"
        style={{ backgroundColor: "#dfdfd8" }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-2">
            <StarRating rating={5} />
            <span className="ml-2 text-lg font-medium text-gray-800 font-serif">{allReviews.length} Reviews</span>
            <button className="ml-2 p-1">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => handleRatingFilter(null)}
            className={`px-3 py-2 rounded-lg text-sm font-serif transition-colors duration-200 ${
              selectedRating === null
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            All ({allReviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              className={`px-3 py-2 rounded-lg text-sm font-serif transition-colors duration-200 flex items-center ${
                selectedRating === rating
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              <span className="mr-1">{rating}</span>
              <span className="text-yellow-400">★</span>
              <span className="ml-1">({getFilteredReviewsCount(rating)})</span>
            </button>
          ))}
        </div>

        {allReviews.length > 0 ? (
          <>
            {/* Reviews Masonry Grid - Freestyle Layout */}
            <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {displayedReviews.map((review) => (
                <div key={review._id} className="break-inside-avoid">
                  <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center min-w-0">
                        <h4
                          className="font-medium text-gray-800 font-serif truncate"
                          style={{ fontFamily: 'Times, "Times New Roman", serif' }}
                        >
                          {review.customerName}
                        </h4>
                        <div className="ml-2 flex items-center flex-shrink-0">
                          <span className="text-green-600 text-sm">✓</span>
                          <span className="text-xs text-gray-500 ml-1 font-serif">Verified</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-serif flex-shrink-0 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      <StarRating rating={review.rating} />
                    </div>

                    {/* Review Text */}
                    <p
                      className="text-gray-700 text-sm mb-4 leading-relaxed font-serif"
                      style={{ fontFamily: 'Times, "Times New Roman", serif' }}
                    >
                      {review.comment}
                    </p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {review.images.slice(0, 2).map((image, index) => (
                          <img
                            key={index}
                            src={image.url || "/placeholder.svg"}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() => window.open(image.url, "_blank")}
                          />
                        ))}
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex items-center">
                      <img
                        src={review.product?.images?.[0]?.url || "/placeholder.svg"}
                        alt={review.product?.name || "Product"}
                        className="w-10 h-10 rounded object-cover bg-gray-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=40&width=40&text=Art"
                        }}
                      />
                      <span
                        className="ml-3 text-sm text-gray-600 font-serif truncate"
                        style={{ fontFamily: 'Times, "Times New Roman", serif' }}
                      >
                        {review.product?.name || "Product"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Reviews Button */}
            {hasMoreReviews() && (
              <div className="text-center mt-8 sm:mt-10">
                <button
                  onClick={handleViewMoreReviews}
                  disabled={reviewsLoading}
                  className="inline-block bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-serif"
                  style={{ fontFamily: 'Times, "Times New Roman", serif' }}
                >
                  {reviewsLoading
                    ? "Loading..."
                    : `View More Reviews (${getTotalFilteredReviews() - displayedReviews.length} remaining)`}
                </button>
              </div>
            )}

            {/* View All Reviews Page Link */}
            <div className="text-center mt-4">
              <Link
                to="/reviews"
                className="inline-block text-gray-600 hover:text-gray-800 underline font-serif text-sm"
                style={{ fontFamily: 'Times, "Times New Roman", serif' }}
              >
                Go to dedicated reviews page →
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="font-serif">No reviews available yet. Be the first to leave a review!</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div
        className="bg-white mx-2 sm:mx-4 md:mx-8 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm mb-8 sm:mb-12"
        style={{ backgroundColor: "#dfdfd8" }}
      >
        <div className="text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 font-serif"
            style={{ fontFamily: 'Times, "Times New Roman", serif' }}
          >
            Stay up to Date!
          </h2>
          <p
            className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 md:mb-8 font-serif"
            style={{ fontFamily: 'Times, "Times New Roman", serif' }}
          >
            Get updates on new Releases and exciting Discounts!
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto border-2 border-gray-300 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 outline-none text-gray-700 font-serif text-sm sm:text-base"
              style={{ fontFamily: 'Times, "Times New Roman", serif' }}
            />
            <button className="bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 hover:bg-gray-700 transition-colors duration-200 font-serif text-sm sm:text-base">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
