"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPaymentInstructions, confirmPayment } from "../services/api"
import { FiPackage } from "react-icons/fi"

const PaymentDetails = () => {
  const { orderNumber } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [logoStep, setLogoStep] = useState(0)
  const [paymentData, setPaymentData] = useState({
    transactionId: "",
    receipt: null,
    notes: "",
  })

  // Preview & modal state for uploaded image
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    fetchPaymentInstructions()
  }, [orderNumber])

  // reset logo fallback when method changes
  useEffect(() => {
    setLogoError(false)
    setLogoStep(0)
  }, [order?.paymentMethod])

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

  // Build a stable preview URL and clean it up to avoid memory leaks
  useEffect(() => {
    if (paymentData.receipt && paymentData.receipt.type?.startsWith("image/")) {
      const url = URL.createObjectURL(paymentData.receipt)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [paymentData.receipt])

  const handleRemoveReceipt = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPaymentData((d) => ({ ...d, receipt: null }))
    setIsImageModalOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!paymentData.transactionId.trim()) {
      alert("Please enter transaction ID")
      return
    }

    setShowConfirmModal(true)
  }

  const handleConfirmPayment = async () => {
    setSubmitting(true)
    setShowConfirmModal(false)

    try {
      const formData = new FormData()
      formData.append("transactionId", paymentData.transactionId)
      formData.append("notes", paymentData.notes)
      if (paymentData.receipt) {
        formData.append("receipt", paymentData.receipt)
      }

      const result = await confirmPayment(orderNumber, formData)
      // Navigate to success page with lightweight order details
      navigate(`/payment/${orderNumber}/success`, {
        state: {
          type: "online",
          order: {
            orderNumber: order?.orderNumber || orderNumber,
            subtotal: order?.subtotal,
            total: order?.total,
            shippingProtection: order?.shippingProtection,
            paymentMethod: order?.paymentMethod,
          },
          server: result,
        },
        replace: true,
      })
    } catch (error) {
      console.error("Error confirming payment:", error)
      const msg = error?.response?.data?.message || "Error submitting payment confirmation. Please try again."
      alert(msg)
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
          instructions: ["Send the equivalent amount in USDT (TRC-20) to the address below:"],
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

  // Map payment methods to logo assets placed under /public/assets/payment/
  // Prefer PNGs from mobile app assets; fallback to our SVG placeholders
  const getPaymentLogoSrcs = (method) => {
    const baseMap = {
      JazzCash: "jazzcash",
      Easypaisa: "easypaisa",
      EasyPaisa: "easypaisa",
      "USDT (TRC-20)": "usdt-trc20",
      "Bank Transfer": "bank-transfer",
      Crypto: "crypto",
    }
    const base = baseMap[method]
    if (!base) return []
    return [`/assets/payment/${base}.png`, `/assets/payment/${base}.svg`]
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-3xl text-green-700" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Cash on Delivery</h1>
            <p className="text-gray-600 mb-6">Order #{order.orderNumber}</p>
            <p className="text-gray-700 mb-8">
              You'll pay Rs.{order.total.toLocaleString()} at delivery. Please confirm you want to place this order.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() =>
                  navigate(`/payment/${order.orderNumber}/success`, {
                    state: {
                      type: "cod",
                      order: {
                        orderNumber: order.orderNumber,
                        subtotal: order.subtotal,
                        total: order.total,
                        shippingProtection: order.shippingProtection,
                        paymentMethod: order.paymentMethod,
                      },
                    },
                    replace: true,
                  })
                }
                className="bg-[#333] text-white px-6 py-2 rounded-lg"
              >
                Confirm Order
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden ">
      {/* Top centered logo */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-center">
          <a href="/" aria-label="Glowing-Art home">
            <img
              src="https://res.cloudinary.com/dnhc1pquv/image/upload/v1755152549/glowing_art_wfvdht.png"
              alt="Glowing-Art"
              className="h-12 sm:h-14 md:h-16"
            />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto sm:px-4  ">
        <div className="rounded-lg  overflow-hidden">
          {/* Header */}
          <div
            className="from-yellow-600 to-yellow-700 text-black
           p-6"
          >
            <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
            <p className="opacity-90">Order #{order.orderNumber}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Payment Instructions */}
            <div>
              {paymentDetails && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg mr-4 flex items-center justify-center overflow-hidden bg-white border border-gray-200">
                      {(() => {
                        const sources = getPaymentLogoSrcs(order.paymentMethod)
                        const logoSrc = sources[logoStep]
                        return logoSrc && !logoError ? (
                          <img
                            src={logoSrc || "/placeholder.svg"}
                            alt={`${order.paymentMethod} logo`}
                            className="w-full h-full object-contain p-2 md:p-3"
                            onError={() => {
                              // try next source if available else show fallback block
                              if (logoStep + 1 < (sources?.length || 0)) {
                                setLogoStep((s) => s + 1)
                              } else {
                                setLogoError(true)
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: paymentDetails.color }}
                          >
                            <span className="text-lg md:text-2xl">{order.paymentMethod?.charAt(0) || "?"}</span>
                          </div>
                        )
                      })()}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{paymentDetails.title}</h2>
                  </div>

                  <div className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                      {paymentDetails.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">
                          {instruction}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      {Object.entries(paymentDetails.details).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start justify-between py-2 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="font-medium text-gray-700 mr-3 flex-shrink-0">{key}:</span>
                          <span className="text-gray-900 font-mono break-all sm:break-normal max-w-[65%] sm:max-w-none text-right">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#333] p-4 rounded-lg">
                      <p className="text-white text-sm">{paymentDetails.additionalInfo}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Order Summary first, then confirmation form */}
            <div>
              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
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

              {/* Payment Confirmation Form */}
              <div className="mt-6 bg-gray-50 sm:p-6 rounded-lg">
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
                      accept="image/*,application/pdf"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, PDF</p>
                  </div>

                  {paymentData.receipt && (
                    <div className="mt-2">
                      {paymentData.receipt.type?.startsWith("image/") ? (
                        <div className="inline-block relative">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Receipt preview"
                            className="w-full max-w-xs h-32 object-cover rounded-lg border cursor-zoom-in"
                            onClick={() => setIsImageModalOpen(true)}
                          />
                          <button
                            type="button"
                            onClick={handleRemoveReceipt}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 text-xs flex items-center justify-center shadow"
                            aria-label="Remove image"
                            title="Remove image"
                          >
                            ✕
                          </button>
                          <p className="text-xs text-gray-500 mt-1">Click the image to view full size.</p>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-3 py-2 rounded-md border text-sm bg-white">
                          <span className="mr-2">📄</span>
                          <span className="truncate max-w-xs">{paymentData.receipt.name}</span>
                          <button
                            type="button"
                            onClick={handleRemoveReceipt}
                            className="ml-3 text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
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
                    className="w-full bg-[#333] hover:bg-[#333] disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {submitting ? "Submitting..." : "Confirm Payment"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Your Order</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
                <p className="text-gray-700">
                  Total Amount: <span className="font-bold">Rs.{order.total.toLocaleString()}</span>
                </p>
                <p className="text-gray-700">
                  Payment Method: <span className="font-medium">{order.paymentMethod}</span>
                </p>
                <p className="text-gray-700">
                  Transaction ID: <span className="font-medium">{paymentData.transactionId}</span>
                </p>
              </div>
              <p className="text-sm text-gray-600">
                By confirming this order, you agree to proceed with the purchase. Your payment proof will be submitted
                for verification and you'll receive an email confirmation.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#dfdfd8" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Confirming..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image preview modal */}
      {isImageModalOpen && previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full w-8 h-8 shadow"
              onClick={() => setIsImageModalOpen(false)}
              aria-label="Close preview"
            >
              ✕
            </button>
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Receipt full size"
              className="w-full max-h-[80vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentDetails
