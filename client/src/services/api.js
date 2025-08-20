import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL 
//const API_BASE_URL = "http://localhost:5000/api"



const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Products API
export const getProducts = (params = {}) => api.get("/products", { params }).then((res) => res.data)

export const getProduct = (id) => api.get(`/products/${id}`).then((res) => res.data)

export const createProduct = (productData) => api.post("/products", productData).then((res) => res.data)

export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData).then((res) => res.data)

export const deleteProduct = (id) => api.delete(`/products/${id}`).then((res) => res.data)

// Reviews API
export const getProductReviews = (productId, params = {}) =>
  api.get(`/reviews/product/${productId}`, { params }).then((res) => res.data)

export const getProductReviewSummary = (productId) =>
  api.get(`/reviews/product/${productId}/summary`).then((res) => res.data)

export const getAllApprovedReviews = (params = {}) => api.get("/reviews/approved", { params }).then((res) => res.data)

export const createReview = (reviewData) => api.post("/reviews", reviewData).then((res) => res.data)

export const getAdminReviews = (params = {}) => api.get("/reviews/admin", { params }).then((res) => res.data)

export const updateReviewStatus = (id, statusData) =>
  api.put(`/reviews/${id}/status`, statusData).then((res) => res.data)

export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((res) => res.data)

// Orders API
export const createOrder = (orderData) => api.post("/orders", orderData).then((res) => res.data)

export const trackOrder = (orderNumber, email) =>
  api.get(`/orders/track/${orderNumber}?email=${email}`).then((res) => res.data)

// Payment API
export const getPaymentInstructions = (orderNumber) =>
  api.get(`/payments/instructions/${orderNumber}`).then((res) => res.data)

export const confirmPayment = (orderNumber, paymentData) =>
  api.post(`/payments/confirm/${orderNumber}`, paymentData).then((res) => res.data)

export const getPaymentVerifications = (params = {}) =>
  api.get("/admin/payments/verifications", { params }).then((res) => res.data)

export const verifyPayment = (id, verificationData) =>
  api.put(`/admin/payments/verify/${id}`, verificationData).then((res) => res.data)

// Categories API
export const getCategories = (admin = false) =>
  api.get(admin ? "/categories/admin" : "/categories").then((res) => res.data)

export const createCategory = (categoryData) => api.post("/categories", categoryData).then((res) => res.data)

export const updateCategory = (id, categoryData) => api.put(`/categories/${id}`, categoryData).then((res) => res.data)

export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((res) => res.data)

// Admin API
export const adminLogin = (credentials) => api.post("/auth/admin/login", credentials).then((res) => res.data)

export const verifyAdmin = () => api.get("/auth/admin/verify").then((res) => res.data)

export const getDashboardStats = () => api.get("/admin/dashboard").then((res) => res.data)

export const getAdminOrders = (params = {}) => api.get("/admin/orders", { params }).then((res) => res.data)

export const updateOrderStatus = (id, statusData) => api.put(`/admin/orders/${id}`, statusData).then((res) => res.data)

export const getOrderDetails = (id) => api.get(`/admin/orders/${id}`).then((res) => res.data)

export const confirmOrderPayment = (id, adminNotes) =>
  api.patch(`/admin/orders/${id}/confirm-payment`, { adminNotes }).then((res) => res.data)

export const submitPaymentProof = (orderId, transactionId, receiptFile) => {
  const formData = new FormData()
  formData.append("transactionId", transactionId)
  formData.append("receiptImage", receiptFile)

  return api
    .patch(`/orders/${orderId}/payment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
}

export default api
