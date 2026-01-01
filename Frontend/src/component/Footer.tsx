"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneAlt,
  faEnvelope,
  faComments,
  faMapMarkerAlt,
  faGlobe,
  faQuestionCircle,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-[#161c29] border-t-[3px] border-purple-800 text-gray-300 py-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => {
          const top = Math.floor(Math.random() * 90) + "%";
          const left = Math.floor(Math.random() * 90) + "%";
          const x = Math.floor(Math.random() * 40 - 20) + "px";
          const y = Math.floor(Math.random() * 40 - 20) + "px";
          const duration = Math.floor(Math.random() * 4 + 3) + "s";
          const delay = Math.floor(Math.random() * 2) + "s";
          return (
            <div
              key={i}
              className="absolute w-1 h-1 border-2 border-purple-300 bg-gray-400 rounded-full animate-[floatDots_linear_infinite]"
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
            ></div>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row w-full items-start justify-between space-y-6 lg:space-y-0">
          <div className="w-full flex flex-col text-sm items-center lg:items-start pr-0 lg:pr-6 space-y-2 pt-3">
            <p className="text-gray-200 font-semibold text-[15px]">
              Customer Care
            </p>
            <p className="text-center lg:text-left">
              <FontAwesomeIcon
                icon={faPhoneAlt}
                className="mr-2 text-green-500"
              />
              <a
                href="tel:+11234567890"
                className="text-[#a78bfa] hover:underline"
              >
                +94 (078) 456-7890
              </a>
            </p>
            <p className="text-center lg:text-left">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-2 text-yellow-500"
              />
              <a
                href="mailto:support@Jacketexe.com"
                className="text-[#a78bfa] hover:underline"
              >
                support@Jacketexe.com
              </a>
            </p>
            <p className="text-center lg:text-left">
              <FontAwesomeIcon
                icon={faComments}
                className="mr-2 text-blue-500"
              />
              <a href="/chat" className="text-[#a78bfa] hover:underline">
                Start Chat
              </a>
            </p>

            <p className="pt-2 text-gray-200 font-semibold text-[15px]">
              Resources
            </p>
            <p className="text-center lg:text-left">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="mr-2 text-pink-500"
              />
              <a href="/faq" className="text-[#a78bfa] hover:underline">
                FAQ
              </a>
            </p>
            <p className="text-center lg:text-left">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="mr-2 text-orange-500"
              />
              <a href="/guides" className="text-[#a78bfa] hover:underline">
                Guides & Tutorials
              </a>
            </p>
          </div>

          <div className="w-full lg:w-[1400px] flex flex-col items-center text-center px-4 py-2 border-t lg:border-t-0 lg:border-l lg:border-r border-white/20">
            <h1 className="text-2xl font-bold text-gray-200">Jacketexe</h1>
            <p className="text-gray-400 max-w-lg mt-2">
              JacketExe is a modern dress shop that helps customers find stylish
              jackets and outfits. From casual wear to premium collections, we
              provide high-quality fashion items that empower your style and
              confidence while keeping you trendy every season.
            </p>

            <div className="flex flex-wrap justify-center space-x-4 lg:hidden mt-5">
              <a href="/home" className="text-[#a78bfa] hover:underline">
                Home
              </a>
              <a href="/about" className="text-[#a78bfa] hover:underline">
                Product
              </a>
              <a href="/services" className="text-[#a78bfa] hover:underline">
                Contact Us
              </a>
              <a href="/contact" className="text-[#a78bfa] hover:underline">
                AI Virtual
              </a>
            </div>

            <hr className="w-full border-white/30 mt-4 mb-2 lg:hidden" />
          </div>

          <div className="w-full flex flex-col items-center lg:items-end pl-0 lg:pl-6 space-y-2 pt-2 lg:pt-8">
            <p className="text-gray-200 font-semibold text-[16px]">
              Our Office
            </p>
            <p className="text-center lg:text-right">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mr-2 text-red-500"
              />
              198 Main Street
            </p>
            <p className="text-center lg:text-right">Colombo, Sri Lanka</p>
            <div className="flex flex-col items-center lg:items-end space-y-2 pt-2">
              <p className="text-center lg:text-right">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mr-2 text-yellow-500"
                />
                <a
                  href="mailto:info@Jacketexe.com"
                  className="text-[#a78bfa] hover:underline"
                >
                  info@Jacketexe.com
                </a>
              </p>
              <p className="text-center lg:text-right">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="mr-2 text-teal-400"
                />
                <a
                  href="https://www.Jacketexe.com"
                  target="_blank"
                  className="text-[#a78bfa] hover:underline"
                >
                  www.Jacketexe.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-wrap justify-center space-x-4 mt-5">
          <a href="/home" className="text-[#a78bfa] hover:underline">
            Home
          </a>
          <a href="/about" className="text-[#a78bfa] hover:underline">
            Product
          </a>
          <a href="/services" className="text-[#a78bfa] hover:underline">
            Contact Us
          </a>
          <a href="/contact" className="text-[#a78bfa] hover:underline">
            AI Virtual
          </a>
        </div>

        <hr className="my-6 border-white/50" />

        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap justify-center lg:justify-start space-x-2 text-sm">
            <a href="/terms" className="text-[#a78bfa] hover:underline">
              Terms & Conditions
            </a>
            <span>|</span>
            <a href="/privacy" className="text-[#a78bfa] hover:underline">
              Privacy Policy
            </a>
          </div>
          <p className="text-sm text-center lg:text-left">
            &copy; 2025 JacketExe. All rights reserved.
          </p>
          <div className="flex space-x-3 justify-center lg:justify-end">
            <a
              href="https://facebook.com"
              target="_blank"
              className="text-blue-600 hover:scale-110 transition-transform"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="text-pink-500 hover:scale-110 transition-transform"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              className="text-teal-400 hover:scale-110 transition-transform"
            >
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              className="text-red-500 hover:scale-110 transition-transform"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatDots {
          0% { transform: translate(0,0); opacity: 0.5; }
          50% { transform: translate(var(--x,0px), var(--y,0px)); opacity:1; }
          100% { transform: translate(0,0); opacity:0.5; }
        }
        .animate-[floatDots_linear_infinite] {
          animation: floatDots linear infinite;
        }
      `}</style>
    </footer>
  );
}
