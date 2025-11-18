import React, { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1550703712-7c448196fea6?q=80&w=687&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1670623042512-1a5ecebc3f42?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614031679232-0dae776a72ee?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1674086631216-8aa6f3c6eaa1?q=80&w=688&auto=format&fit=crop",
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transition, setTransition] = useState(true);

  const extendedImages = [images[images.length - 1], ...images, images[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === extendedImages.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setCurrentIndex(1);
      }, 700);

      setTimeout(() => {
        setTransition(true);
      }, 750);
    }

    if (currentIndex === 0) {
      setTimeout(() => {
        setTransition(false);
        setCurrentIndex(images.length);
      }, 700);

      setTimeout(() => {
        setTransition(true);
      }, 750);
    }
  }, [currentIndex]);

  return (
    <div className="md:w-1/2 relative flex items-center justify-center p-6 bg-white">
      <div className="w-full h-80 md:h-[570px] relative rounded-3xl overflow-hidden shadow-lg border-3 border-zinc-700/90">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-700 ${
                idx + 1 === currentIndex
                  ? "bg-purple-400 w-24 h-1.5"
                  : "bg-gray-400 w-20 h-1.5"
              }`}
            ></div>
          ))}
        </div>

        <div
          className="flex w-full h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: transition ? "transform 0.7s ease-in-out" : "none",
          }}
        >
          {extendedImages.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <p className="font-semibold text-sm md:text-base max-w-[320px]">
            At Jacketze, we’re all about jackets that not only look great but
            are built to last. Stay comfortable in every season with styles that
            help you express your confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
