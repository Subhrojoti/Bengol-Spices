import React from "react";
import Slide7 from "../../../assets/Slides/Slide7.png";
import Slide8 from "../../../assets/Slides/Slide8.png";
import logo from "../../../assets/logo/BS_Logo_New.png";
import logoBG from "../../../assets/logo/BS_Logo_BG.png";
import fssaiLogo from "../../../assets/logo/FSSAI_Logo.png";

const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* HERO QUOTE */}
      <div className="relative px-6 md:px-20 lg:px-32 xl:px-40 py-20 flex flex-col items-center text-center overflow-hidden">
        {/* Background Image */}
        <img
          src={logoBG}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover  pointer-events-none"
        />

        {/* Optional overlay (for better readability) */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <img
            src={logo}
            alt="Bengol Spices"
            className="h-40 md:h-56 lg:h-72 mb-8 object-contain"
          />

          {/* Text */}
          <p className="text-xl md:text-2xl lg:text-3xl font-light max-w-5xl leading-relaxed tracking-wide text-white">
            Our mission is to bring authentic Indian spices closer to every
            kitchen by creating a seamless supply chain between wholesalers,
            agents, and retailers. We believe quality and convenience should go
            hand in hand.
          </p>
        </div>
      </div>
      {/* ABOUT - WHAT WE STAND FOR */}
      <div className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12">
          What We Stand For
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-lg font-medium mb-3">Authenticity</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              We ensure every spice reflects true Indian origin, preserving
              taste, aroma, and quality at every step.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Reliability</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              From sourcing to delivery, we maintain a consistent and dependable
              supply chain for our partners.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Efficiency</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Our streamlined system connects wholesalers, agents, and retailers
              seamlessly, reducing delays and complexity.
            </p>
          </div>
        </div>
      </div>

      {/* SPLIT SECTION */}
      <div className="grid md:grid-cols-2">
        {/* LEFT TEXT */}
        <div className="bg-green-500 text-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Built for Efficiency</h2>
          <p className="text-sm leading-6">
            Our platform ensures that agents can place orders seamlessly,
            businesses receive products on time, and delivery partners can
            operate efficiently. We eliminate traditional friction in the
            wholesale supply chain.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <img src={Slide7} alt="spices" className="w-full h-full object-cover" />
      </div>

      {/* SECOND SPLIT */}
      <div className="grid md:grid-cols-2">
        {/* IMAGE */}
        <img src={Slide8} alt="food" className="w-full h-full object-cover" />

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

      {/* TEAM SECTION */}
      <div className="px-6 md:px-20 lg:px-32 xl:px-40 py-16 bg-white">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          Our Team & Partners
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Supriyo Nag",
              role: "Promoter & Director",
              img: "/team/supriyo.png",
            },
            {
              name: "Ranjit Yadav",
              role: "Promoter & Director",
              img: "/team/ranjit.png",
            },
            {
              name: "Raja Santanu Shaw",
              role: "Promoter & Director",
              img: "/team/raja.png",
            },
            {
              name: "Shivan Kumar Das",
              role: "Sales & Marketing",
              img: "/team/shivan.png",
            },
            {
              name: "Jalil Gazi",
              role: "Operations / Coordinator",
              img: "/team/jalil.png",
            },
            {
              name: "Pankaj Kumar Sah",
              role: "Sales & Marketing",
              img: "/team/pankaj.png",
            },
            {
              name: "Ravi Chitra Rasu",
              role: "Production",
              img: "/team/ravi.png",
            },
            {
              name: "Sreshtanghu Ray",
              role: "Production",
              img: "/team/sreshtanghu.png",
            },
            {
              name: "Ayush Kumar Pandey",
              role: "CRM",
              img: "/team/ayush.png",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition p-4 text-center">
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-900"
              />

              <h3 className="mt-4 font-semibold text-gray-800">
                {member.name}
              </h3>

              <p className="text-sm text-orange-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="bg-gray-100 px-6 md:px-20 lg:px-32 xl:px-40 py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl font-semibold mb-4">Get In Touch</h2>
          <h3 className="text-xl text-orange-500 mb-4">Head Office</h3>

          <p className="text-sm text-gray-700 leading-relaxed">
            BENGOL SPICES PRIVATE LIMITED <br />
            23/23, Kalipur Kancha Road, Marich Jhapi, Paschim Putiary, <br />
            Kolkata - 700082, West Bengal
          </p>

          {/* FSSAI BLOCK */}
          <div className="mt-5 flex items-center gap-3">
            <img
              src={fssaiLogo}
              alt="FSSAI License"
              className="h-20 w-auto object-contain"
            />
            <div className="text-sm leading-tight mt-4">
              <p className="font-medium text-gray-800">FSSAI Licensed</p>
              <p className="text-gray-500">License No: 12825019002131</p>
            </div>
          </div>

          {/* Button with real map link */}
          <a
            href="https://www.google.com/maps/place/23%2F23,+Kalipur+Kancha+Rd,+Marich+Jhapi,+Paschim+Putiary,+Kolkata,+West+Bengal+700082/@22.4776054,88.3324406,20.38z"
            target="_blank"
            rel="noopener noreferrer">
            <button className="mt-6 bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded-full text-sm">
              Get Location
            </button>
          </a>
        </div>

        {/* RIGHT MAP (REAL EMBED) */}
        <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow-md">
          <iframe
            title="Google Map Location"
            src="https://www.google.com/maps?q=22.4776054,88.3324406&z=17&output=embed"
            className="w-full h-full border-0"
            loading="lazy"></iframe>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
