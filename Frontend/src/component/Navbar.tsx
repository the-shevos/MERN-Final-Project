import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function FashionHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false;

  const handleWishlistClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("Please login to see your wishlist!", {
        style: {
          borderRadius: "10px",
          background: "#1a202c",
          color: "#fff",
          padding: "16px 24px",
          fontSize: "16px",
        },
        iconTheme: {
          primary: "#ef4444",
          secondary: "#fff",
        },
      });
      return;
    }
    navigate("/wishlist");
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <header className="relative flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <span className="text-2xl font-bold">Fashion</span>
        </div>

        {!isMenuOpen && (
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              to="/products"
              className="relative font-bold text-gray-700 transition-all duration-300 hover:text-purple-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              onClick={handleWishlistClick}
              className="relative font-bold text-gray-700 transition-all duration-300 hover:text-purple-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              My Wishlist
            </Link>
            <Link
              to="/aiChat"
              className="relative font-bold text-gray-700 transition-all duration-300 hover:text-purple-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              AI CHAT
            </Link>
            <Link
              to="/contact"
              className="relative font-bold text-gray-700 transition-all duration-300 hover:text-purple-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact Us
            </Link>
          </nav>
        )}

        {!isMenuOpen && (
          <div className="hidden lg:flex ml-auto">
            <button className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-purple-700 hover:shadow-lg transform hover:scale-105">
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform duration-300" />
            </button>
          </div>
        )}

        {!isMenuOpen && (
          <button
            className="lg:hidden ml-auto z-50"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        )}

        {isMenuOpen && (
          <div
            className="fixed inset-0 backdrop-blur-[5px] z-30"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r-2 border-purple-400 transform transition-transform duration-500 z-40 flex flex-col ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <span className="text-xl font-bold">Fashion</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col p-6 gap-4 overflow-y-auto">
            <Link
              to="/products"
              className="text-gray-800 font-medium hover:text-purple-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              className="text-gray-800 font-medium hover:text-purple-600 transition"
              onClick={(e) => {
                handleWishlistClick(e);
                setIsMenuOpen(false);
              }}
            >
              My Wishlist
            </Link>
            <Link
              to="/aiChat"
              className="text-gray-800 font-medium hover:text-purple-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              AI CHAT
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 font-medium hover:text-purple-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>

            <button className="mt-2 bg-purple-600 text-white w-full px-6 py-2 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-purple-700 hover:shadow-lg transform hover:scale-105">
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform duration-300" />
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
