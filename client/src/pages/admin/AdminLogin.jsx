"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "../../context/AdminContext"

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const { login, loading, error, isAuthenticated } = useAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(credentials)
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-yellow-600 mb-2 italic">
            Glowing Art
          </h1>
          <h2 className="text-xl font-semibold text-gray-800">Admin Login</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition duration-200"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>Admin access only</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
