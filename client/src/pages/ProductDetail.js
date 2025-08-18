"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { getProduct, getProducts } from "../services/api"

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(id)
        setProduct(productData)
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].name)
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

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      {/* Header Section with breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="cursor-pointer hover:text-[#8B4513]" onClick={() => navigate("/")}>Home</span>
            <span className="mx-2">/</span>
            <span className="cursor-pointer hover:text-[#8B4513]">Products</span>
            <span className="mx-2">/</span>
            <span className="text-[#8B4513] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Product Image with wooden frame effect */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative bg-white p-8 rounded-lg shadow-lg">
              <div className="relative bg-[#8B4513] p-4 rounded-lg" style={{
                background: 'linear-gradient(145deg, #A0522D, #8B4513)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
              }}>
                <div className="bg-white p-2 rounded">
                  <div className="aspect-square bg-gray-100 rounded overflow-hidden">
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
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'border-[#8B4513] shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-8">
            {/* Product Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                  <span className="ml-2 text-gray-600">(127 reviews)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-gray-900">
                Rs.{selectedPrice?.price.toLocaleString()}
              </span>
              {selectedPrice?.originalPrice && selectedPrice.originalPrice > selectedPrice.price && (
                <span className="text-xl text-gray-500 line-through">
                  Rs.{selectedPrice.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Personalization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personalization (Optional)</h3>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name for personalization"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                />
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                        selectedSize === size.name
                          ? 'border-[#8B4513] bg-[#8B4513] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-[#8B4513] text-white py-4 rounded-lg text-lg font-semibold hover:bg-[#7A3F12] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center p-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-green-600 text-sm">🚚</span>
                  </div>
                  <span className="text-xs text-gray-600">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-blue-600 text-sm">🔒</span>
                  </div>
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center p-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-purple-600 text-sm">↩️</span>
                  </div>
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Customer Reviews</h2>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Review 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-semibold">JD</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">John D.</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "Absolutely stunning piece! The quality exceeded my expectations and it looks perfect in my living room."
            </p>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-semibold">SM</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "Fast shipping and excellent packaging. The artwork is even more beautiful in person!"
            </p>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-semibold">MK</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Mike K.</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "Great customer service and amazing quality. Will definitely order again!"
            </p>
          </div>

          {/* Review 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-semibold">LW</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Lisa W.</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "Perfect gift for my friend. The personalization option made it extra special!"
            </p>
          </div>
        </div>
      </div>

      {/* Transform Your Space Section */}
      <div className="bg-gradient-to-br from-green-400 to-blue-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Transform your Space now.</h2>
          <p className="text-white text-lg opacity-90 mb-8">
            Discover our collection of stunning artwork that will elevate your home decor
          </p>
          <button 
            onClick={() => navigate("/")}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* Handcrafted Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Handcrafted</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Every piece in our collection is carefully handcrafted by skilled artisans. 
                We use premium materials and pay attention to every detail to ensure you 
                receive a masterpiece that will last for generations.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Premium quality materials</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Skilled artisan craftsmanship</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Lifetime quality guarantee</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="bg-gray-100 rounded-lg p-8 h-96 flex items-center justify-center">
                <span className="text-gray-500 text-lg">Handcrafted Process Image</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stunning Designs Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:pr-12">
              <div className="bg-gray-100 rounded-lg p-8 h-96 flex items-center justify-center">
                <span className="text-gray-500 text-lg">Stunning Designs Image</span>
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Stunning Designs</h2>
              <p className="text-lg leading-relaxed mb-6 opacity-90">
                Our talented designers create unique and captivating artwork that reflects 
                contemporary trends while maintaining timeless appeal. Each design tells a 
                story and adds character to your space.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="opacity-90">Unique contemporary designs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="opacity-90">Timeless artistic appeal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="opacity-90">Custom personalization available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Customer Reviews */}
      <div className="bg-[#F5F3F0] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review cards with more detailed reviews */}
            {[
              {
                name: "Emily R.",
                rating: 5,
                review: "I ordered this for my daughter's room and she absolutely loves it! The quality is outstanding and it arrived perfectly packaged.",
                verified: true
              },
              {
                name: "David L.",
                rating: 5,
                review: "Exceptional service from start to finish. The artwork exceeded my expectations and looks amazing in our new home.",
                verified: true
              },
              {
                name: "Maria S.",
                rating: 5,
                review: "Beautiful piece that really ties our living room together. The colors are vibrant and the frame quality is excellent.",
                verified: true
              },
              {
                name: "James T.",
                rating: 5,
                review: "Fast shipping, great communication, and most importantly - stunning artwork! Highly recommend this seller.",
                verified: true
              },
              {
                name: "Anna K.",
                rating: 5,
                review: "The personalization option made this gift extra special. My mom was thrilled with the result!",
                verified: true
              },
              {
                name: "Robert M.",
                rating: 5,
                review: "Third purchase from this store and consistently impressed with the quality and attention to detail.",
                verified: true
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">{review.name.split(' ')[0][0]}{review.name.split(' ')[1][0]}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* You might also like section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">You might also like</h2>
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
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#8B4513]">
                      Rs.{relatedProduct.sizes?.[0]?.price?.toLocaleString() || 'N/A'}
                    </span>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
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
 