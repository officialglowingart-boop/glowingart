import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen font-serif pb-28 md:pb-20" style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}>
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-4" >
        <h1 className="sm:text-5xl text-3xl font-bold text-center text-gray-900 sm:mb-12 mb-6 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
          Privacy Policy
        </h1>

        <div className="bg-white  sm:p-8   space-y-6" style={{ backgroundColor: "#dfdfd8"}}>
          <div className="text-gray-700 leading-relaxed space-y-4" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase, 
                subscribe to our newsletter, or contact us for support. This may include:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Personal information (name, email address, phone number, shipping address)</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Account information (username, password, preferences)</li>
                <li>Communication data (messages, reviews, feedback)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer service and support</li>
                <li>Send you promotional emails and newsletters (with your consent)</li>
                <li>Improve our products and services</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                except in the following circumstances:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>With service providers who assist us in operating our business</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                and personalize content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and personal data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy 
                practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your data during such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If we become aware of such collection, we will delete the information immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 " style={{ backgroundColor: "#dfdfd8"}}>
                <p><strong>Email:</strong> privacy@glowing-gallery.com</p>
                <p><strong>Phone:</strong> +92 300 1234567</p>
                <p><strong>Address:</strong> Karachi, Pakistan</p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> August 14, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="text-center bg-white rounded-lg sm:p-8 shadow-sm mt-8" style={{ backgroundColor: "#dfdfd8"}}>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Stay up to Date!
          </h2>
          <p className="text-gray-600 mb-8 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Get updates on new Releases and exciting Discounts!
          </p>
          {/* Mobile: stacked input and button with shadow; Desktop: keep existing inline layout */}
          {/* Mobile UI */}
          <div className="md:hidden max-w-sm mx-auto w-full px-3">
            <div className="rounded-md shadow-md border border-black/20 overflow-hidden">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-1.5 bg-white text-gray-800 placeholder-gray-500 outline-none"
                style={{ fontFamily: 'Times, \"Times New Roman\", serif', backgroundColor: "#ffffff" }}
              />
              <button className="w-full bg-gray-800 text-white py-1.5 hover:bg-gray-700 transition-colors duration-200 font-serif">
                →
              </button>
            </div>
          </div>

          {/* Desktop UI (unchanged) */}
          <div className="hidden md:flex max-w-md mx-auto border border-black overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-3 outline-none text-gray-700 font-serif bg-white"
              style={{ fontFamily: 'Times, \"Times New Roman\", serif', backgroundColor: "#ffffff" }}
            />
            <button className="bg-gray-800 text-white px-6 py-3 hover:bg-gray-700 transition-colors duration-200 font-serif">
              →
            </button>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default PrivacyPolicy;