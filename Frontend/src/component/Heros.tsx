import React from "react";
import { Sparkles, ShoppingBag } from "lucide-react";
import FashionHeader from "./Navbar";

export default function FashionHomepage() {
  return (
    <div className="min-h-screen bg-white">
      <FashionHeader />

      <div className="mx-4 md:mx-9 mt-4 md:mt-2 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 md:px-16 py-10 sm:py-12 md:py-14 text-center lg:text-left">
          <div className="flex-1 mb-6 lg:mb-0 lg:translate-x-6">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 bg-purple-600/20 text-purple-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              LIVE FOR FASHION
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Elevate Your Fashion Up Look
            </h1>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 max-w-md mx-auto lg:mx-0">
              Influential, innovative and progressive, Versace is reinventing a
              wholly modern approach to fashion to help you look unique.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="flex items-center gap-2 bg-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-purple-700 transition-all shadow-lg">
                <ShoppingBag size={18} />
                Shop Now
              </button>

              <button className="flex items-center gap-2 text-white hover:text-gray-300">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <span className="underline">What's Trending?</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end mt-6 lg:mt-0 lg:translate-x-1">
            <img
              src="https://turboracegear.com/cdn/shop/files/Custom_Leather_Jackets_for_Men_and_Women.jpg?v=1746637751&width=1500"
              alt="Fashion Model"
              className="h-[300px] sm:h-[350px] md:h-[420px] w-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10 px-4 md:px-8 py-12">
        <img
          src="https://logo.clearbit.com/nike.com"
          alt="Nike"
          className="h-8 sm:h-10 opacity-80 hover:opacity-100 transition"
        />
        <img
          src="https://logo.clearbit.com/adidas.com"
          alt="Adidas"
          className="h-8 sm:h-10 opacity-80 hover:opacity-100 transition"
        />
        <img
          src="https://logo.clearbit.com/puma.com"
          alt="Puma"
          className="h-8 sm:h-10 opacity-80 hover:opacity-100 transition"
        />
        <img
          src="https://logo.clearbit.com/gucci.com"
          alt="Gucci"
          className="h-8 sm:h-10 opacity-80 hover:opacity-100 transition"
        />
        <img
          src="https://logo.clearbit.com/louisvuitton.com"
          alt="Louis Vuitton"
          className="h-8 sm:h-10 opacity-80 hover:opacity-100 transition"
        />
        <img
          src="https://logo.clearbit.com/chanel.com"
          alt="Chanel"
          className="h-8 sm:h-10 opacity-80 hover:opacity-100 transition"
        />
        <img
          src="https://logo.clearbit.com/versace.com"
          alt="Versace"
          className="h-8 sm:h-10 opacity-80 hover:opacity-100 transition"
        />
      </div>
    </div>
  );
}
