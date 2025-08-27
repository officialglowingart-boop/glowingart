import React from 'react'
import { HiMail } from 'react-icons/hi'

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Shipping Policy
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-6" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              At Glowing-Art, our goal is to offer you the best shipping options, no matter where you live. Every day, we ship to hundreds of customers across the globe, ensuring high levels of service and responsiveness.
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Order Processing Time
              </h3>
              <div className="space-y-4 text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  <strong>Processing Time:</strong> All orders are processed within 1–3 business days (excluding weekends and holidays) after receiving your order confirmation. This includes order verification, quality checks, and packaging.
                </p>
                <p>
                  Once your order is processed, it will be dispatched from our fulfillment center.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Estimated Shipping Time by Region
              </h3>
              <div className="text-gray-700 mb-6" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          Destination Type
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          Estimated Delivery Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          Same city
                        </td>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          1–2 business days
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          Major city to major city
                        </td>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          2–3 business days
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          Remote/rural regions
                        </td>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          3–5 business days
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          Overnight/Express
                        </td>
                        <td className="border border-gray-300 px-4 py-2" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                          Next-day delivery
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-yellow-800" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <strong>⚠️ Please note:</strong> Delivery times are estimates and may vary depending on customs clearance, local postal service efficiency, and unexpected logistics disruptions.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Shipping Fees & Customs
              </h3>
              <div className="space-y-4 text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  <strong>Shipping Fees:</strong> We offer free standard international shipping on all orders — no minimum purchase required.
                </p>
                <p>
                  <strong>Customs & Duties:</strong> Most international shipments are not subject to additional import taxes or duties. However, customs policies vary by country, and customers are responsible for any applicable customs fees imposed by their local government.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Lost or Undelivered Packages
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p className="mb-4">
                  We guarantee delivery of your order. If your package:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                  <li>Is delayed beyond 20 days, or</li>
                  <li>Shows no tracking updates for more than 7 days, or</li>
                  <li>Is marked as delivered but you did not receive it,</li>
                </ul>
                <p className="mb-4">
                  Please contact our support team at support@glowing-art.com. We will:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Investigate the shipment with the carrier, and</li>
                  <li>Reship the item free of charge or issue a full refund if the package is confirmed lost or undelivered.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Tracking Your Order
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  Once your order has been shipped, you will receive a confirmation email with a tracking number. Please allow up to 48 hours for the tracking link to become active.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Need Help?
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p className="mb-4">
                  If you have questions about shipping to your country or need assistance with your order, reach out to our team anytime at:
                </p>
                <div className="flex items-center gap-2">
                  <HiMail className="text-blue-600 text-lg" />
                  <a href="mailto:support@glowing-art.com" className="text-blue-600 hover:text-blue-800 underline">
                    support@glowing-art.com
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}