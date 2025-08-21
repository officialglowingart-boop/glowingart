"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { getPaymentInstructions } from "../services/api"

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const { orderNumber } = useParams()
  const location = useLocation()

  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState(null)

  useEffect(() => {
    // If we didn't receive order details via navigation state, fetch them
    if (!order) {
      ;(async () => {
        try {
          const data = await getPaymentInstructions(orderNumber)
          setOrder(data.order)
        } catch (err) {
          setError(err?.response?.data?.message || "Unable to load order details")
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [order, orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your confirmation…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#dfdfd8] from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
        {/* Close button */}
        <button
          aria-label="Close"
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500 shadow-lg flex items-center justify-center">
          <span className="text-white text-4xl">✓</span>
        </div>

        {(() => {
          const isCOD = location.state?.type === "cod" || order?.paymentMethod === "COD"
          return (
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              {isCOD ? "Order placed successfully" : "Payment submitted"} 🎉
            </h1>
          )
        })()}
        {(() => {
          const isCOD = location.state?.type === "cod" || order?.paymentMethod === "COD"
          return isCOD ? (
          <p className="text-center text-gray-600 mt-2">
            Thank you for your purchase! Your COD order has been placed. We’ll contact you for delivery details.
          </p>
        ) : (
          <p className="text-center text-gray-600 mt-2">
            Your payment details have been received. We’ll verify and update your order status shortly.
          </p>
        )
        })()}
        {(() => {
          const isCOD = location.state?.type === "cod" || order?.paymentMethod === "COD"
          return !isCOD ? (
          <p className="text-center text-emerald-700 mt-2 font-medium">
            Payment confirmation will take up to 1–3 hours.
          </p>
          ) : null
        })()}

        {error && (
          <div className="mt-4 p-3 text-sm bg-red-50 text-red-700 rounded-md">{error}</div>
        )}

        {/* Order details */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Order Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order #</span>
              <span className="font-mono text-gray-900">{order?.orderNumber || orderNumber}</span>
            </div>
            {order?.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900">{order.paymentMethod}</span>
              </div>
            )}
            {typeof order?.subtotal === "number" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">Rs.{order.subtotal.toLocaleString()}</span>
              </div>
            )}
            {order?.shippingProtection?.enabled && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Protection</span>
                <span className="text-gray-900">Rs.{order.shippingProtection.cost.toLocaleString()}</span>
              </div>
            )}
            {typeof order?.total === "number" && (
              <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>Rs.{order.total.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {(() => {
          const isCOD = location.state?.type === "cod" || order?.paymentMethod === "COD"
          const orderNo = order?.orderNumber || orderNumber
          return (
            <div className="mt-6">
              {!isCOD && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                  <p className="text-emerald-900 font-semibold">
                    You can track your order status anytime.
                  </p>
                  <p className="text-emerald-800 mt-1">
                    Copy your order number <span className="font-mono font-semibold">{orderNo}</span> and enter it with your email on the Track Order page to view the latest status.
                  </p>
                </div>
              )}
              <div className={`flex ${!isCOD ? "flex-col sm:flex-row gap-3" : ""}`}>
                {!isCOD && (
                  <button
                    onClick={() => navigate(`/order-tracking/${orderNo}`)}
                    className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium shadow"
                  >
                    Track order
                  </button>
                )}
                <button
                  onClick={() => navigate("/")}
                  className={`w-full ${!isCOD ? "sm:flex-1" : ""} bg-[#333] text-white py-3 rounded-lg font-medium shadow`}
                >
                  Continue shopping
                </button>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default PaymentSuccess
