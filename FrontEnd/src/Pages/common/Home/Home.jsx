import React from "react";

const Home = () => {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <div className="relative h-[80vh] flex items-center px-6 md:px-20 lg:px-32 xl:px-40">
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />

        <div className="relative text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What’s the Bengol Spices story?
          </h1>

          <p className="text-sm md:text-base leading-relaxed mb-6">
            Bengol Spices Pvt. Ltd. is transforming the spice supply chain by
            connecting importers, wholesalers, agents, and retailers through a
            seamless digital ecosystem. From sourcing globally to delivering
            locally — we ensure quality, speed, and reliability.
          </p>

          <button className="bg-orange-600 px-6 py-3 rounded-full text-sm font-medium hover:opacity-90">
            Our Journey
          </button>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="bg-orange-500 text-white px-6 md:px-20 lg:px-32 xl:px-40 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">
          Import. Distribute. Deliver. Scale.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "IMPORT & EXPORT",
              desc: "Global sourcing of premium spices with trusted suppliers.",
            },
            {
              title: "STORE MANAGEMENT",
              desc: "Retail & wholesale store creation and management.",
            },
            {
              title: "ORDER & DELIVERY",
              desc: "Agents manage orders, delivery partners handle logistics.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white text-black rounded-2xl p-6 text-left">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-16">
        <h2 className="text-2xl font-semibold mb-10">Our Product Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          {[
            "Turmeric",
            "Chilli",
            "Cumin",
            "Coriander",
            "Garam Masala",
            "Pepper",
            "Cardamom",
            "Cloves",
            "Mustard",
            "Fenugreek",
            "Spice Mix",
            "Organic",
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <img
                src={`https://source.unsplash.com/100x100/?spices,${item}`}
                alt={item}
                className="w-20 h-20 object-cover rounded-full mb-2"
              />
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE */}
      <div className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-16">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Our Digital Ecosystem
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          {[
            {
              title: "Admin App",
              desc: "Controls operations, analytics & system management.",
            },
            {
              title: "Employee App",
              desc: "Handles internal workflows and store management.",
            },
            {
              title: "Agent App",
              desc: "Places orders and manages retailer relationships.",
            },
            {
              title: "Delivery App",
              desc: "Handles logistics, delivery & returns efficiently.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-orange-600 text-white px-6 md:px-20 lg:px-32 xl:px-40 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Powering the future of spice distribution
        </h2>
        <p className="text-sm mb-6">
          Join Bengol Spices in building a smarter, faster, and more reliable
          supply chain ecosystem.
        </p>

        <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-medium">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
