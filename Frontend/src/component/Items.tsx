import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  description: string;
  images?: string[];
}

export default function OurProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [indexes, setIndexes] = useState([0, 1, 2]);
  const [focusedCard, setFocusedCard] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "http://localhost:3000/api/v1/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setIndexes((prev) => prev.map((i) => (i + 1) % products.length));
      setFocusedCard((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <section className="relative bg-white py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 35 }).map((_, i) => {
          const top = Math.floor(Math.random() * 90) + "%";
          const left = Math.floor(Math.random() * 90) + "%";
          const x = Math.floor(Math.random() * 50 - 25) + "px";
          const y = Math.floor(Math.random() * 50 - 25) + "px";
          const duration = Math.floor(Math.random() * 5 + 4) + "s";
          const delay = Math.floor(Math.random() * 2) + "s";

          return (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-purple-300 animate-[floatDots_linear_infinite]"
              style={
                {
                  top,
                  left,
                  "--x": x,
                  "--y": y,
                  animationDuration: duration,
                  animationDelay: delay,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>

      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-purple-600 font-semibold tracking-widest uppercase text-xs mb-3 block">
            Our Collection
          </span>
          <h2 className="text-4xl md:text-4xl heading-shadow mb-2 font-sans font-bold text-gray-800 max-w-[90%] md:max-w-[450px] mx-auto">
            Explore Our Shop Items
          </h2>
          <p className="text-sm md:text-base lg:text-lg max-w-[90%] md:max-w-[650px] mx-auto text-gray-700">
            Discover our exclusive range of products thoughtfully crafted with
            quality materials, elegant design, and innovative technology.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[0, 1, 2].map((cardIdx) => {
            const product = products[indexes[cardIdx]];
            if (!product) return null;
            const isFocused = focusedCard === cardIdx;

            return (
              <motion.div
                key={product._id + cardIdx}
                layout
                className={`group bg-white rounded-2xl border border-gray-300/80 overflow-hidden flex flex-col items-center`}
                animate={{
                  scale: isFocused ? 1.1 : 0.95,
                  boxShadow: isFocused
                    ? "0px 25px 50px rgba(0,0,0,0.25)"
                    : "0px 10px 20px rgba(0,0,0,0.1)",
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={product._id}
                    className="flex items-center justify-center bg-gray-100 mt-4 rounded-xl"
                    style={{ width: "200px", height: "200px" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="object-contain max-h-full max-w-full transition-transform duration-700"
                    />
                  </motion.div>

                  <motion.div
                    key={product._id + "-text"}
                    className="p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <h3 className="text-2xl font-bold text-purple-600">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-gray-500 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    <button className="mt-6 px-7 py-2.5 rounded-full bg-purple-600 text-white text-sm font-semibold transition-all duration-300 hover:bg-purple-900 hover:scale-105">
                      View More
                    </button>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes floatDots {
          0% { transform: translate(0,0); opacity: 0.4; }
          50% { transform: translate(var(--x), var(--y)); opacity: 1; }
          100% { transform: translate(0,0); opacity: 0.4; }
        }
        .animate-[floatDots_linear_infinite] {
          animation: floatDots linear infinite;
        }
      `}</style>
    </section>
  );
}
