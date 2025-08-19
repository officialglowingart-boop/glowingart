"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import TextSlider from './TextSlider'; // Add this import

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchAreaRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  

  const { cartItems, toggleCart, removeFromCart, updateQuantity } = useCart() || {};
  const cartItemCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  const getCartTotal = () => {
    return cartItems?.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0) || 0;
  };

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    const latest = (searchInputRef.current?.value ?? searchQuery).trim();
    if (latest) {
      navigate(`/products?search=${encodeURIComponent(latest)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  // Auto-focus the search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      // slight delay to ensure element is mounted
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isSearchOpen]);

  // Close search when clicking outside (desktop + mobile)
  useEffect(() => {
    if (!isSearchOpen) return;
    const onDocMouseDown = (e) => {
      const insideDesktop = !!(searchAreaRef.current && searchAreaRef.current.contains(e.target));
      const insideMobile = !!(mobileSearchRef.current && mobileSearchRef.current.contains(e.target));
      if (!insideDesktop && !insideMobile) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('touchstart', onDocMouseDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('touchstart', onDocMouseDown);
    };
  }, [isSearchOpen]);

  // no header height needed; mobile search now flows with page

  return (
    <>
  <header className="" style={{ backgroundColor: "#dfdfd8" }}>
        {/* Replace the Top Banner with TextSlider */}
        <TextSlider />

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4" style={{ backgroundColor: "#dfdfd8" }}>
          <div className="flex items-center justify-between w-full">
            {/* Left: Mobile menu + search */}
            <div className="flex items-center flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              {/* Search Icon + inline desktop search */}
              <div className="hidden md:flex items-center" ref={searchAreaRef}>
                {!isSearchOpen && (
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </button>
                )}
                {isSearchOpen && (
                  <form onSubmit={handleSearch} className="ml-2 flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 px-3 py-2  rounded-l-lg focus:outline-none  "
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-800 text-white rounded-r-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Search
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="no-underline flex-shrink-0">
                <img
                  src="https://res.cloudinary.com/dnhc1pquv/image/upload/v1755152549/glowing_art_wfvdht.png"
                  alt="Glowing Gallery"
                  className="h-12 sm:h-16 md:h-20"
                />
              </Link>
            </div>

            {/* Right: Currency + Cart */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">PAK | Rs</span>

              {/* Mobile search icon next to cart (hidden when open) */}
              {!isSearchOpen && (
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                  aria-label="Open search"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block" style={{ backgroundColor: "#dfdfd8" }}>
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center justify-center gap-8 py-3">
              {[
                { path: '/', label: 'Home' },
                { path: '/common-questions', label: 'Common Questions' },
                { path: '/contact', label: 'Contact us' },
                { path: '/privacy-policy', label: 'Legal' },
                { path: '/track-order', label: 'Track Order' }
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-700 text-sm font-medium hover:text-yellow-600 transition-colors relative pb-2 ${isActive(link.path) ? 'border-b-2 border-gray-700 text-gray-900' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-300" style={{ backgroundColor: "#dfdfd8" }}>
            <nav className="px-4 py-3 space-y-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/common-questions', label: 'Common Questions' },
                { path: '/contact', label: 'Contact us' },
                { path: '/privacy-policy', label: 'Legal' },
                { path: '/track-order', label: 'Track Order' }
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-gray-700 text-sm font-medium hover:text-yellow-600 transition-colors py-2 px-3 rounded ${isActive(link.path) ? 'bg-gray-200 text-gray-900' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

    {/* Search Box - mobile below navbar (flows with page) */}
      {isSearchOpen && (
        <div
          ref={mobileSearchRef}
      className="md:hidden"
      style={{ backgroundColor: "#dfdfd8" }}
        >
      <div className="max-w-7xl mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="flex">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gray-800 text-white rounded-r-lg hover:bg-gray-700 transition-colors duration-200 "
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Shopping Cart ({cartItemCount})</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {!cartItems || cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={`${item._id}-${item.selectedSize || index}`} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <img
                          src={item.images?.[0]?.url || item.images?.[0] || '/placeholder-image.jpg'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=Art';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Size: {item.selectedSize || 'Standard'}
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            Rs.{(item.price || 0).toLocaleString()}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.selectedSize, Math.max(1, (item.quantity || 1) - 1))}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-800">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.selectedSize, (item.quantity || 1) + 1)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id, item.selectedSize)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems && cartItems.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-800">
                      Total: Rs.{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
