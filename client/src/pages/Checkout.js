import React, { useState } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"

const Checkout = () => {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan"
  })

  const [paymentMethod, setPaymentMethod] = useState("")
  const [shippingProtection, setShippingProtection] = useState({ enabled: false, cost: 200 })
  const [discountCode, setDiscountCode] = useState({ code: "", discount: 0 })
  const [notes, setNotes] = useState("")

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartTotal = () => {
    let total = getSubtotal()
    if (shippingProtection.enabled) total += shippingProtection.cost
    total -= discountCode.discount
    return Math.max(total, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        customerInfo: customerInfo,
        items: items,
        subtotal: getSubtotal(),
        shippingProtection: shippingProtection,
        discountCode: discountCode,
        total: getCartTotal(),
        paymentMethod: paymentMethod,
        notes: notes
      }

      console.log("Sending order data:", orderData)

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const result = await response.json()
        const order = result.order
        
        // Clear cart
        clearCart()
        
        // For COD, go directly to order tracking
        if (paymentMethod === "COD") {
          navigate(`/order-tracking/${order.orderNumber}`)
        } else {
          // For other payment methods, store order data and go to payment page
          const orderWithDetails = {
            ...order,
            customerInfo: customerInfo,
            items: items
          }
          localStorage.setItem(`order_${order.orderNumber}`, JSON.stringify(orderWithDetails))
          navigate(`/payment/${order.orderNumber}`)
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to place order")
      }
    } catch (error) {
      console.error("Order placement failed:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const applyDiscountCode = () => {
    // Simple discount logic - you can make this more sophisticated
    if (discountCode.code.toLowerCase() === "welcome10") {
      setDiscountCode({ ...discountCode, discount: Math.floor(getSubtotal() * 0.1) })
    } else {
      alert("Invalid discount code")
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🛒</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some products to your cart before checkout.</p>
              <button 
                onClick={() => navigate("/")} 
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-8 rounded-lg font-semibold transition duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={customerInfo.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={customerInfo.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                      required
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="India">India</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {["JazzCash", "EasyPaisa", "Bank Transfer", "Crypto", "COD"].map((method) => (
                      <div key={method} className="flex items-center">
                        <input
                          type="radio"
                          id={method}
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                        />
                        <label htmlFor={method} className="ml-3 text-gray-700 font-medium">
                          {method}
                        </label>
                      </div>
                    ))}
                  </div>

                  {paymentMethod && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      {paymentMethod === "JazzCash" && (
                        <p className="text-blue-700 text-sm">
                          You will receive JazzCash payment details after placing your order. Please make the payment and upload the receipt.
                        </p>
                      )}
                      {paymentMethod === "EasyPaisa" && (
                        <p className="text-blue-700 text-sm">
                          You will receive EasyPaisa payment details after placing your order. Please make the payment and upload the receipt.
                        </p>
                      )}
                      {paymentMethod === "Bank Transfer" && (
                        <p className="text-blue-700 text-sm">
                          Bank transfer details will be provided on the next page. Please upload your payment receipt
                          for faster processing.
                        </p>
                      )}
                      {paymentMethod === "Crypto" && (
                        <p className="text-blue-700 text-sm">
                          Cryptocurrency payment addresses will be provided on the next page. Please upload transaction
                          hash and receipt.
                        </p>
                      )}
                      {paymentMethod === "COD" && (
                        <p className="text-blue-700 text-sm">
                          Pay cash when your order is delivered. COD fee may apply for orders under Rs.2,000.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition duration-200"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : `Place Order • Rs.${getCartTotal().toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs.{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="font-bold text-gray-800">Rs.{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Discount Code</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode.code}
                    onChange={(e) => setDiscountCode({ ...discountCode, code: e.target.value })}
                    placeholder="Enter discount code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={applyDiscountCode}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Shipping Protection */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shippingProtection"
                      checked={shippingProtection.enabled}
                      onChange={(e) => setShippingProtection({ ...shippingProtection, enabled: e.target.checked })}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shippingProtection" className="ml-3 font-medium text-gray-800">
                      Shipping Protection
                    </label>
                  </div>
                  <span className="font-bold text-gray-800">Rs.{shippingProtection.cost.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Protect your order against loss, theft, or damage during shipping
                </p>
              </div>

              {/* Order Totals */}
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">Rs.{getSubtotal().toLocaleString()}</span>
                </div>
                {shippingProtection.enabled && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping Protection:</span>
                    <span className="text-gray-800">Rs.{shippingProtection.cost.toLocaleString()}</span>
                  </div>
                )}
                {discountCode.discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount ({discountCode.code}):</span>
                    <span>-Rs.{discountCode.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-gray-800">Rs.{getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Secure Checkout</h4>
                    <p className="text-sm text-gray-600">
                      Your information is protected with SSL encryption
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    📱
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Instant Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Get email and WhatsApp updates on your order
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout