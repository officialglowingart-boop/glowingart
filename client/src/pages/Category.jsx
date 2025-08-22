import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const data = await getProducts();
        // Filter products by category
        const filteredProducts = data.products.filter(
          product => product.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filteredProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
        <div className="text-xl text-gray-600 font-serif">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
        <div className="text-xl text-red-600 font-serif">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-serif capitalize" 
              style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            {products.length} products found
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <div key={product._id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;