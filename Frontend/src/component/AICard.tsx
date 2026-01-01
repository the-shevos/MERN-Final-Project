"use client";

import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/Artificial intelligence digital technology.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBolt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AIVirtualTryOnSection() {
  const lottieContainer = useRef(null);
  const outerDotsContainer = useRef(null);
  const innerDotsContainer = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);

  useEffect(() => {
    let anim = null;

    if (lottieContainer.current) {
      anim = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    }

    const numInnerDots = 20;
    for (let i = 0; i < numInnerDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("inner-dot");
      dot.style.top = Math.random() * 100 + "%";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.animationDuration = 15 + Math.random() * 20 + "s";
      if (innerDotsContainer.current)
        (innerDotsContainer.current as HTMLElement).appendChild(dot);
    }

    const numOuterDots = 25;
    for (let i = 0; i < numOuterDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("outer-dot");
      dot.style.background = "#70117a";
      dot.style.top = Math.random() * 100 + "%";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.animationDuration = 20 + Math.random() * 20 + "s";
      if (outerDotsContainer.current)
        (outerDotsContainer.current as HTMLElement).appendChild(dot);
    }

    return () => {
      if (anim) anim.destroy();
    };
  }, []);

  return (
    <section className="relative w-full py-20 bg-[#e7dce8] overflow-hidden">
      <div
        ref={outerDotsContainer}
        className="absolute inset-0 z-0 overflow-hidden"
      ></div>

      <div
        className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12"
        data-aos="zoom-in"
      >
        <div className="relative bg-gradient-to-r from-[#230e42] to-[#3d1975] rounded-3xl p-10 md:p-16 flex flex-col lg:flex-row items-center gap-12 border border-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10 w-full max-w-6xl mx-auto">
          <div
            ref={innerDotsContainer}
            className="absolute inset-0 z-0 w-full h-full"
          ></div>

          <div className="max-w-xl space-y-6 text-white z-10 relative">
            <span className="badge inline-flex items-center bg-[#8bbfd9] text-black/80 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-md">
              <FontAwesomeIcon icon={faBolt} className="mr-2" />
              New Launch
            </span>

            <h1 className="title-heading text-5xl md:text-6xl font-exo font-extrabold leading-tight">
              AI Virtual{" "}
              <span className="gradient-text inline-block -mt-1 tracking-[2px]">
                Try On System
              </span>
            </h1>

            <p className="text-purple-200 text-lg leading-relaxed">
              Upload your photo and see how clothes look on you instantly.
              Powered by advanced AI for realistic previews.
            </p>

            <Link
              to="/aiChat"
              className="cta-button inline-flex bg-gradient-to-b from-purple-500 to-indigo-700 text-white px-10 py-3 rounded-full text-lg shadow-xl mt-3 items-center gap-2 font-bold group transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_25px_rgba(0,0,0,0.3)] w-max"
            >
              Try It Now
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 font-bold text-lg transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          </div>

          <div className="mt-12 lg:mt-0 relative z-10 w-full max-w-xs">
            <div
              ref={lottieContainer}
              className="w-96 mx-auto"
              style={{ height: "21rem" }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        .inner-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(200, 185, 150, 0.7);
          pointer-events: none;
          animation: floatInnerDots linear infinite;
        }

        .outer-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0.7;
          pointer-events: none;
          animation: floatOuterDots linear infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1fc2fb 0%, #f327ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cta-button {
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
        }

        .title-heading {
          font-family: "Exo 2", sans-serif;
        }

        @keyframes floatOuterDots {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(50px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-40px, 40px) rotate(180deg);
          }
          75% {
            transform: translate(30px, -50px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        @keyframes floatInnerDots {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -15px) rotate(90deg);
          }
          50% {
            transform: translate(-15px, 15px) rotate(180deg);
          }
          75% {
            transform: translate(10px, -20px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        @media screen and (min-width: 768px) and (max-width: 1023px) {
          .container > div > div {
            flex-direction: column;
            align-items: center;
            padding: 3rem 2.5rem;
            gap: 2rem;
          }

          .max-w-xl {
            max-width: 90%;
            text-align: center;
          }

          .title-heading {
            font-size: 3.65rem;
            line-height: 1.15;
          }

          .gradient-text {
            display: inline-block;
            margin-top: 0.1rem;
          }

          p {
            font-size: 1.3rem;
          }

          .cta-button {
            margin: 1rem auto 0;
            padding: 1.5rem 3.1rem;
            font-size: 1.3rem;
          }

          .mt-12 {
            display: none;
            margin: 0;
            height: 0;
          }

          .inner-dot {
            width: 4px;
            height: 4px;
          }

          .outer-dot {
            width: 5px;
            height: 5px;
          }
        }

        @media screen and (max-width: 767px) {
          .container > div > div {
            flex-direction: column;
            align-items: center;
            padding: 2rem 1.5rem;
            gap: 1.5rem;
          }

          .mt-12 {
            display: none;
            margin: 0;
            height: 0;
          }

          .max-w-xl {
            max-width: 95%;
            text-align: center;
          }

          .title-heading {
            font-size: 2.5rem;
            line-height: 1.2;
          }

          .gradient-text {
            display: inline-block;
            margin-top: 0.1rem;
          }

          p {
            font-size: 1rem;
            line-height: 1.4;
          }

          .cta-button {
            margin: 1rem auto 0;
            padding: 1rem 2.5rem;
            font-size: 1rem;
          }

          .w-96 {
            display: none;
          }

          .inner-dot {
            width: 3px;
            height: 3px;
          }

          .outer-dot {
            width: 4px;
            height: 4px;
          }
        }

        @media screen and (max-width: 320px) {
          .container > div > div {
            padding: 1.5rem 1rem;
            gap: 1rem;
          }

          .max-w-xl {
            max-width: 100%;
            text-align: center;
          }

          .title-heading {
            font-size: 2rem;
            line-height: 1.2;
          }

          p {
            font-size: 0.9rem;
            line-height: 1.3;
          }

          .cta-button {
            margin: 1rem auto 0;
            padding: 0.8rem 2rem;
            font-size: 0.95rem;
          }

          .mt-12 {
            display: none;
            margin: 0;
            height: 0;
          }
        }
      `}</style>
    </section>
  );
}
