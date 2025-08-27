import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaPinterest, FaTiktok, FaYoutube, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-800 text-white py-8 -mt-24 md:-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop layout (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="order-2 md:order-2">
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
            <div className="order-1 md:order-1 md:text-left">
              <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Get in Touch
              </h4>
              <div className="space-y-2">
                <p className="text-gray-300" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Email: <a href="mailto:support@glowing-art.com" className="text-white hover:text-gray-300 underline">support@glowing-art.com</a>
                </p>
                <p className="text-gray-300 flex items-center gap-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <FaWhatsapp className="text-green-500" />
                  WhatsApp: <a href="https://wa.me/923260230367" className="text-white hover:text-gray-300 underline">+92 326 0230 367</a>
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
            <div className="order-3 md:order-3">
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

          {/* Mobile accordion footer, matching the provided design */}
          <MobileFooterAccordion />
        </div>
      </footer>

      <div className="border-t border-gray-700 pt-2 bg-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-16">
          {/* Left */}
          <div className="order-1 md:order-1 w-full md:w-auto text-center md:text-left">
            <p className="text-black text-md" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <strong>© 2025 Glowing-Art</strong>
            </p>
          </div>

          {/* Right: Payment Methods */}
          <div className="order-2 md:order-2 w-full md:w-auto flex justify-center md:justify-end sm:pb-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <img src="/assets/payment/jazzcash.svg" alt="JazzCash" title="JazzCash" className="h-9 w-auto opacity-90 hover:opacity-100" loading="lazy" />
              <img src="/assets/payment/easypaisa.svg" alt="EasyPaisa" title="EasyPaisa" className="h-9 w-auto opacity-90 hover:opacity-100" loading="lazy" />
              <img src="/assets/payment/bank-transfer.svg" alt="Bank Transfer" title="Bank Transfer" className="h-9 w-auto opacity-90 hover:opacity-100" loading="lazy" />
              <img src="/assets/payment/usdt-trc20.svg" alt="USDT (TRC-20)" title="USDT (TRC-20)" className="h-9 w-auto opacity-90 hover:opacity-100" loading="lazy" />
              {/* Optional COD */}
              {/* <img src="/assets/payment/cod.svg" alt="Cash on Delivery" title="Cash on Delivery" className="h-9 w-auto opacity-90 hover:opacity-100" loading="lazy" /> */}
            </div>
          </div>
        </div>

        {/* Mobile spacer to avoid overlap with bottom navbar */}
        <div className="md:hidden" aria-hidden="true" style={{ height: 'calc(80px + env(safe-area-inset-bottom))' }} />
      </div>
    </>
  )
}

function MobileFooterAccordion() {
  const [open, setOpen] = useState({ categories: false, legal: false, support: false, connect: false })

  const Row = ({ id, title, children }) => (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((s) => ({ ...s, [id]: !s[id] }))}
        className="w-full flex items-center justify-between py-3 border-t border-gray-700 text-white px-1"
        aria-expanded={open[id] ? 'true' : 'false'}
      >
        <span className="text-base font-semibold" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>{title}</span>
        {open[id] ? <FiMinus className="text-white" /> : <FiPlus className="text-white" />}
      </button>
      {open[id] && <div className="pb-3 px-1">{children}</div>}
    </div>
  )

  return (
    <div className="md:hidden bg-gray-800 rounded-t-md">
      <div className="divide-y divide-gray-700">
        <Row id="categories" title="Categories">
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="text-gray-300 hover:text-white underline" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
                Shop All
              </Link>
            </li>
          </ul>
        </Row>

        <Row id="legal" title="Legal">
          <ul className="space-y-2">
            <li>
              <Link to="/terms-of-service" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
                Shipping Policy
              </Link>
            </li>
          </ul>
        </Row>

        <Row id="support" title="Support">
          <ul className="space-y-2">
            <li>
              <Link to="/track-order" className="text-gray-300 hover:text-white underline" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
                Track Your Order
              </Link>
            </li>
            <li>
              <Link to="/common-questions" className="text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Times New Roman", serif' }}>
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-white underline" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
                Contact Us
              </Link>
            </li>
          </ul>
        </Row>

        <Row id="connect" title="Connect">
          <div className="space-y-3">
            <div className="text-gray-300" style={{ fontFamily: 'Times, \"Times New Roman\", serif' }}>
              <p>Email: <a href="mailto:support@glowing-art.com" className="text-white hover:text-gray-300 underline">support@glowing-art.com</a></p>
              <p className="flex items-center gap-2 mt-1">
                <FaWhatsapp className="text-green-500" />
                WhatsApp: <a href="https://wa.me/923260230367" className="text-white hover:text-gray-300 underline">+92 326 0230 367</a>
              </p>
            </div>
            <div className="flex items-center gap-3 py-2">
              <a href="#" aria-label="Facebook" className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-[#1877F2] shadow-sm border border-gray-200" title="Facebook">
                <FaFacebook />
              </a>
              <a href="#" aria-label="X" className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-black shadow-sm border border-gray-200" title="X">
                <FaXTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-pink-500 shadow-sm border border-gray-200" title="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn" className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-[#0A66C2] shadow-sm border border-gray-200" title="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="Pinterest" className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-[#E60023] shadow-sm border border-gray-200" title="Pinterest">
                <FaPinterest />
              </a>
              <a href="#" aria-label="TikTok" className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-black shadow-sm border border-gray-200" title="TikTok">
                <FaTiktok />
              </a>
              <a href="#" aria-label="YouTube" className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-[#FF0000] shadow-sm border border-gray-200" title="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </Row>
      </div>
    </div>
  )
}
