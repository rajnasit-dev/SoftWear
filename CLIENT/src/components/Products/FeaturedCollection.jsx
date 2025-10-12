import React from "react";
import { Link } from "react-router-dom";
import featured from '../../assets/featured.webp'

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto max-w-screen-xl flex flex-col-reverse lg:flex-row items-center bg-green-100 rounded-3xl">
        {/* Left Content  */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Comfort and Style
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Apparel made for everyday life
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consequatur repudiandae praesentium aspernatur sint voluptate
            explicabo.
          </p>
          <Link
            to="/collections/all"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg hocer:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Content  */}
        <div className="lg:w-1/2">
            <img src={featured} alt="Featured Collection" className="w-full h-full object-cover lg:rounded" />
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollection;
