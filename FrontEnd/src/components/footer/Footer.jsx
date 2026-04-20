import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/Logo_Final.png";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 px-6 md:px-20 lg:px-32 xl:px-40 py-12">
      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row w-full justify-center">
        {/* LEFT */}
        <div className="md:w-1/4 flex items-start">
          <div className="-mt-5">
            <div
              className=" cursor-pointer flex items-center justify-center"
              onClick={() => navigate("/")}>
              <img
                src={logo}
                alt="Bengol Spices"
                className="h-24 object-contain"
              />
            </div>
            <p className="text-sm mt-2 text-gray-500">© 2025 Bengol Spices</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* COLUMN 1 - COMPANY */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Company</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="about" className="hover:text-black cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="careers" className="hover:text-black cursor-pointer">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2 - CONTACT */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Contact Us</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="help" className="hover:text-black cursor-pointer">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 - LEGAL */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="terms" className="hover:text-black cursor-pointer">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="privacy" className="hover:text-black cursor-pointer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="cookies" className="hover:text-black cursor-pointer">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 - AVAILABLE */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Available in</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>West Bengal</li>
              <li>Delhi</li>
              <li>Uttar Pradesh</li>
              <li>Bihar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      {/* <div className="border-t border-gray-300 my-10"></div> */}

      {/* BOTTOM SECTION */}
      {/* <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <p className="text-xl text-center md:text-left">
          Experience mobile version for easy access, download now
        </p>

        <a
          href="#"
          className="bg-black text-white px-5 py-2.5 rounded-md text-sm hover:opacity-90 transition">
          Get it on Play Store
        </a>
      </div> */}
    </footer>
  );
};

export default Footer;
