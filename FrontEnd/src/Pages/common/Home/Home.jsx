import React from "react";
import { Typography } from "@mui/material";
import coriander from "../../../assets/products/BS_Coriander_Powder.jpeg";
import cumin from "../../../assets/products/BS_Cumin_Powder.jpeg";
import garamMasala from "../../../assets/products/BS_Garam_Masala.jpeg";
import redChilli from "../../../assets/products/BS_Red_Chilli_Powder.jpeg";
import turmeric from "../../../assets/products/BS_Turmeric_Powder.jpeg";

const Home = () => {
  const products = [
    { name: "Coriander Powder", image: coriander },
    { name: "Cumin Powder", image: cumin },
    { name: "Garam Masala", image: garamMasala },
    { name: "Red Chilli Powder", image: redChilli },
    { name: "Turmeric Powder", image: turmeric },
  ];

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

      {/* PRODUCT GRID */}
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-20">
        {/* Section Title */}
        <Typography
          variant="h5"
          className="!font-semibold !mb-12 !tracking-wide text-gray-900">
          Our Products
        </Typography>

        <div className="flex gap-8 scrollbar-hide py-4">
          {products.map((item, i) => (
            <div
              key={i}
              className="
          min-w-[200px] flex-shrink-0 text-center
          bg-white/40 backdrop-blur-lg
          rounded-2xl p-4
          border border-white/20
          shadow-[0_10px_30px_rgba(0,0,0,0.15)]
          hover:shadow-[0_18px_45px_rgba(0,0,0,0.25)]
          transition-all duration-300
          hover:-translate-y-1
        ">
              {/* Image Container (Bevel Effect) */}
              <div
                className="
            relative rounded-xl overflow-hidden
            before:absolute before:inset-0
            before:bg-gradient-to-br 
            before:from-white/40 before:via-transparent before:to-black/25
            before:pointer-events-none
          ">
                <img
                  src={item.image}
                  alt={item.name}
                  className="
              w-full h-[240px] object-cover
              rounded-xl
              shadow-inner
              border border-gray-200
            "
                />
              </div>

              {/* Product Name */}
              <Typography
                variant="body2"
                className="
    !mt-4
    !font-semibold
    uppercase
    tracking-[0.02em]
    text-gray-800
  ">
                {item.name}
              </Typography>
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
