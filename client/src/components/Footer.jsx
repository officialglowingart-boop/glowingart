import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 -mt-16 md:mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              About
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Get in Touch
            </h4>
            <div className="space-y-2">
              <p className="text-gray-300" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Email: <a href="mailto:support@basesunworks.com" className="text-white hover:text-gray-300 underline">support@basesunworks.com</a>
              </p>
              <div className="text-gray-300" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Follow Us: 
                <a href="#" className="text-white hover:text-gray-300 underline ml-1 mr-2">Instagram</a>
                | 
                <a href="#" className="text-white hover:text-gray-300 underline ml-2">TikTok</a>
              </div>
            </div>
          </div>

          {/* Customer Support Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/track-order" className="text-gray-300 hover:text-white transition-colors underline" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/common-questions" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors underline" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Currency and Language Selectors */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <select className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-gray-500">
                  <option>$ USD</option>
                  <option>€ EUR</option>
                  <option>£ GBP</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-gray-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-4 gap-1">
                {/* Payment method icons - you'll need to add actual payment icons */}
                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center text-white font-bold">AE</div>
                <div className="w-8 h-5 bg-black rounded text-xs flex items-center justify-center text-white font-bold">AP</div>
                <div className="w-8 h-5 bg-blue-500 rounded text-xs flex items-center justify-center text-white font-bold">AM</div>
                <div className="w-8 h-5 bg-blue-700 rounded text-xs flex items-center justify-center text-white font-bold">D</div>
                <div className="w-8 h-5 bg-orange-500 rounded text-xs flex items-center justify-center text-white font-bold">DC</div>
                <div className="w-8 h-5 bg-green-600 rounded text-xs flex items-center justify-center text-white font-bold">GP</div>
                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center text-white font-bold">PP</div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center text-white font-bold">M</div>
                <div className="w-8 h-5 bg-red-500 rounded text-xs flex items-center justify-center text-white font-bold">MC</div>
                <div className="w-8 h-5 bg-blue-400 rounded text-xs flex items-center justify-center text-white font-bold">PP</div>
                <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center text-white font-bold">UP</div>
                <div className="w-8 h-5 bg-blue-800 rounded text-xs flex items-center justify-center text-white font-bold">V</div>
                <div className="w-8 h-5 bg-gray-600 rounded text-xs flex items-center justify-center text-white font-bold">VE</div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6">
            <p className="text-gray-300 text-sm" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              © 2025 Basesunworks
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
