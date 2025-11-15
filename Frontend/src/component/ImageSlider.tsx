import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1550703712-7c448196fea6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1670623042512-1a5ecebc3f42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHxqYWNrZXR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1614031679232-0dae776a72ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1674086631216-8aa6f3c6eaa1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsSliding(false);
      }, 700);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="md:w-1/2 relative flex items-center justify-center p-6 bg-white">
      <div className="w-full h-80 md:h-[570px] relative rounded-3xl overflow-hidden shadow-lg border-3 border-zinc-700/90">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-700 ease-in-out ${
                idx === currentIndex
                  ? "bg-white w-24 h-1.5"
                  : "bg-gray-400 w-20 h-1.5"
              }`}
            ></div>
          ))}
        </div>
        {images.map((img, index) => {
          let position = "translate-x-full";
          if (index === currentIndex)
            position = isSliding ? "-translate-x-full" : "translate-x-0";
          if (index === (currentIndex + 1) % images.length)
            position = isSliding ? "translate-x-0" : "translate-x-full";
          return (
            <img
              key={index}
              src={img}
              alt={`slide-${index}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out ${position}`}
            />
          );
        })}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="font-semibold text-sm md:text-base max-w-[320px]">
            At Jacketze, we’re all about jackets stylish, durable, and made to
            keep you comfortable in every season. Find your perfect look and
            wear your confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
