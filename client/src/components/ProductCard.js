import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart() || {};

  // Provide default values to prevent errors
  const {
    _id = '',
    name = 'Product Name',
    sizes = [],
    images = [],
    category = 'General',
    rating = 0,
    reviewCount = 0
  } = product || {};

  // Get the minimum (current) price across sizes
  const getMinPrice = () => {
    if (!sizes || sizes.length === 0) return 0;
    const nums = sizes
      .map(s => typeof s.price === 'number' ? s.price : Number(s.price))
      .filter(v => Number.isFinite(v));
    return nums.length ? Math.min(...nums) : 0;
  };

  // Get the maximum price across sizes (prefer originalPrice when present)
  const getMaxPrice = () => {
    if (!sizes || sizes.length === 0) return 0;
    const nums = [];
    sizes.forEach(s => {
      const price = typeof s.price === 'number' ? s.price : Number(s.price);
      const original = typeof s.originalPrice === 'number' ? s.originalPrice : Number(s.originalPrice);
      if (Number.isFinite(price)) nums.push(price);
      if (Number.isFinite(original)) nums.push(original);
    });
    return nums.length ? Math.max(...nums) : 0;
  };

  // Get image URL - handle both string and object formats
  const getImageUrl = () => {
    if (!images || images.length === 0) return '/placeholder-image.jpg';
    
    // If images is array of objects with url property
    if (typeof images[0] === 'object' && images[0].url) {
      return images[0].url;
    }
    
    // If images is array of strings
    return images[0];
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event bubbling
    
    if (!addToCart) {
      console.error('addToCart function not available');
      return;
    }
    
    if (sizes.length === 0) {
      console.error('No sizes available for this product');
      return;
    }
    
    // Get the first available size (or smallest size)
    const selectedSize = sizes[0];
    
    const cartItem = {
      _id,
      name,
      images,
      selectedSize: selectedSize.name,
      price: selectedSize.price,
      quantity: 1
    };
    
    try {
      addToCart(cartItem);
      // Trigger cart opening
      window.dispatchEvent(new CustomEvent('openCart'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <Link to={`/product/${_id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={getImageUrl()}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        
        {/* Product Info */}
        <div className="p-3 sm:p-4">
          <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base font-serif line-clamp-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            {name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-1 sm:mb-2">
            <div className="flex text-yellow-400 text-xs sm:text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <span className="text-gray-500 text-xs ml-1 sm:ml-2 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              ({reviewCount || 0})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {(() => {
                const minPrice = getMinPrice();
                const maxPrice = getMaxPrice();
                const showRange = Number.isFinite(minPrice) && Number.isFinite(maxPrice) && maxPrice > minPrice;
                return (
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-bold text-gray-900 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                      Rs.{minPrice.toLocaleString()}
                    </span>
                    {showRange && (
                      <span className="text-sm text-gray-500 line-through font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Rs.{maxPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                );
              })()}
              {sizes.length > 1 && (
                <span className="text-xs text-gray-500 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Starting from
                </span>
              )}
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-gray-800 hover:bg-gray-700 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-serif transition-colors duration-200" 
              style={{ fontFamily: 'Times, "Times New Roman", serif' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
