"use client"

import { useState } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"

const Cart = () => {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeFromCart,
    shippingProtection,
    setShippingProtection,
    discountCode,
    setDiscountCode,
    getSubtotal,
    getCartTotal,
  } = useCart()

  const [discountInput, setDiscountInput] = useState("")
  const navigate = useNavigate()

  const handleApplyDiscount = () => {
    // Simple discount logic - in real app, this would call an API
    if (discountInput.toLowerCase() === "save10") {
      setDiscountCode("SAVE10", 1000)
    } else if (discountInput.toLowerCase() === "welcome") {
      setDiscountCode("WELCOME", 500)
    } else {
      alert("Invalid discount code")
    }
  }

  const handleCheckout = () => {
    toggleCart()
    navigate("/checkout")
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "400px",
        height: "100vh",
        backgroundColor: "white",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Cart • {items.length}</h2>
        <button
          onClick={toggleCart}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          ×
        </button>
      </div>

      {/* Cart Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            <p>Your cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: "12px",
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem", fontSize: "1rem" }}>{item.name}</h4>
                <p style={{ margin: "0 0 0.5rem", color: "#666", fontSize: "0.9rem" }}>Size: {item.size}</p>

                {/* Quantity Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "1px solid #ddd",
                      backgroundColor: "white",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: "30px", textAlign: "center" }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "1px solid #ddd",
                      backgroundColor: "white",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Price and Remove */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "#999",
                          textDecoration: "line-through",
                          marginRight: "0.5rem",
                        }}
                      >
                        Rs.{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span style={{ fontWeight: "bold" }}>Rs.{item.price.toLocaleString()}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span style={{ color: "#28a745", fontSize: "0.8rem", marginLeft: "0.5rem" }}>
                        (Save Rs.{(item.originalPrice - item.price).toLocaleString()})
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Footer */}
      {items.length > 0 && (
        <div style={{ padding: "1rem", borderTop: "1px solid #e0e0e0" }}>
          {/* Shipping Protection */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#17a2b8",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                ✓
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "600" }}>Shipping Protection</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                  Protect your order from damage, loss, or theft during shipping.
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontWeight: "600" }}>Rs.{shippingProtection.cost.toLocaleString()}</p>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={shippingProtection.enabled}
                  onChange={(e) => setShippingProtection(e.target.checked)}
                />
                Add
              </label>
            </div>
          </div>

          {/* Discount Code */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Discount code"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
              <button
                onClick={handleApplyDiscount}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#333",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Apply
              </button>
            </div>
            {discountCode.code && (
              <p style={{ margin: "0.5rem 0 0", color: "#28a745", fontSize: "0.9rem" }}>
                Discount "{discountCode.code}" applied: -Rs.{discountCode.discount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Total */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>Subtotal:</span>
              <span>Rs.{getSubtotal().toLocaleString()}</span>
            </div>
            {shippingProtection.enabled && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Shipping Protection:</span>
                <span>Rs.{shippingProtection.cost.toLocaleString()}</span>
              </div>
            )}
            {discountCode.discount > 0 && (
              <div
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#28a745" }}
              >
                <span>Discount:</span>
                <span>-Rs.{discountCode.discount.toLocaleString()}</span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.2rem",
                fontWeight: "bold",
                paddingTop: "0.5rem",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <span>Total:</span>
              <span>Rs.{getCartTotal().toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Checkout • Rs.{getCartTotal().toLocaleString()}
          </button>
        </div>
      )}
    </div>
  )
}

export default Cart
