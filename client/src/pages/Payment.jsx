import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { submitPaymentProof } from "../services/api"

const Payment = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [receiptImage, setReceiptImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Get order details from localStorage (passed from checkout)
        const orderData = localStorage.getItem(`order_${orderId}`)
        if (orderData) {
          setOrder(JSON.parse(orderData))
        } else {
          // Fallback - redirect to home if no order data
          navigate("/")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, navigate])

  const getPaymentDetails = () => {
    if (!order) return null

    const paymentMethod = order.paymentMethod
    const total = order.total

    switch (paymentMethod) {
      case "JazzCash":
        return {
          title: "JazzCash Payment",
          account: "03XX-XXXXXXX",
          instructions: [
            `Send Rs. ${total} to the above JazzCash number`,
            "Use the order number as reference: " + order.orderNumber,
            "Take a screenshot of the successful transaction",
            "Click 'Payment Done' below to submit proof"
          ]
        }
      case "EasyPaisa":
        return {
          title: "EasyPaisa Payment",
          account: "03XX-XXXXXXX", 
          instructions: [
            `Send Rs. ${total} to the above EasyPaisa number`,
            "Use the order number as reference: " + order.orderNumber,
            "Take a screenshot of the successful transaction",
            "Click 'Payment Done' below to submit proof"
          ]
        }
      case "Bank Transfer":
        return {
          title: "Bank Transfer Payment",
          account: "Bank: ABC Bank\nAccount: 1234567890\nTitle: Glowing Art",
          instructions: [
            `Transfer Rs. ${total} to the above bank account`,
            "Use the order number as reference: " + order.orderNumber,
            "Take a photo of the bank receipt or screenshot",
            "Click 'Payment Done' below to submit proof"
          ]
        }
      case "Crypto":
        return {
          title: "Cryptocurrency Payment",
          account: "BTC: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\nUSDT (TRC20): TXXXXXXxxxxx",
          instructions: [
            `Send equivalent of Rs. ${total} in your preferred crypto`,
            "Use the order number as memo/reference: " + order.orderNumber,
            "Take a screenshot of the successful transaction",
            "Click 'Payment Done' below to submit proof"
          ]
        }
      default:
        return null
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setReceiptImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      alert("Please enter transaction ID")
      return
    }
    if (!receiptImage) {
      alert("Please upload payment receipt")
      return
    }

    setSubmitting(true)
    try {
      await submitPaymentProof(orderId, transactionId.trim(), receiptImage)
      
      alert("Payment proof submitted successfully! We'll verify and confirm your payment soon.")
      // Clear localStorage
      localStorage.removeItem(`order_${orderId}`)
      navigate(`/order-tracking/${order.orderNumber}`)
    } catch (error) {
      console.error("Error submitting payment:", error)
      alert("Failed to submit payment proof. Please try again.")
    } finally {
      setSubmitting(false)
      setShowModal(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading payment details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Order not found</div>
      </div>
    )
  }

  const paymentDetails = getPaymentDetails()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Order Number: <span className="font-semibold">{order.orderNumber}</span></p>
          <p className="text-gray-600">Total Amount: <span className="font-semibold text-yellow-600">Rs. {order.total}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{paymentDetails.title}</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Payment Details:</h3>
              <pre className="text-yellow-700 whitespace-pre-wrap">{paymentDetails.account}</pre>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Instructions:</h3>
              {paymentDetails.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start">
                  <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-6 bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Payment Done - Submit Proof
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <img 
                    src={item.image || "/placeholder.jpg"} 
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.productName}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg font-semibold text-gray-800">
                <span>Total</span>
                <span>Rs. {order.total}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <p className="text-gray-700 text-sm">
                {order.customerInfo.firstName} {order.customerInfo.lastName}<br/>
                {order.customerInfo.address}<br/>
                {order.customerInfo.city}, {order.customerInfo.postalCode}<br/>
                {order.customerInfo.country}<br/>
                Phone: {order.customerInfo.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Payment Proof</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Receipt *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Receipt preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPayment}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment
