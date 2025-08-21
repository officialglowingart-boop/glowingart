"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPaymentInstructions, confirmPayment } from "../services/api"

const PaymentDetails = () => {
  const { orderNumber } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentData, setPaymentData] = useState({
    transactionId: "",
    receipt: null,
    notes: "",
  })

  useEffect(() => {
    fetchPaymentInstructions()
  }, [orderNumber])

  const fetchPaymentInstructions = async () => {
    try {
      const response = await getPaymentInstructions(orderNumber)
      setOrder(response.order)
    } catch (error) {
      console.error("Error fetching payment instructions:", error)
      const msg = error?.response?.data?.message || "Order not found"
      alert(msg)
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      setPaymentData({ ...paymentData, receipt: file })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!paymentData.transactionId.trim()) {
      alert("Please enter transaction ID")
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("transactionId", paymentData.transactionId)
      formData.append("notes", paymentData.notes)
      if (paymentData.receipt) {
        formData.append("receipt", paymentData.receipt)
      }

      await confirmPayment(orderNumber, formData)
      alert("Payment confirmation submitted successfully! We'll verify and update your order status.")
      navigate("/")
    } catch (error) {
      console.error("Error confirming payment:", error)
      alert("Error submitting payment confirmation. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const getPaymentDetails = () => {
    if (!order) return null

  const { paymentMethod } = order

    switch (paymentMethod) {
      case "JazzCash":
        return {
          title: "JazzCash Payment Details",
          color: "#4285f4",
          instructions: [
            "Open your JazzCash app or dial *786#",
            "Select 'Send Money' option",
            "Enter the following details:",
          ],
          details: {
            "Account Number": "03001234567",
            "Account Title": "Glowing Gallery",
            Amount: `Rs.${order.total.toLocaleString()}`,
          },
          additionalInfo: "After payment, enter your transaction ID below and upload the receipt screenshot.",
        }

  case "Easypaisa":
  case "EasyPaisa":
        return {
          title: "Easypaisa Payment Details",
          color: "#00a651",
          instructions: [
            "Open your Easypaisa app or visit nearest shop",
            "Select 'Send Money' option",
            "Enter the following details:",
          ],
          details: {
            "Mobile Number": "03009876543",
            "Account Title": "Glowing Gallery",
            Amount: `Rs.${order.total.toLocaleString()}`,
          },
          additionalInfo: "After payment, enter your transaction ID below and upload the receipt screenshot.",
        }

      case "Bank Transfer":
        return {
          title: "Bank Transfer Details",
          color: "#1a1a1a",
          instructions: ["Transfer the amount to the following bank account:", "Use your order number as reference:"],
          details: {
            "Bank Name": "HBL Bank",
            "Account Number": "12345678901234",
            "Account Title": "Glowing Gallery",
            IBAN: "PK36HABB0012345678901234",
            Amount: `Rs.${order.total.toLocaleString()}`,
            Reference: order.orderNumber,
          },
          additionalInfo: "Bank transfers may take 1-2 business days to process.",
        }

  case "Crypto":
        return {
          title: "Cryptocurrency Payment",
          color: "#f7931a",
          instructions: ["Send the equivalent amount to one of the following addresses:"],
          details: {
            "Bitcoin (BTC)": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            "Ethereum (ETH)": "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e3e3",
            "USDT (TRC20)": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
            Amount: `$${(order.total / 280).toFixed(2)} USD`, // Assuming 1 USD = 280 PKR
          },
          additionalInfo: "Please include your order number in the transaction memo if possible.",
        }

      case "USDT (TRC-20)":
        return {
          title: "USDT (TRC-20) Payment",
          color: "#26A17B",
          instructions: [
            "Send the equivalent amount in USDT (TRC-20) to the address below:",
          ],
          details: {
            "USDT (TRC20)": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
            Amount: `$${(order.total / 280).toFixed(2)} USD`,
            Reference: order.orderNumber,
          },
          additionalInfo: "Upload transaction hash and a screenshot after sending.",
        }

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <button onClick={() => navigate("/")} className="bg-yellow-600 text-white px-6 py-2 rounded-lg">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const paymentDetails = getPaymentDetails()

  if (order.paymentMethod === "COD") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Cash on Delivery Order</h1>
            <p className="text-gray-600 mb-6">
              Your order #{order.orderNumber} has been confirmed. You'll pay Rs.{order.total.toLocaleString()} when your
              order is delivered.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 text-sm">
                We'll contact you via email and WhatsApp to confirm your delivery details and schedule.
              </p>
            </div>
            <button onClick={() => navigate("/")} className="bg-yellow-600 text-white px-6 py-2 rounded-lg">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
            <p className="opacity-90">Order #{order.orderNumber}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Payment Instructions */}
            <div>
              {paymentDetails && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold mr-4"
                      style={{ backgroundColor: paymentDetails.color }}
                    >
                      {order.paymentMethod.charAt(0)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{paymentDetails.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {paymentDetails.instructions.map((instruction, index) => (
                      <p key={index} className="text-gray-700">
                        {index + 1}. {instruction}
                      </p>
                    ))}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      {Object.entries(paymentDetails.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                          <span className="font-medium text-gray-700">{key}:</span>
                          <span className="text-gray-900 font-mono">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 text-sm">{paymentDetails.additionalInfo}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Confirmation Form */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Your Payment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID / Reference Number *
                    </label>
                    <input
                      type="text"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter transaction ID"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Payment Receipt (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, PDF</p>
                  </div>

                  {paymentData.receipt && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(paymentData.receipt) || "/placeholder.svg"}
                        alt="Receipt preview"
                        className="w-full max-w-xs h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows="3"
                      placeholder="Any additional information about your payment..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {submitting ? "Submitting..." : "Confirm Payment"}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs.{order.subtotal.toLocaleString()}</span>
                  </div>
                  {order.shippingProtection?.enabled && (
                    <div className="flex justify-between">
                      <span>Shipping Protection:</span>
                      <span>Rs.{order.shippingProtection.cost.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>Rs.{order.total.toLocaleString()}</span>
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

export default PaymentDetails
