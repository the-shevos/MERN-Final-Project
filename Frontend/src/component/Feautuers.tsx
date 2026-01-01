"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faPaintBrush,
  faRobot,
  faSearch,
  faHeart,
  faUserCog,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(
  faStore,
  faPaintBrush,
  faRobot,
  faSearch,
  faHeart,
  faUserCog,
  faCircle
);

const features = [
  {
    title: "Online Clothing Store",
    text: "Browse and buy clothing like t-shirts, jeans, dresses, and jackets with prices, sizes, availability.",
    icon: faStore,
    delay: 300,
  },
  {
    title: "Product Customization",
    text: "Personalize t-shirts and denim with colors, logos, and interactive previews before ordering.",
    icon: faPaintBrush,
    delay: 400,
  },
  {
    title: "AI Virtual Try-On System",
    text: "Upload a picture to preview how outfits look using AI image generation tools.",
    icon: faRobot,
    delay: 500,
  },
  {
    title: "Smart Search",
    text: "Find products quickly using smart filters like 'red denim jacket under $20'.",
    icon: faSearch,
    delay: 300,
  },
  {
    title: "Wishlist and Cart",
    text: "Save favorites, add to cart, and checkout securely using Stripe or PayPal.",
    icon: faHeart,
    delay: 400,
  },
  {
    title: "User Profile Customization",
    text: "Manage profiles, designs, orders, and Wishlist safely with smart authentication.",
    icon: faUserCog,
    delay: 500,
  },
];

const DotGrid = ({
  rows = 5,
  cols = 9,
  top = "-130px",
  left = "-65px",
  color = "text-red-900",
}) => {
  const rowArray = Array.from({ length: rows });
  const colArray = Array.from({ length: cols });

  return (
    <div
      className={`absolute z-10 flex flex-col gap-y-1 opacity-40 ${color}`}
      style={{ top, left }}
    >
      {rowArray.map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-x-1">
          {colArray.map((_, colIndex) => (
            <FontAwesomeIcon
              key={colIndex}
              icon={faCircle}
              className="text-[7px]"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default function FeaturesSection() {
  return (
    <section className="px-4 py-15 -mt-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 relative">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-[#a572ed]">
          Latest Features
        </p>

        <h2
          className="max-w-lg mb-6 text-3xl font-bold leading-none tracking-tight sm:text-4xl md:mx-auto text-zinc-800 heading-shadow"
          data-aos="zoom-in"
        >
          How We Are Shaping The Future Of The Game
        </h2>

        <div className="relative">
          <div className="hidden lg:block">
            <DotGrid
              rows={5}
              cols={9}
              top="-130px"
              left="-65px"
              color="text-purple-700"
            />
          </div>

          <div className="hidden lg:block">
            <DotGrid
              rows={5}
              cols={9}
              top="-50px"
              left="720px"
              color="text-purple-700"
            />
          </div>
        </div>

        <p
          className="text-base text-gray-700 md:text-lg"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          Discover unique solutions crafted carefully to exceed expectations,
          ensuring every detail enhances your experience.
        </p>
      </div>

      <div className="relative grid max-w-screen-lg mx-auto space-y-6 lg:grid-cols-2 lg:space-y-0">
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-purple-300 transform -translate-x-1/2"></div>

        <div className="space-y-6 sm:px-16">
          {features.slice(0, 3).map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col max-w-md sm:flex-row"
              data-aos="zoom-in"
              data-aos-delay={feature.delay}
            >
              <div className="mb-4 mr-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-200">
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="text-[#a168f2] text-2xl"
                  />
                </div>
              </div>
              <div>
                <h6 className="mb-3 text-[20px] font-bold text-[#7f3ddb] feature-title leading-5">
                  {feature.title}
                </h6>
                <p className="feature-text text-sm text-gray-800">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6 sm:px-16">
          {features.slice(3).map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col max-w-md sm:flex-row"
              data-aos="zoom-in"
              data-aos-delay={feature.delay}
            >
              <div className="mb-4 mr-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-200">
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="text-[#a168f2] text-2xl"
                  />
                </div>
              </div>
              <div>
                <h6 className="mb-3 text-[20px] font-bold text-[#7f3ddb] feature-title leading-5">
                  {feature.title}
                </h6>
                <p className="feature-text text-sm text-gray-800">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .relative.grid.max-w-screen-lg.mx-auto {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 0.2rem;
    row-gap: 2rem;
    align-items: start;
  }

  .space-y-6.sm:px-16 {
    padding-left: 0;
    padding-right: 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .space-y-6.sm:px-16 > div {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 100%;
    padding: 1rem 1.1rem;
    border-radius: 12px;
    background: #faf7ff;
    box-shadow: 0 6px 14px rgba(126, 61, 219, 0.08);
  }

  .mb-4.mr-4 {
    margin-right: 1rem;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .w-12.h-12 {
    width: 42px;
    height: 42px;
  }

  .text-2xl {
    font-size: 1.4rem;
  }

  .space-y-6.sm\:px-16 > div > div:last-child {
    flex: 5;
    max-width: 100%;
  }

  .feature-title {
    font-size: 18px;
    line-height: 1.35;
    margin-bottom: 0.35rem;
  }

  .feature-text {
    font-size: 14px;
    line-height: 1.55;
    width: 200px;
    white-space: normal;
  }

  .hidden.lg:block.absolute {
    display: none !important;
  }

  .hidden.lg:block {
    display: none !important;
  }
}

@media screen and (max-width: 767px) {
  .max-w-xl.md\\:mx-auto.sm\\:text-center.lg\\:max-w-2xl.md\\:mb-12 {
    text-align: center !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .space-y-6.sm\\:px-16 > div {
    flex-direction: column !important;
    align-items: center;
    text-align: center;
  }

  .space-y-6.sm\\:px-16 > div .mb-4.mr-4 {
    margin-right: 0 !important;
    margin-bottom: 0.5rem !important;
  }

  .relative.grid.max-w-screen-lg.mx-auto.space-y-6.lg\\:grid-cols-2.lg\\:space-y-0 {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .hidden.lg\\:block.absolute.top-0.bottom-0.left-1\\/2.w-\\[1px\\].bg-purple-300.transform.-translate-x-1\\/2 {
    display: none !important;
  }

  .hidden.lg\\:block {
    display: none !important;
  }
}
`}</style>
    </section>
  );
}
