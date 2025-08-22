import React from "react"
import { Link, useLocation } from "react-router-dom"
import { FiHome, FiTruck, FiPhone, FiShoppingCart } from "react-icons/fi"
import { useCart } from "../context/CartContext"

// Mobile-only fixed bottom navbar with 4 items
export default function MobileBottomNav() {
  const location = useLocation()
  const { cartItems } = useCart() || {}
  const cartItemCount = cartItems?.reduce((t, i) => t + (i.quantity || 1), 0) || 0
  const [isCartOpen, setIsCartOpen] = React.useState(false)

  // Subscribe to cart open/close state broadcasted by Header
  React.useEffect(() => {
    const handler = (e) => setIsCartOpen(!!e.detail)
    window.addEventListener('cartState', handler)
    return () => window.removeEventListener('cartState', handler)
  }, [])

  const items = [
    { to: "/", label: "Home", icon: FiHome, kind: "link" },
    { to: "/order-tracking", label: "Track", icon: FiTruck, kind: "link" },
    { to: "/contact", label: "Contact", icon: FiPhone, kind: "link" },
    { label: "Cart", icon: FiShoppingCart, kind: "cart" },
  ]

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/"
    // consider both /track-order and /order-tracking active for Track
    if (to === "/order-tracking") return ["/order-tracking", "/track-order"].some((p) => location.pathname.startsWith(p))
    return location.pathname.startsWith(to)
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon, kind }) => {
          if (kind === "cart") {
            return (
              <li key="cart">
                <button
                  onClick={() => window.dispatchEvent(new Event("openCart"))}
                  className={`relative w-full flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium ${
                    isCartOpen ? "text-[#8B4513]" : "text-gray-600"
                  }`}
                  aria-label="Open cart"
                >
                  <Icon className={`text-xl ${isCartOpen ? "" : "opacity-80"}`} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-1 right-6 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold h-4 min-w-4 px-1">
                      {cartItemCount}
                    </span>
                  )}
                  <span>Cart</span>
                </button>
              </li>
            )
          }

          const active = isActive(to)
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={() => window.dispatchEvent(new Event("closeCart"))}
                className={`flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium ${
                  active ? "text-[#8B4513]" : "text-gray-600"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={`text-xl ${active ? "" : "opacity-80"}`} />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      {/* safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
