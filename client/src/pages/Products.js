import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { getProducts } from "../services/api"

const useQuery = () => new URLSearchParams(useLocation().search)

const Products = () => {
  const query = useQuery()
  const search = query.get("search") || ""

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState({ appliedSearch: search, matchType: null, total: 0 })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getProducts({ search })
        setProducts(data.products || [])
        setMeta({
          appliedSearch: data.appliedSearch ?? search,
          matchType: data.matchType ?? (search ? "regex" : null),
          total: data.total ?? (data.products ? data.products.length : 0),
        })
      } catch (e) {
        console.error("Error fetching search results", e)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [search])

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-serif">
            {search ? `Results for "${meta.appliedSearch || search}"` : "All Products"}
          </h1>
          {meta.matchType && (
            <p className="text-sm text-gray-600 mt-1 font-serif">
              {meta.matchType === "exact" && "Exact name match"}
              {meta.matchType === "trim" && "Closest matches (trimmed)"}
              {meta.matchType === "none" && "No results found"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-xl text-gray-600 font-serif">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-xl text-red-600 font-serif">{error}</div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <div key={product._id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 font-serif">No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
