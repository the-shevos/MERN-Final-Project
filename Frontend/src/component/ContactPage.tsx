"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Footer from "./Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faPaperPlane,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTelegramPlane,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = (name: string) => /^[A-Za-z ]{3,}$/.test(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill all fields!", {
        style: { backgroundColor: "#ef4444", color: "#fff" },
      });
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email!", {
        style: { backgroundColor: "#ef4444", color: "#fff" },
      });
      return;
    }
    if (!isValidName(name)) {
      toast.error("Please enter a valid name (only letters, min 3 chars)!", {
        style: { backgroundColor: "#ef4444", color: "#fff" },
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully!", {
          style: { backgroundColor: "#22c55e", color: "#fff" },
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(data.error || "Something went wrong!", {
          style: { backgroundColor: "#ef4444", color: "#fff" },
        });
      }
    } catch {
      toast.error("Server error, try again later!", {
        style: { backgroundColor: "#ef4444", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div
            className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-300 shadow-lg h-auto"
            data-aos="fade-right"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 bg-gradient-to-r from-indigo-400 via-purple-700 to-pink-400 bg-clip-text text-transparent">
              Message With Us
            </h2>
            <p className="text-slate-700 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed font-montserrat">
              Have a question or want to say hello? We’re here to help! Send us
              a message and our team will get back to you promptly.
            </p>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Type Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/30 border border-black/15 text-sm sm:text-base text-slate-900 focus:border-purple-500 outline-none"
              />
              <input
                type="email"
                placeholder="Type Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/30 border border-black/15 text-sm sm:text-base text-slate-900 focus:border-purple-500 outline-none"
              />
              <textarea
                placeholder="Type Your Message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/30 border border-black/15 text-sm sm:text-base text-slate-900 focus:border-purple-500 outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <button
                  type="submit"
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                <Link
                  to="/"
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Back To Home
                  <FontAwesomeIcon icon={faHome} />
                </Link>
              </div>
            </form>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div
              className="bg-white/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-300 shadow-lg"
              data-aos="fade-left"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-6 sm:mb-8">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-red-500 text-lg mt-1"
                    />
                    <div>
                      <h4 className="font-semibold text-purple-700 text-sm sm:text-base mb-1">
                        Our Location
                      </h4>
                      <p className="text-slate-700 text-sm sm:text-base font-montserrat">
                        198 Work Street, Colombo, Sri Lanka
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <FontAwesomeIcon
                      icon={faPhoneAlt}
                      className="text-green-500 text-lg mt-1"
                    />
                    <div>
                      <h4 className="font-semibold text-purple-700 text-sm sm:text-base mb-1">
                        Phone
                      </h4>
                      <p className="text-slate-700 text-sm sm:text-base font-montserrat">
                        +94 (75) 349 3027
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-blue-500 text-lg mt-1"
                    />
                    <div>
                      <h4 className="font-semibold text-purple-700 text-sm sm:text-base mb-1">
                        Email
                      </h4>
                      <p className="text-slate-700 text-sm sm:text-base font-montserrat">
                        contact@JacketExe.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-44 sm:h-52 md:h-44 lg:h-52">
                  <iframe
                    className="w-full h-full rounded-xl border border-gray-300"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.582904581!2d79.786164!3d6.921837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x3964531d51fe7d!2sColombo!5e0!3m2!1sen!2slk!4v1650000000000"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>

            <div
              className="relative w-full bg-white/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-6 border border-gray-300 shadow-lg flex flex-col md:flex-row md:items-center"
              data-aos="zoom-in"
            >
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 text-center md:text-left">
                  Hours of Operation
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between px-3 py-1 rounded-lg hover:bg-white/30 transition text-sm sm:text-base">
                    Monday - Friday
                    <span className="text-slate-900 font-semibold font-montserrat">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between px-3 py-1 rounded-lg hover:bg-white/30 transition text-sm sm:text-base">
                    <span className="font-medium text-slate-700 font-montserrat">
                      Saturday
                    </span>
                    <span className="text-slate-900 font-semibold font-montserrat">
                      10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between px-3 py-1 rounded-lg hover:bg-white/30 transition text-sm sm:text-base">
                    <span className="font-medium text-slate-700 font-montserrat">
                      Sunday
                    </span>
                    <span className="text-rose-600 font-semibold font-montserrat">
                      Closed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col mt-6 md:mt-0 md:ml-6 justify-center md:justify-start gap-6">
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className="text-[#7f3ddb] text-xl hover:scale-125 transition cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-[#7f3ddb] text-xl hover:scale-125 transition cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faTelegramPlane}
                  className="text-[#7f3ddb] text-xl hover:scale-125 transition cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="text-[#7f3ddb] text-xl hover:scale-125 transition cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <style>{`
        body, html {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          min-height: 100vh;
          background-color: #f5f5f5;
          background-image: 
            radial-gradient(circle at 20% 30%, #ffe4e6, transparent 50%),
            radial-gradient(circle at 70% 60%, #e0f7fa, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(213, 162, 169, 0.05), transparent 55%),
            radial-gradient(circle at 0% 100%, #d5ecf3, transparent 50%),
            radial-gradient(circle at 100% 0%, #d4e9f1, transparent 50%);
          background-repeat: no-repeat;
          background-size: cover;
          background-attachment: fixed;
          animation: sprayShift 25s ease infinite alternate;
        }
        .font-montserrat { font-family: 'Roboto', sans-serif; }
        @keyframes sprayShift {
          0% { background-position: 0% 0%, 100% 100%, 50% 50%, 0% 100%, 100% 0%; }
          100% { background-position: 10% 10%, 90% 90%, 45% 80%, 5% 95%, 95% 5%; }
        }
      `}</style>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
