import { useEffect, useRef, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

 const [newArrivals, setNewArrivals] = useState([]);

 useEffect(() => {
  const fetchNewArrivals = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
      );
      setNewArrivals(resp.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchNewArrivals();
 }, [])

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }

  const handleMouseMove = (e) => {
    if(!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }

  const handleMouseUpOrLeave = (e) => {
    setIsDragging(false)
  }

  // Scroll Function (button clicking)
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -500 : 500;
    scrollRef.current.scrollBy({ left: scrollAmount, behaviour: "smooth" });
  };

  // Update Scroll Buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable)
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="py-16 px-14 lg:px-0">
      <div className="container mx-auto max-w-screen-xl  text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa numquam
          mollitia repellat voluptate! At laboriosam quis.
        </p>

        {/* Scroll Buttons  */}
        <div className="absolute right-0 top-[-30px] flex space-x-2 z-50">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border ${
              canScrollLeft
                ? "bg-white text-black cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } hover:bg-gray-300 transition-colors`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border ${
              canScrollRight
                ? "bg-white text-black cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }   hover:bg-gray-300 transition-colors`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {newArrivals.map((product) => (
            <div
              key={product._id}
              className="min-w-full sm:min-w-1/2 lg:min-w-1/3 relative"
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0].altText || product.name}
                draggable="false"
                className="w-full h-[500px] object-cover rounded-lg"
              />
              <div className="absolute w-full bottom-0 left-0 bg-black/50 backdrop-blur-md text-white p-4 rounded-b-lg">
                <Link to={`/product/${product._id}`} className="block">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="mt-1">₹{product.price}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
