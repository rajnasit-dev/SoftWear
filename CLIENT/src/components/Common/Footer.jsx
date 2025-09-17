import React from "react";
import { Link } from "react-router-dom";
import { TbBrandMeta, TbFilePhone } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[30%_1fr_1fr_1fr] gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-lg text-gray-800 mb-4 font-semibold">
            Newsletter
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off on first order.
          </p>

          {/* Newsletter form  */}
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-400 rounded outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop Links  */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4 font-semibold">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links  */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4 font-semibold">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-black transition-colors">
                Featues
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us Links  */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4 font-semibold">
            Follow Us
          </h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <TbBrandMeta className="h-6 w-6" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <IoLogoInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>
          <p className="text-black font-semibold mb-4">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-3" />
            +91 8452688521
          </p>
        </div>
      </div>

      {/* Footer Bottom  */}
        <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-400 pt-6">
            <p className="text-sm text-gray-500 tracking-tighter text-center">© 2025, UrbanWeave. All Rights Reserved.</p>
        </div>

    </footer>
  );
};

export default Footer;
