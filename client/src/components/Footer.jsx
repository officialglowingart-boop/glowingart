import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
  <footer className="bg-gray-800 text-white py-8 -mt-16 md:mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Glowing Art
            </h3>
            <p className="text-gray-300 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Discover our exclusive collection of beautiful digital art pieces
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/common-questions" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            © 2025 Glowing Art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
