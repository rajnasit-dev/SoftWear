import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import {IoMdClose} from 'react-icons/io';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNavDrawer = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleCartDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4">
        {/** Left - Logo */}
        <div>
          <Link to="/" className="text-2xl font-bold tracking-wider" >
            SoftWear
          </Link>
        </div>

        {/** Center - Navigation links */}
        <div className="hidden md:flex gap-6">
          <Link
            to="#"
            className="text-gray-700 hover:text-black tet-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black tet-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black tet-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black tet-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>

        {/** Right - Icons */}
        <div className="flex items-center gap-6">
          {/** User icon */}
          <Link to="/login">
            <HiOutlineUser className="h-6 w-6 text-gray-700 hover:text-black" />
          </Link>
          {/** Cart icon */}
          <button
            onClick={toggleCartDrawer}
            className="relative cursor-pointer"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 hover:text-black" />
            <span className="absolute -top-2 bg-primaryRed text-white text-sx rounded-full px-2">
              5
            </span>
          </button>
          {/** Serach */}
          <SearchBar />
          {/** Menu icon */}
          <button onClick={toggleNavDrawer} className="md:hidden cursor-pointer">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700  hover:text-black" />
          </button>
        </div>
      </nav>

      <CartDrawer
        isDrawerOpen={isDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />

      {/* Mobile Navbar  */}
      <div
        className={`fixed top-0 left-0 w-[70%] h-full bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer} className=" pointer-cursor">
            <IoMdClose className="w-6 h-6 text-gray-600 hover:text-black" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 focus:text-black">Men</Link>
            <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 focus:text-black">Women</Link>
            <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 focus:text-black">Upper Wear</Link>
            <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 focus:text-black">Bottom Wear</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
