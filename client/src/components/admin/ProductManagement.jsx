"use client"

import { useState, useEffect } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "../../services/api"

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Limited Designs",
    sizes: [
      { name: "Small", price: 0, originalPrice: 0 },
      { name: "Large", price: 0, originalPrice: 0 },
    ],
    tags: [],
    featured: false,
    inStock: true,
  })
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([
    // fallback categories if API fails
    "Limited Designs",
    "One Piece",
    "More Anime",
    "Never Forgotten",
  ])

  useEffect(() => {
  // Load categories first for priority sorting, then products
  fetchCategories()
  fetchProducts()
  }, [])

  const sortByCategoryPriority = (items = [], cats = []) => {
    // Build a priority map: lower sortOrder => higher priority
    const map = new Map()
    cats.forEach((c, idx) => {
      if (typeof c === "string") {
        map.set(c, idx)
      } else if (c && c.name) {
        const order = typeof c.sortOrder === "number" ? c.sortOrder : idx
        map.set(c.name, order)
      }
    })

    const withDefault = (name) => (map.has(name) ? map.get(name) : Number.MAX_SAFE_INTEGER)

    return [...items].sort((a, b) => {
      const pa = withDefault(a.category)
      const pb = withDefault(b.category)
      if (pa !== pb) return pa - pb
      // Secondary: featured first, then newest
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }

  const fetchProducts = async () => {
    try {
      const response = await getProducts()
      setProducts(sortByCategoryPriority(response.products, categories))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Basic client-side validation to avoid 500s from bad payloads
      const invalidSize = (formData.sizes || []).some(
        (s) => !s || !s.name || s.name.trim() === "" || isNaN(Number(s.price))
      )
      if (invalidSize) {
        alert("Please provide at least one size with a valid name and price.")
        return
      }

      const productFormData = new FormData()

      // Add basic fields
      Object.keys(formData).forEach((key) => {
        if (key === "sizes" || key === "tags") {
          productFormData.append(key, JSON.stringify(formData[key]))
        } else {
          productFormData.append(key, formData[key])
        }
      })

      // Add images
      images.forEach((image) => {
        productFormData.append("images", image)
      })

      if (editingProduct) {
        await updateProduct(editingProduct._id, productFormData)
      } else {
        await createProduct(productFormData)
      }

      setShowForm(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (error) {
  console.error("Error saving product:", error)
  const msg = error?.response?.data?.message || error?.message || "Error saving product. Please try again."
  alert(msg)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      sizes: product.sizes,
      tags: product.tags,
      featured: product.featured,
      inStock: product.inStock,
    })
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId)
        fetchProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Error deleting product. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "Limited Designs",
      sizes: [
        { name: "Small", price: 0, originalPrice: 0 },
        { name: "Large", price: 0, originalPrice: 0 },
      ],
      tags: [],
      featured: false,
      inStock: true,
    })
    setImages([])
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes]
    newSizes[index][field] = field === "name" ? value : Number.parseFloat(value) || 0
    setFormData({ ...formData, sizes: newSizes })
  }

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
  }

  // Fetch categories when modal opens (to refresh), and also resort products when categories change
  useEffect(() => {
    if (showForm) {
      fetchCategories()
    }
  }, [showForm])

  useEffect(() => {
    // Resort whenever categories update
    if (products && products.length > 0) {
      setProducts((prev) => sortByCategoryPriority(prev, categories))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories])

  const fetchCategories = async () => {
    try {
      const response = await getCategories(true)
      if (response.categories && response.categories.length > 0) {
        setCategories(response.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      // fallback categories already set
    }
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProduct(null)
            resetForm()
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
        >
          Add New Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                >
                  {categories.map((cat) => (
                    typeof cat === "string" ? (
                      <option key={cat} value={cat}>{cat}</option>
                    ) : (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    )
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                />
                <p className="text-sm text-gray-600 mt-1">Select multiple images for the product</p>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes & Pricing</label>
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <select
                      value={size.name}
                      onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="Small">Small</option>
                      <option value="Large">Large</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Original Price (optional)"
                      value={size.originalPrice}
                      onChange={(e) => handleSizeChange(index, "originalPrice", e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-8 mb-6">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="featured" 
                    checked={formData.featured} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Product</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="inStock" 
                    checked={formData.inStock} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                <th style={{ padding: "1rem", textAlign: "left" }}>Image</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Category</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Price Range</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "1rem" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url || "/placeholder.svg"}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            color: "#999",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div>
                      <strong>{product.name}</strong>
                      {product.featured && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "#d4af37",
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                          }}
                        >
                          FEATURED
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>{product.category}</td>
                  <td style={{ padding: "1rem" }}>
                    Rs.{Math.min(...product.sizes.map((s) => s.price)).toLocaleString()} - Rs.
                    {Math.max(...product.sizes.map((s) => s.price)).toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        backgroundColor: product.inStock ? "#d4edda" : "#f8d7da",
                        color: product.inStock ? "#155724" : "#721c24",
                      }}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(product)}
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
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductManagement
