"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "../../context/AdminContext"
import { getDashboardStats } from "../../services/api"
import AdminSidebar from "../../components/admin/AdminSidebar"
import ProductManagement from "../../components/admin/ProductManagement"
import OrderManagement from "../../components/admin/OrderManagement"
import CategoryManagement from "../../components/admin/CategoryManagement"
import ReviewManagement from "../../components/admin/ReviewManagement"
import PaymentVerification from "../../components/admin/PaymentVerification"

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { admin, isAuthenticated } = useAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login")
      return
    }
    fetchStats()
  }, [isAuthenticated, navigate])

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats()
      setStats(response)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            {loading ? (
              <div className="text-center py-8">Loading stats...</div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-3xl font-bold text-yellow-600 mb-2">{stats?.stats?.totalOrders || 0}</h3>
                    <p className="text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-3xl font-bold text-green-600 mb-2">{stats?.stats?.totalProducts || 0}</h3>
                    <p className="text-gray-600">Total Products</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-3xl font-bold text-orange-600 mb-2">{stats?.stats?.pendingOrders || 0}</h3>
                    <p className="text-gray-600">Pending Orders</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">
                      Rs.{(stats?.stats?.totalRevenue || 0).toLocaleString()}
                    </h3>
                    <p className="text-gray-600">Total Revenue</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                  {stats?.recentOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stats.recentOrders.map((order) => (
                            <tr key={order._id}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.orderNumber}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.customerInfo.firstName} {order.customerInfo.lastName}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.items.length} items
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                Rs.{order.total.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.orderStatus === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.orderStatus === "shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No recent orders</p>
                  )}
                </div>
              </>
            )}
          </div>
        )

      case "products":
        return <ProductManagement />

      case "categories":
        return <CategoryManagement />

      case "orders":
        return <OrderManagement />

      case "reviews":
        return <ReviewManagement />

      case "payments":
        return <PaymentVerification />

      default:
        return <div className="p-6">Section not found</div>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  )
}

export default AdminDashboard
