import React from 'react'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfdfd8" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-8" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              Refund & Return Policy
          </h1>
          
         
          
          <p className="text-gray-800 text-lg leading-relaxed mb-8" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Thank you for shopping with Glowing-Art. We value your trust and satisfaction and strive to provide you with high-quality products and excellent customer service. Please read this Return and Refund Policy carefully before making a purchase from our store.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              1. Returns
            </h2>
            <div className="text-gray-800 leading-relaxed space-y-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p>
                We accept returns within 7 days of delivery. This may include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>1.1. We accept returns within 7 days of delivery. Items must be unused, in original packaging, and in the same condition as received. Proof of purchase (order number or receipt) is required.</li>
                <li>1.2. To request a return, contact us via the "Contact Us" page or email us at support@glowing-art.com. We'll provide return instructions and authorization if needed.</li>
                <li>1.3. Return shipping costs are the buyer's responsibility unless the return is due to our error or a defective product.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              2. Refunds
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>2.1. Once the returned item is received and inspected, we will notify you of the refund approval or rejection.</li>
                <li>2.2. If approved, refunds will be issued to your original payment method within 3–7 business days. Please note, some payment providers may deduct a non-refundable transaction fee.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              3. Exchanges
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>3.1. We do not offer direct exchanges. If you want another variant, please return the item and place a new order.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              4. Non-Refundable Items
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>4.1. We do not accept returns for:</li>
                <li>Personalized/custom-made items</li>
                <li>Digital products (downloads/software)</li>
                <li>Health and hygiene items (e.g., masks, earrings)</li>
                <li>Final Sale or Clearance items</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              5. Damaged or Defective Items
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p>
                5.1. Contact support@glowing-art.com with photos/videos if your item arrives damaged or defective. We will provide a suitable solution—such as replacement, refund, or repair.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              6. Cancellations
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p>
                6.1. Orders can be canceled before shipment for a full refund. If the order has shipped, you can return it after delivery. Customers are responsible for return shipping unless cancellation is due to our error.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              7. Contact Us
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p className="mb-4">
                If you have questions, please contact us at:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <HiMail className="text-blue-600 text-xl flex-shrink-0" />
                  <p style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <strong>Email:</strong> <a href="mailto:support@glowing-art.com" className="text-blue-600 hover:text-blue-800 underline font-medium">support@glowing-art.com</a>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <HiPhone className="text-green-600 text-xl flex-shrink-0" />
                  <p style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <strong>Phone:</strong> <a href="tel:+923260230367" className="text-green-600 hover:text-green-800 underline font-medium">+92 326 0230 367</a>
                  </p>
                </div>
             
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              8. Exchanges
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p>
                The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              9. Refunds
            </h2>
            <div className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
              <p>
                We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
              </p>
            </div>
          </section>
        </div>
<div className='mb-14'></div>
       
      </div>
    </div>
  )
}