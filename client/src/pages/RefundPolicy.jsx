import React from 'react'
import { HiMail, HiPhone } from 'react-icons/hi'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Refund Policy
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Refund & Return Policy
          </h2>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-6" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Thank you for shopping with Glowing-Art. We value your trust and satisfaction and strive to provide you with high-quality products and excellent customer service. Please read this Return and Refund Policy carefully before making a purchase from our store.
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                1. Returns
              </h3>
              <div className="space-y-4 text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  1.1. We accept returns within 7 days of delivery. Items must be unused, in original packaging, and in the same condition as received. Proof of purchase (order number or receipt) is required.
                </p>
                <p>
                  1.2. To request a return, contact us via the "Contact Us" page or email us at support@glowing-art.com. We'll provide return instructions and authorization if needed.
                </p>
                <p>
                  1.3. Return shipping costs are the buyer's responsibility unless the return is due to our error or a defective product.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                2. Refunds
              </h3>
              <div className="space-y-4 text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  2.1. Once the returned item is received and inspected, we will notify you of the refund approval or rejection.
                </p>
                <p>
                  2.2. If approved, refunds will be issued to your original payment method within 3–7 business days. Please note, some payment providers may deduct a non-refundable transaction fee.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                3. Exchanges
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  3.1. We do not offer direct exchanges. If you want another variant, please return the item and place a new order.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                4. Non-Refundable Items
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p className="mb-2">
                  4.1. We do not accept returns for:
                </p>
                <div className="ml-4 space-y-1">
                  <p>Personalized/custom-made items</p>
                  <p>Digital products (downloads/software)</p>
                  <p>Health and hygiene items (e.g., masks, earrings)</p>
                  <p>Final Sale or Clearance items</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                5. Damaged or Defective Items
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  5.1. Contact support@glowing-art.com with photos/videos if your item arrives damaged or defective. We will provide a suitable solution—such as replacement, refund, or repair.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                6. Cancellations
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  6.1. Orders can be canceled before shipment for a full refund. If the order has shipped, you can return it after delivery. Customers are responsible for return shipping unless cancellation is due to our error.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                7. Contact Us
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p className="mb-4">If you have questions, please contact us at:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HiMail className="text-blue-600 text-lg" />
                    <a href="mailto:support@glowing-art.com" className="text-blue-600 hover:text-blue-800 underline">
                      support@glowing-art.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiPhone className="text-green-600 text-lg" />
                    <a href="tel:+923260230367" className="text-green-600 hover:text-green-800 underline">
                      +92 326 0230 367
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Exchanges
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Refunds
              </h3>
              <div className="text-gray-700" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                <p>
                  We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}