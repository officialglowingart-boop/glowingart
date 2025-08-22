"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { adminLogin, verifyAdmin } from "../services/api"

const AdminContext = createContext()

const adminReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null }
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, admin: action.payload, isAuthenticated: true, error: null }
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload, isAuthenticated: false }
    case "LOGOUT":
      return { ...state, admin: null, isAuthenticated: false, token: null }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem("admin_token"),
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  // Check if admin is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      verifyToken()
    }
  }, [])

  const verifyToken = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await verifyAdmin()
      dispatch({ type: "LOGIN_SUCCESS", payload: response.admin })
    } catch (error) {
      localStorage.removeItem("admin_token")
      dispatch({ type: "LOGOUT" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const login = async (credentials) => {
    try {
      dispatch({ type: "LOGIN_START" })
      const response = await adminLogin(credentials)
      localStorage.setItem("admin_token", response.token)
      dispatch({ type: "LOGIN_SUCCESS", payload: response.admin })
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed"
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    dispatch({ type: "LOGOUT" })
  }

  const value = {
    ...state,
    login,
    logout,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
