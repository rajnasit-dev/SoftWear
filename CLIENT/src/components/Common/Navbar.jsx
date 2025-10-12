import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((acc, product) => acc + product.quantity, 0) || 0;

  const toggleNavDrawer = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleCartDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="w-full flex items-center justify-center bg-gray-100">
        {/* Parent container with max-width and padding */}
        <div className="container mx-auto px-10 py-2">
          <div className="flex items-center justify-between">
            {/** Left - Logo */}
            <div>
              <Link to="/" className="text-2xl font-bold tracking-wider">
                SoftWear
              </Link>
            </div>

            {/** Center - Navigation links */}
            <div className="hidden md:flex gap-6">
              <Link
                to="/collections/all?gender=Men"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase"
              >
                Men
              </Link>
              <Link
                to="/collections/all?gender=Women"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase"
              >
                Women
              </Link>
              <Link
                to="/collections/all?category=Top Wear"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase"
              >
                Top Wear
              </Link>
              <Link
                to="/collections/all?category=Bottom Wear"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase"
              >
                Bottom Wear
              </Link>
            </div>

            {/** Right - Icons */}
            <div className="flex items-center gap-6">
              {/* Adminn Button */}
              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className="block bg-black px-4 py-1 rounded text-white hover:bg-gray-800 transition-colors"
                >
                  Admin
                </Link>
              )}

              {/** User icon */}
              <Link to={user?.userId ? "/profile" : "/login"}>
                <HiOutlineUser className="h-6 w-6 text-gray-700 hover:text-black" />
              </Link>
              {/** Cart icon */}
              <button
                onClick={toggleCartDrawer}
                className="relative cursor-pointer"
              >
                <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 hover:text-black" />
                {cartItemCount > 0 && (
                  <div className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-primaryRed text-white text-xs rounded-full">
                    {cartItemCount}
                  </div>
                )}
              </button>

              {/** Serach */}
              <SearchBar />
              {/** Menu icon */}
              <button
                onClick={toggleNavDrawer}
                className="md:hidden cursor-pointer"
              >
                <HiBars3BottomRight className="h-6 w-6 text-gray-700  hover:text-black" />
              </button>
            </div>
          </div>
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
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-600 focus:text-black"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-600 focus:text-black"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 focus:text-black"
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 focus:text-black"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
