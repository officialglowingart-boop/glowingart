import React, { useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

const CommonQuestions = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "What is your processing time?",
      answer: "Our standard processing time is 3-5 business days for most orders. Custom orders may take 7-10 business days. Rush processing is available for an additional fee."
    },
    {
      question: "Do you ship Worldwide?",
      answer: "Yes, we offer worldwide shipping to most countries. Shipping times vary by location: 5-7 days for domestic orders, 10-15 days for international orders. Some restrictions may apply to certain regions."
    },
    {
      question: "Where is your company based?",
      answer: "Our company is based in Pakistan, with our main operations center located in Karachi. We also have fulfillment centers in major cities to ensure faster delivery times."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and cash on delivery for local orders. All payments are processed securely through our encrypted payment gateway."
    },
    {
      question: "Can I return or exchange my order?",
      answer: "Yes, we offer a 30-day return policy for unused items in original packaging. Custom orders are non-returnable unless there's a manufacturing defect. Please contact our support team to initiate a return."
    }
  ];

  return (
    <div className="min-h-screen font-serif" style={{ backgroundColor: "#dfdfd8" }}>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="sm:text-5xl text-3xl font-bold text-center text-gray-900 mb-12 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
          Common Questions
        </h1>

        {/* FAQ Section */}
        <div className="space-y-0 mb-16">
          {faqData.map((faq, index) => (
            <div key={index} className="border-t border-gray-400 overflow-hidden" style={{ backgroundColor: "#dfdfd8" }}>
              <div
                className="flex items-center justify-between py-6 px-4 cursor-pointer transition-colors duration-200"
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6   rounded flex items-center justify-center">
                    <FiCheckSquare className="text-xl" />
                  </div>
                  <span className="text-xl font-medium text-gray-900 font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`transform transition-transform duration-200 text-gray-600 ${
                    activeQuestion === index ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              
              {activeQuestion === index && (
                <div className="px-4 pb-6 ml-10 text-gray-700 leading-relaxed font-serif" style={{ fontFamily: 'Times, "Times New Roman", serif' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
  <div className="text-center bg-white rounded-lg sm:p-8 shadow-sm" style={{ backgroundColor: "#dfdfd8" }}>
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
                style={{ fontFamily: 'Times, \"Times New Roman\", serif', backgroundColor: "#ffffff" }}
              />
              <button className="w-full bg-gray-800 text-white py-1.5 hover:bg-gray-700 transition-colors duration-200 font-serif">
                →
              </button>
            </div>
          </div>
          {/* Desktop UI */}
      <div className="hidden md:flex max-w-md mx-auto border border-gray-600 overflow-hidden">
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

export default CommonQuestions;