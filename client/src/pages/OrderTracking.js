"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { trackOrder } from "../services/api"
import { FaIndustry, FaBox, FaTruck, FaHome } from "react-icons/fa"

const OrderTracking = () => {
  const { orderNumber: paramOrderNumber } = useParams()
  const [orderNumber, setOrderNumber] = useState(paramOrderNumber || "")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // If we have an order number from URL params, auto-load if we have stored email
  useEffect(() => {
    if (paramOrderNumber) {
      const storedEmail = localStorage.getItem('tracking_email')
      if (storedEmail) {
        setEmail(storedEmail)
        handleTrackOrderDirect(paramOrderNumber, storedEmail)
      }
    }
  }, [paramOrderNumber])

  const handleTrackOrderDirect = async (orderNum, emailAddr) => {
    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const response = await trackOrder(orderNum, emailAddr)
      setOrder(response.order)
      localStorage.setItem('tracking_email', emailAddr)
    } catch (error) {
      setError("Order not found. Please check your order number and email.")
    } finally {
      setLoading(false)
    }
  }

  const handleTrackOrder = async (e) => {
    e.preventDefault()
    await handleTrackOrderDirect(orderNumber, email)
  }

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { 
        key: "processing", 
        label: "Order Processed", 
  icon: <FaIndustry aria-label="Order Processed" />,
        description: "Order is being prepared"
      },
      { 
        key: "shipped", 
        label: "Order Shipped", 
  icon: <FaBox aria-label="Order Shipped" />,
        description: "Package is on its way"
      },
      { 
        key: "enroute", 
        label: "Order En Route", 
  icon: <FaTruck aria-label="Order En Route" />,
        description: "Out for delivery"
      },
      { 
        key: "delivered", 
        label: "Order Arrived", 
  icon: <FaHome aria-label="Order Arrived" />,
        description: "Successfully delivered"
      },
    ]

    const statusOrder = ["processing", "shipped", "enroute", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus === "confirmed" ? "processing" : currentStatus)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  const cardStyle = {
    backgroundColor: "#dfdfd8",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
    border: "1px solid #c0c0b8"
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
      <div className="max-w-4xl mx-auto p-2 py-5">
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-8 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
          Track Your Order
        </h1>

        {!order && (
          <div style={cardStyle}>
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number"
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 font-serif"
                  style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 font-serif"
                  style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                  required
                />
              </div>
              {error && (
                <div className="border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-serif" style={{ backgroundColor: "#f8d7da", fontFamily: 'Times, "Times New Roman", serif' }}>
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 font-serif"
                style={{ fontFamily: 'Times, "Times New Roman", serif' }}
                disabled={loading}
              >
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </form>
          </div>
        )}

        {order && (
          <div>
            {/* Modern Order Status Card */}
            <div className=" rounded-2xl p-8  mb-8" style={{ backgroundColor: '#dfdfd8' }}>
              <div className="text-gray-800">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      ORDER <span className="">#{order.orderNumber}</span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Expected Arrival {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <p className="text-xs opacity-75">USPS {order.trackingNumber || '23409456724242342898'}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-8">
                  <div className="flex items-center justify-between relative">
                    {getStatusSteps(order.orderStatus).map((step, index) => (
                      <div key={step.key} className="flex-1 relative">
                        {/* Circle */}
                        <div className="flex justify-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center z-10 relative ${
                              step.completed 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-300 text-gray-500'
                            }`}
                          >
                            {step.completed ? (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-current opacity-50"></div>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress Line */}
                        {index < getStatusSteps(order.orderStatus).length - 1 && (
                          <div 
                            className={`absolute top-6 left-1/2 w-full h-1 -translate-y-1/2 ${
                              step.completed ? 'bg-white' : 'bg-gray-300'
                            }`}
                            style={{ zIndex: 1 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Labels */}
                <div className="grid grid-cols-4 gap-4 items-start">
                  {getStatusSteps(order.orderStatus).map((step) => (
                    <div key={step.key} className="flex flex-col items-center justify-start text-center">
                      <div className={`text-2xl mb-1 ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>{step.icon}</div>
                      <div className={`text-sm font-medium ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>{step.label}</div>
                    </div>
                  ))}
                </div>

                {/* Track Again Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setOrder(null)
                      setOrderNumber("")
                      setEmail("")
                    }}
                    className="bg-zinc-900 bg-opacity-40 hover:bg-opacity-60 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                  >
                    Track Another Order
                  </button>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div style={cardStyle}>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Order Details
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <strong>Order Date:</strong>
                  <br />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <strong>Total Amount:</strong>
                  <br />
                  Rs.{order.total.toLocaleString()}
                </div>
                <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <strong>Payment Method:</strong>
                  <br />
                  {order.paymentMethod}
                </div>
                <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <strong>Payment Status:</strong>
                  {/* <br /> */}
                  <span
                  className="font-bold"
                    style={{
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      paddingBottom: "2px",
                      marginLeft: "4px",
                      borderRadius: "4px",
                      fontSize: "1rem",
                      backgroundColor: order.paymentStatus === "paid" ? "#d4edda" : "#fff3cd",
                      color: order.paymentStatus === "paid" ? "#155724" : "#856404",
                      fontFamily: 'Times, "Times New Roman", serif'
                    }}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div style={cardStyle}>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Shipping Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <strong>Shipping Address:</strong>
                  <br />
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                  <br />
                  {order.customerInfo.address}
                  <br />
                  {order.customerInfo.city}, {order.customerInfo.postalCode}
                  <br />
                  {order.customerInfo.country}
                </div>
                <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <strong>Contact Information:</strong>
                  <br />
                  Email: {order.customerInfo.email}
                  <br />
                  Phone: {order.customerInfo.phone}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={cardStyle}>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Order Items
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #999" }}>
                      <th className="font-serif" style={{ padding: "0.5rem", textAlign: "left", fontFamily: 'Times, "Times New Roman", serif' }}>Product</th>
                      <th className="font-serif" style={{ padding: "0.5rem", textAlign: "left", fontFamily: 'Times, "Times New Roman", serif' }}>Size</th>
                      <th className="font-serif" style={{ padding: "0.5rem", textAlign: "left", fontFamily: 'Times, "Times New Roman", serif' }}>Quantity</th>
                      <th className="font-serif" style={{ padding: "0.5rem", textAlign: "left", fontFamily: 'Times, "Times New Roman", serif' }}>Price</th>
                      <th className="font-serif" style={{ padding: "0.5rem", textAlign: "left", fontFamily: 'Times, "Times New Roman", serif' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #bbb" }}>
                        <td className="font-serif" style={{ padding: "0.5rem", fontFamily: 'Times, "Times New Roman", serif' }}>{item.productName}</td>
                        <td className="font-serif" style={{ padding: "0.5rem", fontFamily: 'Times, "Times New Roman", serif' }}>{item.size}</td>
                        <td className="font-serif" style={{ padding: "0.5rem", fontFamily: 'Times, "Times New Roman", serif' }}>{item.quantity}</td>
                        <td className="font-serif" style={{ padding: "0.5rem", fontFamily: 'Times, "Times New Roman", serif' }}>Rs.{item.price.toLocaleString()}</td>
                        <td className="font-serif" style={{ padding: "0.5rem", fontFamily: 'Times, "Times New Roman", serif' }}>Rs.{(item.quantity * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right mt-4 text-xl font-bold text-gray-800 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Total: Rs.{order.total.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTracking
