import React, { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { getFaqs } from "../../../api/services";

const HelpAndSupport = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("GENERAL");
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await getFaqs();
        if (res?.success) {
          const data = res.data || [];

          // Save all FAQs
          setFaqs(data);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(data.map((item) => item.category)),
          ];

          setCategories(uniqueCategories);

          // Default category
          if (uniqueCategories.length) {
            setActiveCategory(uniqueCategories[0]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFaqs();
  }, []);

  // Filter FAQs by category
  const filteredFaqs = faqs.filter(
    (item) => item.category === activeCategory && item.isActive,
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-10 flex gap-10">
        {/* LEFT SIDEBAR */}
        <div className="w-1/4 hidden md:block">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveIndex(null);
                }}
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
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, index) => {
                const isOpen = activeIndex === index;

                return (
                  <div key={item._id}>
                    {/* QUESTION */}
                    <div
                      onClick={() => toggle(index)}
                      className={`flex justify-between items-center px-6 py-5 cursor-pointer ${
                        isOpen ? "text-orange-600" : "text-gray-600"
                      }`}>
                      <span className="text-md font-bold">{item.question}</span>

                      <span
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}>
                        ▼
                      </span>
                    </div>

                    {/* ANSWER */}
                    {isOpen && (
                      <div className="px-6 pb-5 text-sm text-gray-600 leading-6 font-normal">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-5 text-sm text-gray-500">
                No FAQs available.
              </div>
            )}
          </div>

          {/* SUPPORT CONTACT */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Need more help?</h3>
            <p className="text-sm text-gray-600">
              If your query is not resolved, feel free to contact our support
              team.
            </p>

            <div className="mt-4 space-y-2 text-sm">
              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-orange-600" />
                <a
                  href="mailto:support@bengolspices.com"
                  className="text-orange-600 font-medium hover:underline">
                  support@bengolspices.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-orange-600" />
                <a
                  href="tel:+916289531457"
                  className="text-orange-600 font-medium hover:underline">
                  +916289531457
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
