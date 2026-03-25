import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* HERO QUOTE */}
      <div className="bg-orange-500 text-white px-6 md:px-20 lg:px-32 xl:px-40 py-16">
        <p className="text-4xl font-bold mb-6">“</p>
        <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
          Our mission is to bring authentic Indian spices closer to every
          kitchen by creating a seamless supply chain between wholesalers,
          agents, and retailers. We believe quality and convenience should go
          hand in hand.
        </p>
      </div>

      {/* JOURNEY SECTION */}
      <div className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-16 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-10">
          Our Journey
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="font-semibold text-lg">2018</h3>
            <p className="text-sm text-gray-600">
              Started as a small wholesale spice distributor with a vision to
              simplify supply chains.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">2021</h3>
            <p className="text-sm text-gray-600">
              Expanded into digital ordering via agents, improving efficiency
              and reach across cities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">2024</h3>
            <p className="text-sm text-gray-600">
              Established a strong delivery network connecting retailers with
              high-quality spice products across regions.
            </p>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-16">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
          What’s Ahead
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10,000+", label: "Retail Partners" },
            { value: "2,000+", label: "Agents" },
            { value: "50,000+", label: "Orders Delivered" },
            { value: "100+", label: "Cities" },
          ].map((item, index) => (
            <div
              key={index}
              className="border border-orange-400 rounded-xl p-6">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SPLIT SECTION */}
      <div className="grid md:grid-cols-2">
        {/* LEFT TEXT */}
        <div className="bg-purple-700 text-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Built for Efficiency</h2>
          <p className="text-sm leading-6">
            Our platform ensures that agents can place orders seamlessly,
            businesses receive products on time, and delivery partners can
            operate efficiently. We eliminate traditional friction in the
            wholesale supply chain.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <img
          src="https://source.unsplash.com/800x600/?indian-spices"
          alt="spices"
          className="w-full h-full object-cover"
        />
      </div>

      {/* SECOND SPLIT */}
      <div className="grid md:grid-cols-2">
        {/* IMAGE */}
        <img
          src="https://source.unsplash.com/800x600/?indian-food"
          alt="food"
          className="w-full h-full object-cover"
        />

        {/* TEXT */}
        <div className="bg-orange-500 text-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Our Network</h2>
          <p className="text-sm leading-6">
            From sourcing premium spices to delivering them across cities,
            Bengol Spices Pvt. Ltd. connects every node in the ecosystem —
            ensuring consistency, quality, and trust at every step.
          </p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Get In Touch</h2>
          <h3 className="text-xl text-orange-500 mb-4">Head Office</h3>

          <p className="text-sm text-gray-700">
            Bengol Spices Pvt. Ltd. <br />
            Ground Floor, Tech Park <br />
            Kolkata, India
          </p>

          <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded-full text-sm">
            Get Location
          </button>
        </div>

        <img
          src="https://source.unsplash.com/600x600/?india-map"
          alt="map"
          className="rounded-full w-full max-w-sm mx-auto"
        />
      </div>
    </div>
  );
};

export default AboutUs;
