import React, { useState } from "react";

const categories = ["Partner Onboarding", "Legal", "FAQs", "Agent Onboarding"];

const faqsData = [
  {
    question: "I want to partner my store with Bengol Spices",
    answer:
      "You can partner with Bengol Spices by registering through our platform. Our team will guide you through onboarding, verification, and activation.",
  },
  {
    question: "What are the mandatory documents required for onboarding?",
    answer:
      "You will need business registration details, GST information, identity proof, and bank account details for onboarding.",
  },
  {
    question: "How can I opt-out from the platform?",
    answer:
      "You can raise a support request through the dashboard or contact our support team for account deactivation.",
  },
  {
    question: "How long does it take to activate my account after submission?",
    answer:
      "Activation usually takes 2–5 business days depending on verification and documentation completeness.",
  },
  {
    question: "Are there any onboarding fees?",
    answer:
      "Onboarding fees may vary based on business type and region. Please check with our support team for details.",
  },
];

const HelpAndSupport = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-10 flex gap-10">
        {/* LEFT SIDEBAR */}
        <div className="w-1/4 hidden md:block">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition ${
                  activeCategory === cat
                    ? "bg-gray-100 text-black"
                    : "text-gray-500 hover:bg-gray-50"
                }`}>
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-semibold mb-6">{activeCategory}</h2>

          <div className="bg-white rounded-xl shadow-sm divide-y">
            {faqsData.map((item, index) => {
              const isOpen = activeIndex === index;

              return (
                <div key={index}>
                  {/* QUESTION */}
                  <div
                    onClick={() => toggle(index)}
                    className={`flex justify-between items-center px-6 py-5 cursor-pointer text-sm ${
                      isOpen ? "text-orange-600" : "text-gray-800"
                    }`}>
                    <span>{item.question}</span>

                    <span
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}>
                      ▼
                    </span>
                  </div>

                  {/* ANSWER */}
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-gray-600 leading-6">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
