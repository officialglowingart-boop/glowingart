"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reviews state
  const [allReviews, setAllReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [reviewsToShow, setReviewsToShow] = useState(6); // Start with 6 reviews
  const [selectedRating, setSelectedRating] = useState(null); // null means show all ratings
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Generate more sample reviews with varying lengths for demonstration
  const generateSampleReviews = () => {
    const names = ["Mariarosaria C.", "Lucy W.", "Jennifer P.", "Delia D.", "Lilli S.", "Luca R.", "Sarah M.", "John D.", "Emma T.", "Michael B.", "Sophia L.", "David W.", "Olivia H.", "James R.", "Isabella G.", "William P.", "Charlotte A.", "Benjamin K.", "Amelia S.", "Alexander F.", "Mia C.", "Henry M.", "Harper N.", "Sebastian V.", "Evelyn B.", "Owen L.", "Abigail D.", "Jack H.", "Emily R.", "Luke T.", "Elizabeth M."];
    const products = ["Luffy 5th gear", "Your Name", "Attack on Titan", "Dragon Ball Z", "Custom Portrait", "Naruto", "One Piece", "Demon Slayer", "Death Note", "My Hero Academia"];
    const reviewTexts = [
      "Beautiful, well made. Delivery took a bit long.",
      "Lovely quality!",
      "Amazing gift!",
      "Wonderful experience! Support was very helpful and on time, the portrait is a fine piece of art",
      "Thank you guys! It was a present for my brother and he loved it so much! He also loved the packaging!",
      "Very beautiful gift. Very appreciated!",
      "Excellent quality and fast shipping!",
      "Perfect for my room decoration.",
      "Outstanding artwork, highly recommend!",
      "Great customer service and amazing product.",
      "Exceeded my expectations!",
      "Beautiful colors and details.",
      "Perfect gift for anime fans!",
      "High quality print and packaging.",
      "Will definitely order again!",
      "Amazing artwork, love it!",
      "Fast delivery and great quality.",
      "Exactly as shown in pictures.",
      "Beautiful addition to my collection.",
      "Perfect size and quality.",
      "I bought this frame as a gift and the surprise was so exciting! The quality is absolutely amazing and the customer service was top-notch.",
      "Auto-translated from Italian: The artwork exceeded all my expectations. Beautiful craftsmanship and attention to detail.",
      "The packaging was excellent and the artwork arrived in perfect condition. Highly recommend this shop!",
      "Such a thoughtful gift! My friend absolutely loved it and it looks perfect in their room.",
      "Great value for money. The quality is outstanding and delivery was faster than expected.",
      "This is my second order and I'm just as impressed as the first time. Will definitely be back!",
      "Perfect for decorating my new apartment. The colors are vibrant and the quality is excellent."
    ];

    const reviews = [];
    for (let i = 0; i < 100; i++) { // Generate 100 sample reviews
      const rating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5
      reviews.push({
        id: i + 1,
        name: names[Math.floor(Math.random() * names.length)],
        verified: Math.random() > 0.2, // 80% verified
        date: new Date(2025, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        rating: rating,
        review: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        productName: products[Math.floor(Math.random() * products.length)],
        productImage: "/placeholder-image.jpg"
      });
    }
    return reviews;
  };

  // Initialize reviews on component mount
  useEffect(() => {
    const reviews = generateSampleReviews();
    setAllReviews(reviews);
    setDisplayedReviews(reviews.slice(0, reviewsToShow));
  }, []);

  // Filter and update displayed reviews when rating filter or reviewsToShow changes
  useEffect(() => {
    let filteredReviews = allReviews;
    
    if (selectedRating) {
      filteredReviews = allReviews.filter(review => review.rating === selectedRating);
    }
    
    setDisplayedReviews(filteredReviews.slice(0, reviewsToShow));
  }, [selectedRating, reviewsToShow, allReviews]);

  const groupProductsByCategory = (products) => {
    const grouped = {};
    products.forEach(product => {
      const category = product.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        ))}
      </div>
    );
  };

  const handleViewMoreReviews = () => {
    setReviewsLoading(true);
    setTimeout(() => {
      setReviewsToShow(prev => prev + 20);
      setReviewsLoading(false);
    }, 500); // Simulate loading delay
  };

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating === selectedRating ? null : rating);
    setReviewsToShow(6); // Reset to initial count when filtering
  };

  const getFilteredReviewsCount = (rating) => {
    return allReviews.filter(review => review.rating === rating).length;
  };

  const getTotalFilteredReviews = () => {
    if (selectedRating) {
      return allReviews.filter(review => review.rating === selectedRating).length;
    }
    return allReviews.length;
  };

  const hasMoreReviews = () => {
    return displayedReviews.length < getTotalFilteredReviews();
  };

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

  const groupedProducts = groupProductsByCategory(products);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
   
      {/* Products by Category */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="mb-8 sm:mb-12 md:mb-16">
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-0 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                {category}
              </h2>
              <Link 
                to={`/category/${category.toLowerCase()}`}
                className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium font-serif self-start sm:self-auto"
                style={{ fontFamily: 'Times, "Times New Roman", serif' }}
              >
                View All →
              </Link>
            </div>

            {/* Products Grid - 2 columns on mobile, 3-4 on larger screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {categoryProducts.slice(0, 8).map((product) => (
                <div key={product._id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <div className=" mx-2 sm:mx-4 md:mx-8 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm mb-8 sm:mb-12" style={{ backgroundColor: "#dfdfd8" }}>
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-2">
            <StarRating rating={5} />
            <span className="ml-2 text-lg font-medium text-gray-800 font-serif">{allReviews.length} Reviews</span>
            <button className="ml-2 p-1">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => handleRatingFilter(null)}
            className={`px-3 py-2 rounded-lg text-sm font-serif transition-colors duration-200 ${
              selectedRating === null
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            All ({allReviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              className={`px-3 py-2 rounded-lg text-sm font-serif transition-colors duration-200 flex items-center ${
                selectedRating === rating
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <span className="mr-1">{rating}</span>
              <span className="text-yellow-400">★</span>
              <span className="ml-1">({getFilteredReviewsCount(rating)})</span>
            </button>
          ))}
        </div>

        {/* Reviews Masonry Grid - Freestyle Layout */}
        <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="break-inside-avoid">
              <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center min-w-0">
                    <h4 className="font-medium text-gray-800 font-serif truncate" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                      {review.name}
                    </h4>
                    {review.verified && (
                      <div className="ml-2 flex items-center flex-shrink-0">
                        <span className="text-green-600 text-sm">✓</span>
                        <span className="text-xs text-gray-500 ml-1 font-serif">Verified</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-serif flex-shrink-0 ml-2">{review.date}</span>
                </div>

                {/* Rating */}
                <div className="mb-3">
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-sm mb-4 leading-relaxed font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  {review.review}
                </p>

                {/* Auto-translated notice for some reviews */}
                {review.review.includes('Italian') && (
                  <p className="text-xs text-gray-500 mb-3 font-serif">
                    Auto-translated from Italian. <span className="underline cursor-pointer">Show original</span>
                  </p>
                )}

                {/* Product Info */}
                <div className="flex items-center">
                  <img 
                    src={review.productImage} 
                    alt={review.productName}
                    className="w-10 h-10 rounded object-cover bg-gray-200 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40?text=Art';
                    }}
                  />
                  <span className="ml-3 text-sm text-gray-600 font-serif truncate" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    {review.productName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Reviews Button */}
        {hasMoreReviews() && (
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={handleViewMoreReviews}
              disabled={reviewsLoading}
              className="inline-block bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-serif"
              style={{ fontFamily: 'Times, "Times New Roman", serif' }}
            >
              {reviewsLoading ? 'Loading...' : `View More Reviews (${getTotalFilteredReviews() - displayedReviews.length} remaining)`}
            </button>
          </div>
        )}

        {/* View All Reviews Page Link */}
        <div className="text-center mt-4">
          <Link 
            to="/reviews"
            className="inline-block text-gray-600 hover:text-gray-800 underline font-serif text-sm"
            style={{ fontFamily: 'Times, "Times New Roman", serif' }}
          >
            Go to dedicated reviews page →
          </Link>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white mx-2 sm:mx-4 md:mx-8 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm mb-8 sm:mb-12" style={{ backgroundColor: "#dfdfd8" }}>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Stay up to Date!
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 md:mb-8 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Get updates on new Releases and exciting Discounts!
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto border-2 border-gray-300 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 outline-none text-gray-700 font-serif text-sm sm:text-base"
              style={{ fontFamily: 'Times, "Times New Roman", serif' }}
            />
            <button className="bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 hover:bg-gray-700 transition-colors duration-200 font-serif text-sm sm:text-base">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
