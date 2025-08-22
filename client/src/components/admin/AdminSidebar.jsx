"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAdmin } from "../../context/AdminContext"

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { admin, logout } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "",
      description: "Overview & Statistics",
    },
    {
      id: "products",
      label: "Products",
      icon: "",
      description: "Manage Products",
    },
    {
      id: "categories",
      label: "Categories",
      icon: "",
      description: "Manage Categories",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "",
      description: "Order Management",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: "",
      description: "Review Management",
    },
    {
      id: "payments",
      label: "Payments",
      icon: "",
      description: "Payment Verification",
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: "",
      description: "Coupon Management",
    },
  ]

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-yellow-400" style={{ fontFamily: "serif", fontStyle: "italic" }}>
              Glowing Art
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center font-bold">
              {admin?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-medium">{admin?.username || "Admin"}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-yellow-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                title={collapsed ? item.label : ""}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
          title={collapsed ? "Logout" : ""}
        >
          <span className="text-xl">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
