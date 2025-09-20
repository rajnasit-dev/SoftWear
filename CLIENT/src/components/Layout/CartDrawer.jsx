import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from 'react-router-dom'

const CartDrawer = ({ isDrawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout");
    toggleCartDrawer();
  }

  return (
    <div
      className={`fixed top-0 right-0 w-[70%] md:w-2/4 lg:w-1/4 h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col z-50 ${
        isDrawerOpen ? "translate-x-0" : "translate-x-full" //moves the drawer to right full = 100%
      }`}
    >
      {/* Close Button  */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer} className="cursor-pointer">
          <IoMdClose className="h-6 w-6 text-gray-600 hover:text-black" />
        </button>
      </div>
      {/* Cart contents with scrollable area  */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {/* Component for Cart Contents  */}
        <CartContents />
      </div>

      {/* Checkout button fixed at the bottom  */}
      <div className="p-4 bg-white sticky bottom-0">
        <button
          onClick={handleCheckout}
          className=" w-full font-semibold bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition"
        >
          Checkout
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Shipping, taxes, and discount codes calculated at checkout.
        </p>
      </div>
    </div>
  );
};

export default CartDrawer;
