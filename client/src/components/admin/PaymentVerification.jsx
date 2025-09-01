"use client"

import { useState, useEffect } from "react"
import { getPaymentVerifications, verifyPayment } from "../../services/api"

const PaymentVerification = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("pending")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchPayments(page, limit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, limit])

  const fetchPayments = async (pageParam = 1, limitParam = 10) => {
    try {
      const params = filter !== "all" ? { status: filter, page: pageParam, limit: limitParam } : { page: pageParam, limit: limitParam }
      const response = await getPaymentVerifications(params)
      setPayments(response.payments || [])
      setTotalPages(response.totalPages || 1)
      setTotal(response.total || (response.payments ? response.payments.length : 0))
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPayment = async (paymentId, isVerified, notes = "") => {
    try {
      await verifyPayment(paymentId, { isVerified, notes })
      fetchPayments()
      setSelectedPayment(null)
      alert(`Payment ${isVerified ? "verified" : "rejected"} successfully`)
    } catch (error) {
      console.error("Error verifying payment:", error)
      alert("Error updating payment status")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading payment verifications...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Verification</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "verified" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Verified
          </button>
        </div>
      </div>

  <div className="grid gap-6">
        {payments.map((payment) => (
          <div key={payment._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="font-semibold text-lg">Order #{payment.order?.orderNumber}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.isVerified === true
                        ? "bg-green-100 text-green-800"
                        : payment.isVerified === false
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.isVerified === true ? "Verified" : payment.isVerified === false ? "Rejected" : "Pending"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Customer:</strong> {payment.order?.customerInfo?.firstName}{" "}
                    {payment.order?.customerInfo?.lastName}
                  </div>
                  <div>
                    <strong>Payment Method:</strong> {payment.order?.paymentMethod}
                  </div>
                  <div>
                    <strong>Amount:</strong> Rs.{payment.order?.total?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Transaction ID:</strong> {payment.transactionId}
                  </div>
                </div>
                {payment.notes && (
                  <div className="mt-2">
                    <strong className="text-sm text-gray-600">Notes:</strong>
                    <p className="text-sm text-gray-700">{payment.notes}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Submitted: {new Date(payment.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {payment.receiptUrl && (
              <div className="mb-4">
                <strong className="text-sm text-gray-600">Payment Receipt:</strong>
                <div className="mt-2">
                  <img
                    src={payment.receiptUrl || "/placeholder.svg"}
                    alt="Payment receipt"
                    className="max-w-xs h-32 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => window.open(payment.receiptUrl, "_blank")}
                  />
                </div>
              </div>
            )}

            {payment.isVerified === null && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleVerifyPayment(payment._id, true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Verify Payment
                </button>
                <button
                  onClick={() => setSelectedPayment(payment)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reject Payment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">Page {page} of {totalPages} • Total {total}</div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Per page</label>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1)
              setLimit(parseInt(e.target.value, 10))
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`px-3 py-1 rounded ${page <= 1 ? "bg-gray-200 text-gray-400" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`px-3 py-1 rounded ${page >= totalPages ? "bg-gray-200 text-gray-400" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No payment verifications found for the selected filter.</p>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Payment</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to reject this payment? Please provide a reason:</p>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-4"
              rows="3"
              placeholder="Reason for rejection..."
              id="rejectionNotes"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const notes = document.getElementById("rejectionNotes").value
                  handleVerifyPayment(selectedPayment._id, false, notes)
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedPayment(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentVerification
