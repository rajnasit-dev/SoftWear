import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import {useDispatch} from 'react-redux'
import { setFilters, fetchProductsByFilters } from "../../redux/slices/productsSlice";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) =>{
    e.preventDefault();
    dispatch(setFilters({search: searchTerm}));
    dispatch(fetchProductsByFilters({search: searchTerm}));
    navigate(`/collections/all/?search=${searchTerm}`)
    setIsOpen(false);
  }

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      } `}
    >
      {isOpen ? (
        <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full ">
          <div className="relative w-[70%] md:w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 w-full rounded-lg focus:outline-none placeholder:text-gray-700"
            />
            {/** Search icon */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              <HiMagnifyingGlass className="h-6 w-6  text-gray-700 hover:text-black" />
            </button>
          </div>

          {/** close btn */}
          <button
            onClick={handleSearchToggle}
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <HiMiniXMark className="h-8 w-8 text-gray-600 hover:text-gray-800" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle} className="cursor-pointer">
          <HiMagnifyingGlass className="h-6 w-6  text-gray-700 hover:text-black" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
