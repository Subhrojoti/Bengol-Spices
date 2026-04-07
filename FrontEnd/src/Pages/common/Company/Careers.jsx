import React from "react";
import { useNavigate } from "react-router-dom";

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <div className="bg-orange-500 text-white px-6 md:px-20 lg:px-32 xl:px-40 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Join Bengol Spices
        </h1>

        <p className="max-w-2xl text-sm md:text-base leading-relaxed">
          Be a part of a fast-growing supply chain ecosystem connecting
          importers, agents, retailers, and delivery partners. Whether you
          manage orders or deliver them — you are at the heart of our system.
        </p>
      </div>

      {/* ROLES SECTION */}
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-16">
        <h2 className="text-2xl font-semibold mb-10">Explore Opportunities</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* AGENT ROLE */}
          <div className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-3">Agent</h3>

            <p className="text-sm text-gray-600 mb-6 leading-6">
              As an Agent, you will be responsible for placing orders, managing
              retailer relationships, and ensuring smooth order flow within your
              assigned region.
            </p>

            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>• Manage retailer network</li>
              <li>• Place and track orders</li>
              <li>• Coordinate with delivery partners</li>
            </ul>

            <button
              onClick={() => navigate("/agent-onboarding")}
              className="bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm hover:opacity-90">
              Apply as Agent
            </button>
          </div>

          {/* DELIVERY PARTNER ROLE */}
          <div className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-3">Delivery Partner</h3>

            <p className="text-sm text-gray-600 mb-6 leading-6">
              As a Delivery Partner, you will ensure timely delivery of products
              to stores and handle returns efficiently while maintaining service
              quality.
            </p>

            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>• Pick up and deliver orders</li>
              <li>• Handle returns and exchanges</li>
              <li>• Ensure timely delivery</li>
            </ul>

            <button
              onClick={() => navigate("/delivery-partner-register")}
              className="bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm hover:opacity-90">
              Apply as Delivery Partner
            </button>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Grow with Bengol Spices</h2>

        <p className="text-sm text-gray-600 mb-6">
          Join our ecosystem and be part of a smarter, faster, and more reliable
          supply chain network.
        </p>
      </div>
    </div>
  );
};

export default Careers;
