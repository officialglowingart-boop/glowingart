// "use client"

// import { useState, useEffect } from "react"

// const CouponManagement = () => {
//   const [coupons, setCoupons] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [showForm, setShowForm] = useState(false)
//   const [editingCoupon, setEditingCoupon] = useState(null)
//   const [formData, setFormData] = useState({
//     code: "",
//     type: "percentage", // percentage or fixed
//     value: "",
//     minOrderAmount: "",
//     maxDiscount: "",
//     usageLimit: "",
//     usedCount: 0,
//     expiryDate: "",
//     isActive: true,
//     description: "",
//   })

//   useEffect(() => {
//     fetchCoupons()
//   }, [])

//   const fetchCoupons = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch("http://localhost:5000/api/admin/coupons", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       })
//       if (response.ok) {
//         const data = await response.json()
//         setCoupons(data.coupons || [])
//       }
//     } catch (error) {
//       console.error("Error fetching coupons:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const url = editingCoupon
//         ? `http://localhost:5000/api/admin/coupons/${editingCoupon._id}`
//         : "http://localhost:5000/api/admin/coupons"

//       const method = editingCoupon ? "PUT" : "POST"

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//         body: JSON.stringify(formData),
//       })

//       if (response.ok) {
//         await fetchCoupons()
//         resetForm()
//         alert(editingCoupon ? "Coupon updated successfully!" : "Coupon created successfully!")
//       } else {
//         const error = await response.json()
//         alert(error.message || "Failed to save coupon")
//       }
//     } catch (error) {
//       console.error("Error saving coupon:", error)
//       alert("Failed to save coupon")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEdit = (coupon) => {
//     setEditingCoupon(coupon)
//     setFormData({
//       code: coupon.code,
//       type: coupon.type,
//       value: coupon.value,
//       minOrderAmount: coupon.minOrderAmount || "",
//       maxDiscount: coupon.maxDiscount || "",
//       usageLimit: coupon.usageLimit || "",
//       usedCount: coupon.usedCount || 0,
//       expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : "",
//       isActive: coupon.isActive,
//       description: coupon.description || "",
//     })
//     setShowForm(true)
//   }

//   const handleDelete = async (couponId) => {
//     if (!window.confirm("Are you sure you want to delete this coupon?")) return

//     setLoading(true)
//     try {
//       const response = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       })

//       if (response.ok) {
//         await fetchCoupons()
//         alert("Coupon deleted successfully!")
//       } else {
//         alert("Failed to delete coupon")
//       }
//     } catch (error) {
//       console.error("Error deleting coupon:", error)
//       alert("Failed to delete coupon")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       code: "",
//       type: "percentage",
//       value: "",
//       minOrderAmount: "",
//       maxDiscount: "",
//       usageLimit: "",
//       usedCount: 0,
//       expiryDate: "",
//       isActive: true,
//       description: "",
//     })
//     setEditingCoupon(null)
//     setShowForm(false)
//   }

//   const toggleCouponStatus = async (couponId, currentStatus) => {
//     setLoading(true)
//     try {
//       const response = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}/toggle`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//         body: JSON.stringify({ isActive: !currentStatus }),
//       })

//       if (response.ok) {
//         await fetchCoupons()
//       } else {
//         alert("Failed to update coupon status")
//       }
//     } catch (error) {
//       console.error("Error updating coupon status:", error)
//       alert("Failed to update coupon status")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Coupon Management</h2>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
//         >
//           Create New Coupon
//         </button>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-800">{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</h3>
//               <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-2xl">
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
//                   <input
//                     type="text"
//                     name="code"
//                     value={formData.code}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                     placeholder="e.g., WELCOME10"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
//                   <select
//                     name="type"
//                     value={formData.type}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                     required
//                   >
//                     <option value="percentage">Percentage (%)</option>
//                     <option value="fixed">Fixed Amount (Rs.)</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
//                   <input
//                     type="number"
//                     name="value"
//                     value={formData.value}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                     placeholder={formData.type === "percentage" ? "10" : "500"}
//                     min="0"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount</label>
//                   <input
//                     type="number"
//                     name="minOrderAmount"
//                     value={formData.minOrderAmount}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                     placeholder="1000"
//                     min="0"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Maximum Discount (for percentage)
//                   </label>
//                   <input
//                     type="number"
//                     name="maxDiscount"
//                     value={formData.maxDiscount}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                     placeholder="1000"
//                     min="0"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
//                   <input
//                     type="number"
//                     name="usageLimit"
//                     value={formData.usageLimit}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                     placeholder="100"
//                     min="0"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
//                 <input
//                   type="date"
//                   name="expiryDate"
//                   value={formData.expiryDate}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
//                   placeholder="Optional description for the coupon"
//                 />
//               </div>

//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 text-sm font-medium text-gray-700">Active</label>
//               </div>

//               <div className="flex gap-4 pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
//                 >
//                   {loading ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Value
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Usage
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Expiry
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {coupons.map((coupon) => (
//                 <tr key={coupon._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="font-medium text-gray-900">{coupon.code}</div>
//                     {coupon.description && <div className="text-sm text-gray-500">{coupon.description}</div>}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       {coupon.type}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {coupon.type === "percentage" ? `${coupon.value}%` : `Rs.${coupon.value}`}
//                     {coupon.maxDiscount && coupon.type === "percentage" && (
//                       <div className="text-xs text-gray-500">Max: Rs.{coupon.maxDiscount}</div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {coupon.usedCount || 0}
//                     {coupon.usageLimit && ` / ${coupon.usageLimit}`}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {coupon.isActive ? "Active" : "Inactive"}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "No expiry"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button onClick={() => handleEdit(coupon)} className="text-yellow-600 hover:text-yellow-900 mr-4">
//                       Edit
//                     </button>
//                     <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-900">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {coupons.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-500 text-lg mb-4">No coupons found</div>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
//             >
//               Create Your First Coupon
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CouponManagement





































































"use client"

import { useState, useEffect } from "react"

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage", // percentage or fixed
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    usedCount: 0,
    expiryDate: "",
    isActive: true,
    description: "",
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/admin/coupons", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCoupons(data.coupons || [])
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingCoupon
        ? `http://localhost:5000/api/admin/coupons/${editingCoupon._id}`
        : "http://localhost:5000/api/admin/coupons"

      const method = editingCoupon ? "PUT" : "POST"

      const payload = {
        code: formData.code,
        discountType: formData.type, // Map 'type' to 'discountType'
        discountValue: Number.parseFloat(formData.value), // Map 'value' to 'discountValue'
        minimumOrderAmount: formData.minOrderAmount ? Number.parseFloat(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscount ? Number.parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number.parseInt(formData.usageLimit) : null,
        validFrom: new Date(), // Set current date as start date
        validUntil: formData.expiryDate
          ? new Date(formData.expiryDate)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Map 'expiryDate' to 'validUntil'
        isActive: formData.isActive,
        description: formData.description || "",
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(payload), // Send mapped payload instead of formData
      })

      if (response.ok) {
        await fetchCoupons()
        resetForm()
        alert(editingCoupon ? "Coupon updated successfully!" : "Coupon created successfully!")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to save coupon")
      }
    } catch (error) {
      console.error("Error saving coupon:", error)
      alert("Failed to save coupon")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      type: coupon.discountType, // Map 'discountType' to 'type'
      value: coupon.discountValue, // Map 'discountValue' to 'value'
      minOrderAmount: coupon.minimumOrderAmount || "",
      maxDiscount: coupon.maxDiscountAmount || "",
      usageLimit: coupon.usageLimit || "",
      usedCount: coupon.usedCount || 0,
      expiryDate: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split("T")[0] : "", // Map 'validUntil' to 'expiryDate'
      isActive: coupon.isActive,
      description: coupon.description || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })

      if (response.ok) {
        await fetchCoupons()
        alert("Coupon deleted successfully!")
      } else {
        alert("Failed to delete coupon")
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
      alert("Failed to delete coupon")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      minOrderAmount: "",
      maxDiscount: "",
      usageLimit: "",
      usedCount: 0,
      expiryDate: "",
      isActive: true,
      description: "",
    })
    setEditingCoupon(null)
    setShowForm(false)
  }

  const toggleCouponStatus = async (couponId, currentStatus) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        await fetchCoupons()
      } else {
        alert("Failed to update coupon status")
      }
    } catch (error) {
      console.error("Error updating coupon status:", error)
      alert("Failed to update coupon status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupon Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
        >
          Create New Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., WELCOME10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder={formData.type === "percentage" ? "10" : "500"}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="1000"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Discount (for percentage)
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="1000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required // Made expiry date required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Optional description for the coupon"
                  required // Made description required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
                >
                  {loading ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{coupon.code}</div>
                    {coupon.description && <div className="text-sm text-gray-500">{coupon.description}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {coupon.discountType} {/* Use discountType instead of type */}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `Rs.${coupon.discountValue}`}{" "}
                    {/* Use discountType and discountValue */}
                    {coupon.maxDiscountAmount && coupon.discountType === "percentage" && (
                      <div className="text-xs text-gray-500">Max: Rs.{coupon.maxDiscountAmount}</div> // Use maxDiscountAmount
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coupon.usedCount || 0}
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "No expiry"}{" "}
                    {/* Use validUntil instead of expiryDate */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(coupon)} className="text-yellow-600 hover:text-yellow-900 mr-4">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No coupons found</div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              Create Your First Coupon
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CouponManagement
