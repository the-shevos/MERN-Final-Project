import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet, useLocation } from "react-router-dom";

import {
  faMagnifyingGlass,
  faChartPie,
  faChevronDown,
  faUserGear,
  faIdBadge,
  faKey,
  faArrowRightFromBracket,
  faChartSimple,
  faChartLine,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar as faCalendarRegular } from "@fortawesome/free-regular-svg-icons";

const Dashboard = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const cards = document.querySelectorAll("#card-container > div");
    let current = 0;
    const interval = setInterval(() => {
      cards[current].classList.remove("opacity-100");
      cards[current].classList.add("opacity-0");
      current = (current + 1) % cards.length;
      cards[current].classList.remove("opacity-0");
      cards[current].classList.add("opacity-100");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-stone-300
min-h-screen flex"
    >
      <aside className="w-56 bg-white border-2 border-gray-900 p-6 flex flex-col rounded-3xl m-4 mr-0 shrink-0 h-[615px] sticky top-3">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-300">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">JC</span>
          </div>
          <span className="font-semibold text-lg">Jacketexe</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
              isActive("/dashboard")
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </Link>
          <Link
            to="products"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${
              isActive("/dashboard/products")
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Product
          </Link>
          <Link
            to="orders"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${
              isActive("/dashboard/orders")
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Orders
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Customization
          </a>
          <Link
            to="support"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${
              isActive("/dashboard/support")
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Contact Support
          </Link>

          <Link
            to="members"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm ${
              isActive("/dashboard/members")
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
            Members
          </Link>
        </nav>
        <div className="mb-3 flex flex-col items-center gap-2 border-t-2 border-gray-300 pt-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYhx7KkbOf5IBOgWi_XJqHxiy8wDZmpJeebA&s"
            alt="Admin Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-400"
          />
          <div className="text-center">
            <p className="text-md font-medium">Emily Jonson</p>
            <p className="text-sm text-gray-400">jonson@bress.com</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 space-y-4 overflow-auto">
        <div className="flex items-center gap-6 max-w-7xl mx-auto">
          <div className="w-[520px] bg-white rounded-full px-5 py-3 flex items-center gap-3 border border-gray-700 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-300 shadow-md hover:shadow-lg">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-gray-500"
            />
            <input
              type="text"
              placeholder="Search for customers, orders or product..."
              className="bg-transparent outline-none flex-1 text-base placeholder-gray-400 text-gray-700"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 text-sm border border-gray-800 shadow-sm">
              <FontAwesomeIcon
                icon={faCalendarRegular}
                className="text-gray-500 text-sm"
              />
              <span className="text-gray-700 font-semibold text-xs tracking-wider uppercase">
                Nov 22, 2025
              </span>
            </div>
            <div className="relative group">
              <button className="flex items-center px-5 py-3 rounded-full text-sm font-medium bg-slate-800 text-white hover:bg-slate-900 transition-all duration-200 shadow-lg transform hover:scale-[1.02]">
                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                Reports
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="ml-2 text-xs transition-transform duration-200 group-hover:rotate-180"
                />
              </button>
              <div className="absolute right-0 mt-2 w-48 z-50 bg-white border border-gray-400 rounded-xl shadow-2xl ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right transform scale-95 group-hover:scale-100">
                <a
                  href="#"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black rounded-t-xl"
                >
                  <FontAwesomeIcon icon={faChartSimple} className="mr-2" />
                  Customers Report
                </a>
                <a
                  href="#"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black"
                >
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Orders Report
                </a>
                <a
                  href="#"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black rounded-b-xl"
                >
                  <FontAwesomeIcon icon={faStar} className="mr-2" />
                  Product Report
                </a>
              </div>
            </div>
            <div className="relative group">
              <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-all">
                <FontAwesomeIcon
                  icon={faUserGear}
                  className="text-gray-600 text-lg"
                />
              </button>
              <div className="absolute right-0 mt-3 z-50 w-48 bg-white border border-gray-400 rounded-xl shadow-2xl ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right transform scale-95 group-hover:scale-100">
                <a
                  href="#"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-t-xl"
                >
                  <FontAwesomeIcon icon={faIdBadge} className="mr-2" />
                  Manage Account
                </a>
                <a
                  href="#"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faKey} className="mr-2" />
                  Credentials
                </a>
                <a
                  href="#"
                  className="block border-t border-gray-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-b-xl"
                >
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="mr-2"
                  />
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
