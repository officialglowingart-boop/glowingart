import React from 'react'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-8" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Shipping Policy
          </h1>
          
          <p className="text-gray-800 text-lg leading-relaxed mb-8" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            At Glowing-Art, our goal is to offer you the best shipping options, no matter where you live. Every day, we ship to hundreds of customers across the globe, ensuring high levels of service and responsiveness.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              1. Order Processing Time
            </h2>
            <div className="text-gray-800 leading-relaxed space-y-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Processing Time:</strong> All orders are processed within 1–3 business days (excluding weekends and holidays) after receiving your order confirmation. This includes order verification, quality checks, and packaging.</li>
                <li>Once your order is processed, it will be dispatched from our fulfillment center.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              2. Estimated Shipping Time by Region
            </h2>
            <div className="text-gray-800 leading-relaxed mb-6" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400 bg-white">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 px-4 py-3 text-left font-bold" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Destination Type
                      </th>
                      <th className="border border-gray-400 px-4 py-3 text-left font-bold" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Estimated Delivery Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Same city
                      </td>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        1–2 business days
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Major city to major city
                      </td>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        2–3 business days
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Remote/rural regions
                      </td>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        3–5 business days
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Overnight/Express
                      </td>
                      <td className="border border-gray-400 px-4 py-3" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                        Next-day delivery
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-yellow-900 font-medium" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  <strong>⚠️ Please note:</strong> Delivery times are estimates and may vary depending on customs clearance, local postal service efficiency, and unexpected logistics disruptions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              3. Shipping Fees & Customs
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Shipping Fees:</strong> We offer free standard international shipping on all orders — no minimum purchase required.</li>
                <li><strong>Customs & Duties:</strong> Most international shipments are not subject to additional import taxes or duties. However, customs policies vary by country, and customers are responsible for any applicable customs fees imposed by their local government.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              4. Lost or Undelivered Packages
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p className="mb-4">
                We guarantee delivery of your order. If your package:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Is delayed beyond 20 days, or</li>
                <li>Shows no tracking updates for more than 7 days, or</li>
                <li>Is marked as delivered but you did not receive it,</li>
              </ul>
              <p className="mb-4">
                Please contact our support team at support@glowing-art.com. We will:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Investigate the shipment with the carrier, and</li>
                <li>Reship the item free of charge or issue a full refund if the package is confirmed lost or undelivered.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              5. Tracking Your Order
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p>
                Once your order has been shipped, you will receive a confirmation email with a tracking number. Please allow up to 48 hours for the tracking link to become active.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              6. Need Help?
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p className="mb-4">
                If you have questions about shipping to your country or need assistance with your order, reach out to our team anytime at:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <HiMail className="text-blue-600 text-xl flex-shrink-0" />
                  <p style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <strong>Email:</strong> <a href="mailto:support@glowing-art.com" className="text-blue-600 hover:text-blue-800 underline font-medium">support@glowing-art.com</a>
                  </p>
                </div>
                <div className="flex items-center gap-3 ">
                  <HiPhone className="text-green-600 text-xl flex-shrink-0" />
                  <p style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <strong>Phone:</strong> <a href="tel:+923260230367" className="text-green-600 hover:text-green-800 underline font-medium">+92 326 0230 367</a>
                  </p>
                </div>
              
              </div>
            </div>
          </section>
        </div>
<div className='mb-14'></div>
     
      </div>
    </div>
  )
}