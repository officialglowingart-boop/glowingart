import React, { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhone, FaComments } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create email body
      const emailBody = `
New Contact Form Submission:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Message: ${formData.comment}
      `;

      // Create mailto link
      const subject = encodeURIComponent('Contact Form Submission from Glowing-Art');
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:support@glowing-art.com?subject=${subject}&body=${body}`;

      // Open default email client
      window.location.href = mailtoLink;

      // Show success message
      alert('Thank you for your message! Your email client should open now. If not, please send your message directly to support@glowing-art.com');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        comment: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again or contact us directly at support@glowing-art.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = '+923260230367';
    const message = 'Hello! I would like to get in touch with you regarding Glowing-Art.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen font-serif" style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center text-gray-900 mb-12 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
          Contact Us 
        </h1>

        {/* Flex Container */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Contact Form Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600 font-serif"
                    style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email *"
                    className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600 font-serif"
                    style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600 font-serif"
                  style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                />
              </div>

              {/* Comment */}
              <div>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Comment"
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-400 bg-transparent outline-none text-gray-900 placeholder-gray-600 resize-none font-serif"
                  style={{ backgroundColor: "#dfdfd8", fontFamily: 'Times, "Times New Roman", serif' }}
                  required
                />
              </div>

              {/* Send Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded font-serif transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Times, "Times New Roman", serif' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>

          {/* WhatsApp Contact Section */}
          <div className="flex-1 lg:max-w-md">
            <div className="rounded-lg p-8 border border-gray-600 h-fit" style={{ backgroundColor: "#dfdfd8" }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                Quick Contact
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FaWhatsapp className="text-3xl text-green-600" />
                  </div>
                  <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <p className="text-gray-600 text-sm">WhatsApp</p>
                    <p className="text-gray-900 font-medium">+92 326 0230 367</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FaEnvelope className="text-2xl text-blue-600" />
                  </div>
                  <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900 font-medium">support@glowing-art.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-2xl text-red-600" />
                  </div>
                  <div className="font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="text-gray-900 font-medium">Faisalabad, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
             
                </div>
              </div>

              <button
                onClick={handleWhatsAppContact}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-serif transition-colors duration-200 flex items-center justify-center space-x-2"
                style={{ fontFamily: 'Times, "Times New Roman", s                npm install @emailjs/browsererif' }}
              >
                <FaComments />
                <span>Contact us on WhatsApp</span>
              </button>

              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  Get instant responses to your queries!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="text-center bg-white rounded-lg shadow-sm mb-8" style={{ backgroundColor: "#dfdfd8" }}>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Stay up to Date!
          </h2>
          <p className="text-gray-600 mb-8 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
            Get updates on new Releases and exciting Discounts!
          </p>
          {/* Mobile UI */}
          <div className="md:hidden max-w-sm mx-auto w-full px-3">
            <div className="rounded-md shadow-md border border-black/20 overflow-hidden">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-1.5 bg-white text-gray-800 placeholder-gray-500 outline-none"
                style={{ fontFamily: 'Times, "Times New Roman", serif', backgroundColor:'#ffffff' }}
              />
              <button className="w-full bg-gray-800 text-white py-1.5 hover:bg-gray-700 transition-colors duration-200 font-serif">
                →
              </button>
            </div>
          </div>
          {/* Desktop UI */}
          <div className="hidden md:flex max-w-md mx-auto border border-black overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-3 outline-none text-gray-700 font-serif bg-white"
              style={{ fontFamily: 'Times, "Times New Roman", serif', backgroundColor:'#ffffff' }}
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

export default Contact;