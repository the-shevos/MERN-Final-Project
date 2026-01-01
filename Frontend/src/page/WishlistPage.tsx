import React, { useEffect, useState } from "react";
import { X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
}

export default function WishlistPage() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("wishlist");
      setWishlist(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Your wishlist is empty 💔
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-tr from-purple-50 via-pink-50 to-yellow-50">
      <div
        className="inline-flex items-center gap-2 mt-4 ml-5 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer mb-8"
        onClick={() => navigate("/")}
      >
        <Home size={22} />
        <span>Home</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-10 -mt-24">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-2 heading-shadow">
            My Wishlist
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl">
            Review all your saved products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="relative w-full max-w-[270px] flex flex-col items-center p-5 rounded-3xl 
                         bg-white/70 backdrop-blur-lg border border-gray-300 shadow-md
                         hover:shadow-xl hover:scale-[1.05] transition-transform duration-300 group"
            >
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 right-3 bg-red-200/80 backdrop-blur-md p-1 rounded-full 
                           hover:bg-red-100 transition"
              >
                <X size={18} className="text-red-500" />
              </button>

              <div
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl overflow-hidden 
                              border border-purple-300 shadow-inner mb-4 group-hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              <p className="text-gray-900 font-bold text-base sm:text-lg text-center mb-1 line-clamp-2">
                {item.name}
              </p>

              <p className="text-gray-600 text-sm sm:text-base text-center ">
                {item.description}
              </p>

              <div className="w-full h-1 mt-4 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .heading-shadow {
          text-shadow: 2px 2px 6px rgba(72, 75, 200, 0.6);
        }

        ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
        }

        ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #a78bfa, #8b5cf6);
        border: 3px solid transparent;
        }

        ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #5b21b6, #4c1d95);
        }

        @media (min-width: 481px) and (max-width: 1023px) {
          .heading-shadow {
            font-size: 3rem !important;
            line-height: 3rem !important;
            margin-top: 10px !important;
          }

          .backdrop-blur-lg {
            padding: 1.5rem !important;
          }

          .grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.1rem !important;
          }

          img {
            width: 9rem !important;
            height: 9rem !important;
          }

          p {
            font-size: 0.875rem !important;
          }

          .max-w-[270px] {
            max-width: 260px !important;
          }

          button.absolute {
            top: 5px !important;
            right: 5px !important;
            padding: 0.3rem !important;
          }
        }

        @media (max-width: 480px) {
          .heading-shadow {
            font-size: 1.8rem !important;
            line-height: 2rem !important;
            margin-top: 20px !important;
          }

          .backdrop-blur-lg {
            padding: 1rem !important;
          }

          .grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }

          img {
            width: 7rem !important;
            height: 7rem !important;
          }

          p {
            font-size: 0.75rem !important;
          }

          .max-w-[270px] {
            max-width: 90% !important;
          }

          button.absolute {
            top: 5px !important;
            right: 10px !important;
            padding: 0.2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
