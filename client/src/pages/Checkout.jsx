"use client"

import { useState } from "react"
import {
  FaLock,
  FaShippingFast,
  FaComments,
  FaBell,
  FaCreditCard,
  FaWallet,
  FaUniversity,
  FaTruck,
} from "react-icons/fa"
import { SiTether } from "react-icons/si"
import { useCart } from "../context/CartContext"
import { createOrder } from "../services/api"
import { useNavigate } from "react-router-dom"

const Checkout = () => {
  const { cartItems, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
  })

  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [paymentTab, setPaymentTab] = useState("cod")
  const [shippingProtection, setShippingProtection] = useState({ enabled: false, cost: 200 })
  const [discountCode, setDiscountCode] = useState({ code: "", discount: 0, appliedCoupon: null })
  const [notes, setNotes] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Normalize some fields that commonly break on mobile autofill
    const normalized =
      name === "email"
        ? value.trim().toLowerCase()
        : name === "firstName" || name === "lastName" || name === "city" || name === "country"
          ? value.trim()
          : name === "phone"
            ? value.replace(/\s+/g, "").trim()
            : value

    setCustomerInfo({
      ...customerInfo,
      [name]: normalized,
    })
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartTotal = () => {
    let total = getSubtotal()
    if (shippingProtection.enabled) total += shippingProtection.cost
    total -= discountCode.discount
    return Math.max(total, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate payment selection (especially for Online Payment tab)
    const onlineMethods = ["JazzCash", "EasyPaisa", "Bank Transfer", "USDT (TRC-20)"]
    if (paymentTab === "online" && !onlineMethods.includes(paymentMethod)) {
      alert("Please select an online payment method before proceeding.")
      return
    }

    if (paymentMethod === "COD") {
      // For COD: Show confirmation modal (existing behavior)
      setShowConfirmModal(true)
    } else {
      // For Online Payment: Create order immediately and go to payment page
      await handleCreateOrderForOnlinePayment()
    }
  }

  const handleCreateOrderForOnlinePayment = async () => {
    setLoading(true)

    try {
      const mappedItems = cartItems.map((item) => ({
        productId: item._id,
        size: item.selectedSize || "Small",
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      }))

      const orderData = {
        customerInfo: customerInfo,
        items: mappedItems,
        subtotal: getSubtotal(),
        shippingProtection: shippingProtection,
        discountCode: discountCode,
        total: getCartTotal(),
        paymentMethod: paymentMethod,
        notes: notes,
      }

      console.log("Sending order data for online payment:", orderData)

      const result = await createOrder(orderData)
      if (result && result.order) {
        const order = result.order

        clearCart()

        const orderWithDetails = {
          ...order,
          customerInfo: customerInfo,
          items: cartItems,
        }
        localStorage.setItem(`order_${order.orderNumber}`, JSON.stringify(orderWithDetails))
        navigate(`/payment/${order.orderNumber}`)
      } else {
        throw new Error("Unexpected response from server")
      }
    } catch (error) {
      console.error("Order placement failed:", error)
      const msg = error?.response?.data?.message || error?.message || "Failed to place order. Please try again."
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmOrder = async () => {
    setLoading(true)
    setShowConfirmModal(false)

    try {
      const mappedItems = cartItems.map((item) => ({
        productId: item._id,
        size: item.selectedSize || "Small",
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      }))

      const orderData = {
        customerInfo: customerInfo,
        items: mappedItems,
        subtotal: getSubtotal(),
        shippingProtection: shippingProtection,
        discountCode: discountCode,
        total: getCartTotal(),
        paymentMethod: paymentMethod,
        notes: notes,
      }

      console.log("Sending COD order data:", orderData)

      const result = await createOrder(orderData)
      if (result && result.order) {
        const order = result.order

        clearCart()

        // For COD, go directly to payment page
        navigate(`/payment/${order.orderNumber}`)
      } else {
        throw new Error("Unexpected response from server")
      }
    } catch (error) {
      console.error("Order placement failed:", error)
      const msg = error?.response?.data?.message || error?.message || "Failed to place order. Please try again."
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  const applyDiscountCode = async () => {
    if (!discountCode.code.trim()) {
      alert("Please enter a discount code")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("http://glowingart-ruddy.vercel.app/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: discountCode.code,
          orderTotal: getSubtotal(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const discount = data.discountAmount
        setDiscountCode({
          ...discountCode,
          discount: discount,
          appliedCoupon: data.coupon,
        })
        alert(`Coupon applied! You saved Rs.${discount.toLocaleString()}`)
      } else {
        const error = await response.json()
        alert(error.message || "Invalid discount code")
        setDiscountCode({ code: discountCode.code, discount: 0, appliedCoupon: null })
      }
    } catch (error) {
      console.error("Error applying coupon:", error)
      alert("Failed to apply coupon. Please try again.")
      setDiscountCode({ code: discountCode.code, discount: 0, appliedCoupon: null })
    } finally {
      setLoading(false)
    }
  }

  const removeCoupon = () => {
    setDiscountCode({ code: "", discount: 0, appliedCoupon: null })
  }

  // Checkout benefits to display under the order summary (React Icons)
  const benefits = [
    { Icon: FaLock, title: "Secure Checkout", text: "Your payment is encrypted and 100% safe", color: "bg-green-600" },
    {
      Icon: FaShippingFast,
      title: "Fast Processing",
      text: "Orders are prepared and shipped without delay",
      color: "bg-amber-600",
    },
    {
      Icon: FaComments,
      title: "Real-Time Support",
      text: "Chat with us anytime during your purchase",
      color: "bg-purple-600",
    },
    {
      Icon: FaBell,
      title: "Instant Notifications",
      text: "Get email and WhatsApp updates on your order",
      color: "bg-blue-600",
    },
    {
      Icon: FaCreditCard,
      title: "Multiple Payment Options",
      text: "Pay by JazzCash, EasyPaisa, Bank Transfer, USDT (TRC-20), or Cash on Delivery",
      color: "bg-gray-700",
    },
  ]

  // Payment options with icons; you can drop brand SVGs into /public/icons to override the default React Icon
  const paymentOptions = [
    { id: "JazzCash", label: "JazzCash", Icon: FaWallet, img: "/icons/jazzcash.svg" },
    { id: "EasyPaisa", label: "EasyPaisa", Icon: FaWallet, img: "/icons/easypaisa.svg" },
    { id: "Bank Transfer", label: "Bank Transfer", Icon: FaUniversity, img: "/icons/bank-transfer.svg" },
    { id: "USDT (TRC-20)", label: "USDT (TRC-20)", Icon: SiTether, img: "/icons/usdt-trc20.svg" },
    { id: "COD", label: "Cash On Delivery", Icon: FaTruck, img: "/icons/cod.svg" },
  ]

  const onlineOptions = paymentOptions.filter((o) => o.id !== "COD")
  const codOptions = paymentOptions.filter((o) => o.id === "COD")

  if (cartItems.length === 0) {
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
    <div
      className="min-h-screen bg-[#dfdfd8] py-3 font-serif"
      style={{ fontFamily: 'Times, "Times New Roman", serif' }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <h1
          className="text-center text-4xl font-bold text-gray-800 mb-2"
          style={{ fontFamily: 'Times, "Times New Roman", serif' }}
        >
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="rounded-lg p-2 sm:p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                      placeholder="First Name *"
                      style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                      placeholder="Last Name *"
                      style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                    placeholder="Email Address *"
                    style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                    placeholder="Phone Number *"
                    style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="sr-only">
                    Street Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600 resize-none"
                    placeholder="Street Address *"
                    style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="sr-only">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                      placeholder="City *"
                      style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="sr-only">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={customerInfo.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                      placeholder="Postal Code *"
                      style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="sr-only">
                      Country *
                    </label>
                    {/* Mobile: show a read-only field to avoid dropdown/render issues */}
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={customerInfo.country}
                      readOnly
                      onFocus={(e) => e.target.blur()}
                      autoComplete="off"
                      className="md:hidden w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                      style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                    />
                    {/* Desktop and tablets: native select works fine */}
                    <select
                      id="country-desktop"
                      name="country"
                      value={customerInfo.country}
                      onChange={handleInputChange}
                      className="hidden md:block w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900"
                      style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                      required
                    >
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
                  {/* Toggle buttons */}
                  <div className="flex items-center justify-end gap-3 mb-4 flex-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentTab("cod")
                        setPaymentMethod("COD")
                      }}
                      className={`px-4 py-2 border-2 whitespace-nowrap ${paymentTab === "cod" ? "border-gray-800 text-gray-900" : "border-gray-400 text-gray-700"} bg-transparent font-medium`}
                      style={{ backgroundColor: "#dfdfd8" }}
                    >
                      Cash On Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentTab("online")
                        setPaymentMethod("")
                      }}
                      className={`px-4 py-2 border-2 whitespace-nowrap ${paymentTab === "online" ? "border-gray-800 text-gray-900" : "border-gray-400 text-gray-700"} bg-transparent font-medium`}
                      style={{ backgroundColor: "#dfdfd8" }}
                    >
                      Online Payment
                    </button>
                  </div>

                  {/* Options under the active tab */}
                  {paymentTab === "online" ? (
                    <div className="space-y-3">
                      {onlineOptions.map(({ id, label, Icon, img }) => (
                        <label key={id} htmlFor={id} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            id={id}
                            name="paymentMethod"
                            value={id}
                            checked={paymentMethod === id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                          />
                          <span className="ml-3 flex items-center gap-2 text-gray-700 font-medium">
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <img
                              src={img || "/placeholder.svg"}
                              onError={(e) => (e.currentTarget.style.display = "none")}
                              className="w-5 h-5"
                            />
                            <Icon className="w-5 h-5" />
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {codOptions.map(({ id, label, Icon, img }) => (
                        <label key={id} htmlFor={id} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            id={id}
                            name="paymentMethod"
                            value={id}
                            checked={paymentMethod === id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                          />
                          <span className="ml-3 flex items-center gap-2 text-gray-700 font-medium">
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <img
                              src={img || "/placeholder.svg"}
                              onError={(e) => (e.currentTarget.style.display = "none")}
                              className="w-5 h-5"
                            />
                            <Icon className="w-5 h-5" />
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {paymentMethod && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      {paymentMethod === "JazzCash" && (
                        <p className="text-black text-sm">
                          You will receive JazzCash payment details after placing your order. Please make the payment
                          and upload the receipt.
                        </p>
                      )}
                      {paymentMethod === "EasyPaisa" && (
                        <p className="text-black text-sm">
                          You will receive EasyPaisa payment details after placing your order. Please make the payment
                          and upload the receipt.
                        </p>
                      )}
                      {paymentMethod === "Bank Transfer" && (
                        <p className="text-black text-sm">
                          Bank transfer details will be provided on the next page. Please upload your payment receipt
                          for faster processing.
                        </p>
                      )}
                      {paymentMethod === "USDT (TRC-20)" && (
                        <p className="text-black text-sm">
                          USDT (TRC-20) payment addresses will be provided on the next page. Please upload transaction
                          hash and receipt.
                        </p>
                      )}
                      {paymentMethod === "COD" && (
                        <p className="text-black text-sm">
                          Pay cash when your order is delivered. Cash On Delivery fee may apply for orders under
                          Rs.2,000.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition duration-200"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Place Order • Rs.${getCartTotal().toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="p-2 sm:p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

              <div className="mb-6">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.selectedSize}`} className="flex gap-4 py-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={typeof item.images[0] === "object" ? item.images[0].url : item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/diverse-products-still-life.png"
                          }}
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
                        Size: {item.selectedSize} • Qty: {item.quantity}
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
                      <span className="font-bold text-gray-800">
                        Rs.{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6 p-2 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Discount Code</h4>
                {discountCode.appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <span className="font-medium text-green-800">{discountCode.appliedCoupon.code} Applied</span>
                      <p className="text-sm text-green-600">You saved Rs.{discountCode.discount.toLocaleString()}</p>
                    </div>
                    <button onClick={removeCoupon} className="text-red-600 hover:text-red-800 font-medium">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode.code}
                      onChange={(e) => setDiscountCode({ ...discountCode, code: e.target.value.toUpperCase() })}
                      placeholder="Enter discount code"
                      className="flex-1 px-3 py-2 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                      style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                    />
                    <button
                      type="button"
                      onClick={applyDiscountCode}
                      disabled={loading}
                      className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                    >
                      {loading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {/* <div className="mb-6 p-4 rounded-lg">
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
              </div> */}

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
                    <span>Discount ({discountCode.appliedCoupon?.code}):</span>
                    <span>-Rs.{discountCode.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-gray-800">Rs.{getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="sm:mt-8 mt-3 p-1 sm:p-4 rounded-lg">
                <div className="grid gap-4">
                  {benefits.map(({ Icon, title, text }) => (
                    <div key={title} className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <div>
                        <h4 className="font-semibold text-gray-800">{title}</h4>
                        <p className="text-sm text-gray-600">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            style={{ fontFamily: 'Times, "Times New Roman", serif' }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Your Order</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
                <p className="text-gray-700">
                  Total Amount: <span className="font-bold">Rs.{getCartTotal().toLocaleString()}</span>
                </p>
                <p className="text-gray-700">
                  Payment Method: <span className="font-medium">{paymentMethod}</span>
                </p>
                <p className="text-gray-700">
                  Items: <span className="font-medium">{cartItems.length} product(s)</span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                <p className="text-gray-700 text-sm">
                  {customerInfo.firstName} {customerInfo.lastName}
                  <br />
                  {customerInfo.address}
                  <br />
                  {customerInfo.city}, {customerInfo.postalCode}
                  <br />
                  {customerInfo.country}
                  <br />
                  Phone: {customerInfo.phone}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                By confirming this order, you agree to proceed with the purchase.
                {paymentMethod === "COD"
                  ? " You will pay cash when the order is delivered."
                  : " You will be redirected to complete the payment process."}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#dfdfd8" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating Order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
