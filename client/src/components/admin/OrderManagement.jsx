"use client"

import { useState, useEffect } from "react"
import { getAdminOrders, updateOrderStatus, getOrderDetails, confirmOrderPayment } from "../../services/api"

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentNotes, setPaymentNotes] = useState("")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    fetchOrders()
  }, [filters, currentPage])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await getAdminOrders({ ...filters, page: currentPage, limit: 10 })
      setOrders(response.orders)
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, statusData) => {
    try {
      await updateOrderStatus(orderId, statusData)
      fetchOrders()
      setSelectedOrder(null)
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Error updating order status. Please try again.")
    }
  }

  const handlePaymentConfirmation = async () => {
    try {
      setProcessingPayment(true)
      await confirmOrderPayment(selectedOrder._id, paymentNotes)
      fetchOrders()
      setShowPaymentModal(false)
      setPaymentNotes("")
      alert("Payment confirmed successfully!")
    } catch (error) {
      console.error("Error confirming payment:", error)
      alert("Error confirming payment. Please try again.")
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) {
      alert("Please select orders first")
      return
    }

    try {
      const promises = selectedOrders.map((orderId) => {
        switch (action) {
          case "confirm":
            return updateOrderStatus(orderId, { orderStatus: "confirmed" })
          case "ship":
            return updateOrderStatus(orderId, { orderStatus: "shipped" })
          case "deliver":
            return updateOrderStatus(orderId, { orderStatus: "delivered" })
          default:
            return Promise.resolve()
        }
      })

      await Promise.all(promises)
      fetchOrders()
      setSelectedOrders([])
      alert(`Bulk action completed for ${selectedOrders.length} orders`)
    } catch (error) {
      console.error("Error performing bulk action:", error)
      alert("Error performing bulk action. Please try again.")
    }
  }

  const handleExportOrders = () => {
    const csvContent = [
      ["Order Number", "Customer", "Email", "Total", "Payment Method", "Order Status", "Payment Status", "Date"].join(
        ",",
      ),
      ...orders.map((order) =>
        [
          order.orderNumber,
          `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
          order.customerInfo.email,
          order.total,
          order.paymentMethod,
          order.orderStatus,
          order.paymentStatus,
          new Date(order.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return { bg: "#d4edda", color: "#155724" }
      case "shipped":
        return { bg: "#d1ecf1", color: "#0c5460" }
      case "enroute":
        return { bg: "#e2e3e5", color: "#383d41" }
      case "confirmed":
        return { bg: "#d4edda", color: "#155724" }
      case "cancelled":
        return { bg: "#f8d7da", color: "#721c24" }
      default:
        return { bg: "#fff3cd", color: "#856404" }
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return { bg: "#d4edda", color: "#155724" }
      case "failed":
        return { bg: "#f8d7da", color: "#721c24" }
      case "refunded":
        return { bg: "#e2e3e5", color: "#383d41" }
      default:
        return { bg: "#fff3cd", color: "#856404" }
    }
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h2>Order Management</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          >
            <option value="">All Order Status</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="enroute">En Route</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button
            onClick={handleExportOrders}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {selectedOrders.length > 0 && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{selectedOrders.length} orders selected</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handleBulkAction("confirm")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm Selected
            </button>
            <button
              onClick={() => handleBulkAction("ship")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ffc107",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Ship Selected
            </button>
            <button
              onClick={() => handleBulkAction("deliver")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Deliver Selected
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "white", // Added solid background for modal
              boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
              borderRadius: "12px",
              padding: "2rem"
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}
            >
              <h3>Order Details - {selectedOrder.orderNumber}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: "2rem", marginBottom: "2rem" }}>
              <div>
                <h4>Customer Information</h4>
                <p>
                  <strong>Name:</strong> {selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.customerInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedOrder.customerInfo.phone}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.customerInfo.address}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postalCode}
                </p>
                <p>
                  <strong>Country:</strong> {selectedOrder.customerInfo.country}
                </p>
              </div>

              <div>
                <h4>Order Information</h4>
                <p>
                  <strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                </p>
                <p>
                  <strong>Total Amount:</strong> Rs.{selectedOrder.total.toLocaleString()}
                </p>
                <p>
                  <strong>Order Status:</strong>
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      ...getStatusColor(selectedOrder.orderStatus),
                    }}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </p>
                <p>
                  <strong>Payment Status:</strong>
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      ...getPaymentStatusColor(selectedOrder.paymentStatus),
                    }}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Payment Details Section */}
            {selectedOrder.paymentDetails && selectedOrder.paymentDetails.transactionId && (
              <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h4 style={{ marginBottom: "1rem", color: "#333" }}>Payment Details</h4>
                <div className="grid grid-cols-2" style={{ gap: "1rem" }}>
                  <div>
                    <p><strong>Transaction ID:</strong> {selectedOrder.paymentDetails.transactionId}</p>
                    <p><strong>Submitted At:</strong> {new Date(selectedOrder.paymentDetails.paymentConfirmedAt).toLocaleString()}</p>
                    {selectedOrder.paymentDetails.adminNotes && (
                      <p><strong>Admin Notes:</strong> {selectedOrder.paymentDetails.adminNotes}</p>
                    )}
                  </div>
                  <div>
                    {selectedOrder.paymentDetails.receiptImage && (
                      <div>
                        <p><strong>Payment Receipt:</strong></p>
                        <img 
                          src={selectedOrder.paymentDetails.receiptImage} 
                          alt="Payment Receipt"
                          style={{ 
                            maxWidth: "200px", 
                            maxHeight: "200px", 
                            objectFit: "contain",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                          onClick={() => window.open(selectedOrder.paymentDetails.receiptImage, '_blank')}
                        />
                        <br />
                        <small style={{ color: "#666" }}>Click to view full size</small>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedOrder.paymentStatus === "pending" && selectedOrder.paymentDetails.transactionId && (
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
                    <button
                      onClick={() => {
                        setShowPaymentModal(true)
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "0.5rem"
                      }}
                    >
                      Confirm Payment
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder._id, {
                        paymentStatus: "failed",
                        orderStatus: selectedOrder.orderStatus,
                        notes: "Payment verification failed"
                      })}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Reject Payment
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: "2rem" }}>
              <h4>Order Items</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Product</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Size</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Quantity</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Price</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "0.5rem" }}>{item.productName}</td>
                        <td style={{ padding: "0.5rem" }}>{item.size}</td>
                        <td style={{ padding: "0.5rem" }}>{item.quantity}</td>
                        <td style={{ padding: "0.5rem" }}>Rs.{item.price.toLocaleString()}</td>
                        <td style={{ padding: "0.5rem" }}>Rs.{(item.quantity * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4>Update Order Status</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  handleStatusUpdate(selectedOrder._id, {
                    orderStatus: formData.get("orderStatus"),
                    paymentStatus: formData.get("paymentStatus"),
                    notes: formData.get("notes"),
                  })
                }}
              >
                <div className="grid grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label>Order Status</label>
                    <select className="bg-gray-200" name="orderStatus" defaultValue={selectedOrder.orderStatus} required>
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="enroute">En Route</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label>Payment Status</label>
                    <select className="bg-gray-200" name="paymentStatus" defaultValue={selectedOrder.paymentStatus} required>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
                <br />
                <br />

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea name="notes" rows="3" defaultValue={selectedOrder.notes} />
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="submit" className="btn btn-primary p-2 bg-[#333] text-white" style={{ flex: 1 }}>
                    Update Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="btn btn-secondary bg-red-300 text-white p-2"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                <th style={{ padding: "1rem", textAlign: "left" }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(orders.map((order) => order._id))
                      } else {
                        setSelectedOrders([])
                      }
                    }}
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                  />
                </th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Order #</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Items</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Total</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Payment</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Order Status</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Date</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "1rem" }}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order._id])
                        } else {
                          setSelectedOrders(selectedOrders.filter((id) => id !== order._id))
                        }
                      }}
                    />
                  </td>
                  <td style={{ padding: "1rem" }}>{order.orderNumber}</td>
                  <td style={{ padding: "1rem" }}>
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                    <br />
                    <small style={{ color: "#666" }}>{order.customerInfo.email}</small>
                  </td>
                  <td style={{ padding: "1rem" }}>{order.items.length} items</td>
                  <td style={{ padding: "1rem" }}>Rs.{order.total.toLocaleString()}</td>
                  <td style={{ padding: "1rem" }}>
                    <div>{order.paymentMethod}</div>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        ...getPaymentStatusColor(order.paymentStatus),
                      }}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        ...getStatusColor(order.orderStatus),
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#17a2b8",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "2rem 0" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "1rem",
              backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem 1rem",
              marginLeft: "1rem",
              backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>

        {orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && selectedOrder && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
          }}>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>Confirm Payment</h2>
            
            <div style={{ marginBottom: "1rem" }}>
              <p><strong>Order:</strong> {selectedOrder.orderNumber}</p>
              <p><strong>Customer:</strong> {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}</p>
              <p><strong>Amount:</strong> Rs. {selectedOrder.total}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            </div>

            {selectedOrder.paymentDetails && (
              <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                <h3 style={{ marginBottom: "0.5rem" }}>Payment Details</h3>
                <p><strong>Transaction ID:</strong> {selectedOrder.paymentDetails.transactionId}</p>
                {selectedOrder.paymentDetails.receiptImage && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <p><strong>Receipt:</strong></p>
                    <img 
                      src={selectedOrder.paymentDetails.receiptImage} 
                      alt="Payment Receipt"
                      style={{ maxWidth: "100%", height: "auto", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Admin Notes:
              </label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Add notes about payment verification..."
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  minHeight: "80px",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentNotes("")
                }}
                disabled={processingPayment}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: processingPayment ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentConfirmation}
                disabled={processingPayment}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: processingPayment ? "not-allowed" : "pointer",
                }}
              >
                {processingPayment ? "Confirming..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderManagement
