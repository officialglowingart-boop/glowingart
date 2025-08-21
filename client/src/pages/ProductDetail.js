"use client"

import { useState, useEffect } from "react"
import { FiAlertTriangle, FiTruck, FiCheckCircle, FiClock, FiX } from "react-icons/fi"
import { FaLeaf } from "react-icons/fa"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { getProduct, getProducts } from "../services/api"
import ReviewsList from "../components/ReviewsList"
import ReviewSummary from "../components/ReviewSummary"
import ReviewForm from "../components/ReviewForm"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [customerName, setCustomerName] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewFormData, setReviewFormData] = useState({
    orderNumber: "",
    customerEmail: "",
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(id)
        setProduct(productData)
        if (productData.sizes && productData.sizes.length > 0) {
          const small = productData.sizes.find((s) => (s?.name || '').toLowerCase() === 'small')
          setSelectedSize(small ? small.name : productData.sizes[0].name)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    const fetchRelatedProducts = async () => {
      try {
        const response = await getProducts()
        setRelatedProducts(response.products.slice(0, 4))
      } catch (error) {
        console.error("Error fetching related products:", error)
      }
    }

    const fetchData = async () => {
      await fetchProduct()
      await fetchRelatedProducts()
    }
    fetchData()
  }, [id, navigate])

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }
    addToCart(product, selectedSize, quantity)
    alert("Product added to cart!")
  }

  const getSelectedPrice = () => {
    const size = product?.sizes.find((s) => s.name === selectedSize)
    return size || product?.sizes[0]
  }

  const handleReviewSubmitted = () => {
    setReviewFormData({ orderNumber: "", customerEmail: "" })
    // Refresh the reviews list by re-rendering the ReviewsList component
    window.location.reload()
  }

  const handleWriteReview = () => {
    setShowReviewForm(true)
  }

  // Improve modal UX: close on ESC, lock background scroll when open
  useEffect(() => {
    if (!showReviewForm) return
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowReviewForm(false)
    }
    document.addEventListener("keydown", onKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [showReviewForm])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#8B4513] text-white px-6 py-3 rounded-lg hover:bg-[#7A3F12] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const selectedPrice = getSelectedPrice()
  const hasDiscount = selectedPrice?.originalPrice && selectedPrice.originalPrice > selectedPrice.price
  const discountAmount = hasDiscount ? selectedPrice.originalPrice - selectedPrice.price : 0
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / selectedPrice.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      {/* Header Section with breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
            <button className="cursor-pointer hover:text-[#8B4513]" onClick={() => navigate("/")}>Home</button>
            <span className="mx-2 text-gray-300">/</span>
            <span className="cursor-default text-gray-500">Products</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-[#8B4513] font-medium truncate max-w-[60%]">{product.name}</span>
          </nav>
        </div>
          {/* Global Review Form Modal */}
          {showReviewForm && (
            <div
              className="fixed inset-0 z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-modal-title"
            >
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowReviewForm(false)}
              />
              {/* Panel */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                  className="bg-white w-full h-full rounded-none md:h-auto md:max-h-[90vh] md:rounded-xl md:max-w-2xl overflow-hidden shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 md:px-6 border-b bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <h3 id="review-modal-title" className="text-base md:text-lg font-semibold text-gray-900 truncate">
                          Write a review
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{product.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      aria-label="Close"
                    >
                      <FiX className="text-xl" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 md:p-6 overflow-y-auto max-h-full">
                    {/* Stepper */}
                    <div className="flex items-center gap-3 text-sm mb-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#8B4513] text-white text-xs font-bold">1</span>
                        <span className="font-medium">Order Info</span>
                      </div>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          reviewFormData.orderNumber && reviewFormData.customerEmail ? "bg-[#8B4513] text-white" : "bg-gray-200 text-gray-600"
                        } text-xs font-bold`}>2</span>
                        <span className="font-medium">Write Review</span>
                      </div>
                    </div>

                    {/* Order Information Form */}
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Order information required</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Please provide details to verify your purchase. We only use this to validate genuine reviews.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Order Number *</label>
                          <input
                            type="text"
                            value={reviewFormData.orderNumber}
                            onChange={(e) => setReviewFormData({ ...reviewFormData, orderNumber: e.target.value })}
                            placeholder="e.g. GA-123456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            value={reviewFormData.customerEmail}
                            onChange={(e) => setReviewFormData({ ...reviewFormData, customerEmail: e.target.value })}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Review Form */}
                    {reviewFormData.orderNumber && reviewFormData.customerEmail ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
                        <ReviewForm
                          productId={id}
                          orderNumber={reviewFormData.orderNumber}
                          customerEmail={reviewFormData.customerEmail}
                          onReviewSubmitted={handleReviewSubmitted}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        <p>Fill in your order number and email above to continue to the review form.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left - Gallery */}
          <section className="lg:col-span-7">
            <div className=" rounded-2xl  p-4 sm:p-6">
              <div className="hidden lg:flex gap-4">
                {/* Vertical thumbnails */}
                <div className="flex flex-col gap-3 w-20">
                  {(product.images || []).slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border transition-all ${
                        selectedImageIndex === index
                          ? "border-[#8B4513] ring-2 ring-[#8B4513]/30"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-label={`Thumbnail ${index + 1}`}
                    >
                      <img
                        src={image?.url || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                {/* Main image */}
                <div className="flex-1">
                  <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[selectedImageIndex]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                        No Image Available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet main image */}
              <div className="lg:hidden">
                <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImageIndex]?.url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Thumbnails row */}
                {product.images && product.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
                    {product.images.slice(0, 6).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-full aspect-square rounded-lg overflow-hidden border transition-all ${
                          selectedImageIndex === index
                            ? "border-[#8B4513] ring-2 ring-[#8B4513]/30"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        aria-label={`Thumbnail ${index + 1}`}
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Add Review button under gallery (opens modal) - desktop only */}
            <div className="mt-4 hidden lg:flex justify-end">
              <button
                onClick={handleWriteReview}
                className="inline-flex items-center gap-2 border border-[#8B4513] text-white bg-[#8B4513] hover:bg-[#7A3F12] px-4 py-2 rounded-lg text-sm font-semibold"
              >
                + Write Review
              </button>
            </div>
            {/* Insert review summary below gallery on desktop only */}
            <div className="mt-8 hidden lg:block">
              <ReviewSummary productId={id} />
            </div>
          </section>

          {/* Right - Summary / Buy Panel */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div className=" rounded-2xl  p-6">
                 {product.inStock ? (
                    <span className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">In stock</span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-md bg-red-50 text-red-700 text-xs font-medium">Out of stock</span>
                  )}

                {/* Title & Rating */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{product.name}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < (product.rating || 5) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{product.reviewCount || 0} reviews</span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-end gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-gray-900">Rs.{selectedPrice?.price.toLocaleString()}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-red-600 line-through">Rs.{selectedPrice.originalPrice.toLocaleString()}</span>
                      <span className="ml-auto inline-flex items-center px-4 py-2 rounded-md bg-green-100 text-green-700 text-xs font-semibold whitespace-nowrap">
                        Save {discountPercent}%
                      </span>
                    </>
                  )}
                 
                </div>

                {/* Promo highlights below price */}
                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p className="flex items-center gap-2 font-medium text-amber-700">
                    <FiAlertTriangle className="shrink-0" />
                    Almost Sold Out!
                  </p>
                  <p className="flex items-center gap-2">
                    <FiTruck className="shrink-0" />
                    Free Nationwide Shipping
                  </p>
                  <p className="flex items-center gap-2">
                    <FaLeaf className="shrink-0" />
                    Eco-Friendly Production
                  </p>
                  <p className="flex items-center gap-2">
                    <FiCheckCircle className="shrink-0" />
                    Premium Quality Guaranteed
                  </p>
                  <p className="flex items-center gap-2">
                    <FiClock className="shrink-0" />
                    Order Now Before It's Gone!
                  </p>
                </div>

                {/* Size and Quantity - inline across all devices */}
                <div className="mt-6">
                  <div>
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                        <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-12 text-center text-base font-semibold">{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="ml-auto">
                          <h3 className="text-sm font-medium text-gray-900 mb-2 text-right">Size</h3>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {product.sizes.map((size) => (
                              <button
                                key={size.name}
                                onClick={() => setSelectedSize(size.name)}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                  selectedSize === size.name
                                    ? "border-[#8B4513] bg-[#8B4513] text-white"
                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                }`}
                              >
                                {size.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    className="w-full bg-[#8B4513] hover:bg-[#7A3F12] text-white rounded-lg py-3 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    className="w-full border border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg py-3 text-sm font-semibold disabled:border-gray-300 disabled:text-gray-400"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    Buy Now
                  </button>
                </div>

                {/* Policies */}
                {/* <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2"><span>✅</span><span>COD available</span></div>
                  <div className="flex items-center gap-2"><span>🚚</span><span>Free shipping over Rs. 999</span></div>
                  <div className="flex items-center gap-2"><span>↩️</span><span>7-day returns</span></div>
                </div> */}

                {/* Trust badges */}
                {/* <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center p-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                      <span className="text-green-600 text-sm">🚚</span>
                    </div>
                    <span className="text-[11px] text-gray-600">Fast Shipping</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                      <span className="text-blue-600 text-sm">🔒</span>
                    </div>
                    <span className="text-[11px] text-gray-600">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                      <span className="text-purple-600 text-sm">↩️</span>
                    </div>
                    <span className="text-[11px] text-gray-600">Easy Returns</span>
                  </div>
                </div> */}
              </div>

              {/* Details accordions */}
              <div className=" rounded-2xl  divide-y">
                <details open className="group p-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-base font-semibold text-gray-900">Description</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">⌃</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">{product.description}</p>
                </details>
                <details className="group p-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-base font-semibold text-gray-900">Shipping & Returns</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">⌃</span>
                  </summary>
                  <ul className="mt-3 text-sm text-gray-700 space-y-2">
                    <li>• Standard delivery in 3-7 business days.</li>
                    <li>• Free returns within 7 days of delivery.</li>
                    <li>• Orders are securely packaged to protect artwork.</li>
                  </ul>
                </details>
                <details className="group p-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-base font-semibold text-gray-900">FAQ</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">⌃</span>
                  </summary>
                  <ul className="mt-3 text-sm text-gray-700 space-y-2">
                    <li>• Can I customize the design? Yes, add notes at checkout.</li>
                    <li>• What sizes are available? See size options above.</li>
                    <li>• Do you ship internationally? Currently domestic only.</li>
                  </ul>
                </details>
              </div>

              {/* Mobile-only: show review summary and comments below the description section */}
              <div className="block lg:hidden space-y-6">
                {/* Mobile-only sticky Write Review button above Customer Reviews */}
                <div className="top-0 z-40 bg-[#F5F3F0]/95 backdrop-blur border-b -mx-4 px-4 py-2">
                  <div className="flex justify-end">
                    <button
                      onClick={handleWriteReview}
                      className="inline-flex items-center gap-2 border border-[#8B4513] text-white bg-[#8B4513] hover:bg-[#7A3F12] px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      + Write Review
                    </button>
                  </div>
                </div>
                <ReviewSummary productId={id} />
                <ReviewsList productId={id} showSummary={false} />
              </div>
            </div>
          </aside>
        </div>
      </div>

  

  {/* Desktop-only: Customer comments grid (summary shown above under gallery) */}
  <div className="hidden lg:block max-w-7xl mx-auto px-4 py-16">
    <ReviewsList productId={id} showSummary={false} />
  </div>

   

      {/* You might also like section */}
      <div className=" py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Other Things You'll  Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/product/${relatedProduct._id}`)}
              >
                <div className="aspect-square bg-gray-100">
                  {relatedProduct.images && relatedProduct.images.length > 0 ? (
                    <img
                      src={relatedProduct.images[0]?.url || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#8B4513]">
                      Rs.{relatedProduct.sizes?.[0]?.price?.toLocaleString() || "N/A"}
                    </span>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < (relatedProduct.rating || 5) ? "text-yellow-400" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
