import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  faMagnifyingGlass,
  faChartPie,
  faChevronDown,
  faUserGear,
  faIdBadge,
  faArrowRightFromBracket,
  faChartSimple,
  faChartLine,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar as faCalendarRegular } from "@fortawesome/free-regular-svg-icons";

const Dashboard = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [admin, setAdmin] = React.useState<any>({
    name: "",
    email: "",
    profileImage: "",
    _id: "",
  });

  const [newContactCount, setNewContactCount] = React.useState(0);

  useEffect(() => {
    const fetchContactCount = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/v1/contact/new-count"
      );
      setNewContactCount(res.data.count);
    };

    fetchContactCount();
    const interval = setInterval(fetchContactCount, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const markAllRead = async () => {
      try {
        await axios.post("http://localhost:3000/api/v1/contact/read-all");
        setNewContactCount(0);
      } catch (err) {
        console.error(err);
      }
    };

    if (location.pathname === "/dashboard/support") {
      markAllRead();
    }
  }, [location.pathname]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    setFormData({
      name: admin.name,
      email: admin.email,
      profileImage: admin.profileImage,
      profileImageFile: null,
      userPassword: "",
    });
  }, [admin]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    profileImage: "",
    profileImageFile: null,
    userPassword: "",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:3000/api/v1/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin({
          name: res.data.user.userName,
          email: res.data.user.userEmail,
          profileImage: res.data.user.profileImage,
          _id: res.data.user._id,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdmin();
  }, []);

  const generateOrdersReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orders = res.data;
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(18);
      doc.text("FULL ORDERS REPORT", 14, y);
      y += 10;

      orders.forEach((order: any, index: number) => {
        doc.setFontSize(16);
        doc.text(`Order #${order._id.slice(-6)}`, 14, y);
        y += 8;

        doc.setFontSize(12);

        const orderInfo = [
          ["User", order.user],
          ["Total Amount", `$${order.totalAmount}`],
          ["Payment Method", order.paymentMethod],
          ["Shipping Address", order.shippingAddress],
          ["Status", order.status],
          ["Created At", new Date(order.createdAt).toLocaleString()],
        ];

        autoTable(doc, {
          startY: y,
          theme: "grid",
          head: [["Field", "Value"]],
          body: orderInfo,
        });

        y = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(14);
        doc.text("Items:", 14, y);
        y += 5;

        const itemRows = order.items.map((item: any) => [
          item.product.name,
          item.quantity,
          `$${item.price}`,
        ]);

        autoTable(doc, {
          startY: y,
          head: [["Product", "Qty", "Price"]],
          body: itemRows,
        });

        y = (doc as any).lastAutoTable.finalY + 10;

        if (index !== orders.length - 1) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save("full-orders-report.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }
  };

  const generateMembersReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const emailRes = await axios.get(
        "http://localhost:3000/api/v1/user/verified-users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const googleRes = await axios.get(
        "http://localhost:3000/api/get-google-users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const emailUsers = emailRes.data.users.map((u: any) => ({
        id: u._id,
        name: u.userName,
        email: u.userEmail,
        provider: "Email & Password",
        createdAt: u.createdAt,
        isBlocked: u.isBlocked,
      }));

      const googleUsers = googleRes.data.users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        provider: "Google",
        createdAt: u.createdAt,
        isBlocked: u.isBlocked,
      }));

      const allMembers = [...emailUsers, ...googleUsers];

      if (allMembers.length === 0) {
        alert("No members found!");
        return;
      }

      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("MEMBERS REPORT", 14, 20);

      const tableBody = allMembers.map((m) => [
        m.id.slice(-6),
        m.name,
        m.email,
        m.provider,
        new Date(m.createdAt).toLocaleDateString(),
        m.isBlocked ? "Blocked" : "Active",
      ]);

      autoTable(doc, {
        startY: 30,
        head: [["ID", "Name", "Email", "Provider", "Joined On", "Status"]],
        body: tableBody,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [100, 81, 204] },
        theme: "grid",
      });

      doc.save("members-report.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }
  };

  const generateProductsReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const products = res.data;

      if (products.length === 0) {
        alert("No products found!");
        return;
      }

      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("PRODUCTS REPORT", 14, 20);

      const tableBody = products.map((p: any) => [
        p._id.slice(-6),
        p.name,
        p.category,
        p.price,
        p.discountPrice || "-",
        p.stock,
        new Date(p.createdAt).toLocaleDateString(),
      ]);

      autoTable(doc, {
        startY: 30,
        head: [
          [
            "ID",
            "Name",
            "Category",
            "Price",
            "Discount",
            "Stock",
            "Created On",
          ],
        ],
        body: tableBody,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [100, 81, 204] },
        theme: "grid",
      });

      doc.save("products-report.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to generate product PDF");
    }
  };

  return (
    <div className="bg-blue-100/40 min-h-screen flex">
      <aside className="w-56 bg-white border-2 border-indigo-400 p-6 flex flex-col rounded-3xl m-4 mr-0 shrink-0 h-[615px] sticky top-3 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-indigo-200">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">JC</span>
          </div>
          <span className="font-semibold text-lg text-indigo-700">
            Jacketexe
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-indigo-500 text-white shadow"
                : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
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
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/products")
                ? "bg-purple-500 text-white shadow"
                : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
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
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/orders")
                ? "bg-indigo-500 text-white shadow"
                : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
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
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
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
            className={`relative flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/support")
                ? "bg-purple-500 text-white shadow"
                : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
            }`}
            onClick={() => setNewContactCount(0)}
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
            {newContactCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {newContactCount}
              </span>
            )}
          </Link>

          <Link
            to="members"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/members")
                ? "bg-indigo-500 text-white shadow"
                : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
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

        <div className="mb-3 flex flex-col items-center gap-2 border-t-2 border-indigo-200 pt-4">
          <img
            src={
              admin.profileImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR233AdxQNGX7tQYvWj2gvoa92YNOU8y3zDzw&s"
            }
            alt="Admin Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300 shadow-md"
          />
          <div className="text-center">
            <p className="text-md font-medium text-indigo-700">{admin.name}</p>
            <p className="text-sm text-indigo-400">{admin.email}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 space-y-4 overflow-auto">
        <div className="flex items-center gap-6 max-w-7xl mx-auto px-4 py-3">
          <div className="w-[520px] bg-white rounded-full px-5 py-3 flex items-center gap-3 border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for customers, orders or product..."
              className="bg-transparent outline-none flex-1 text-base placeholder-gray-400 text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 text-sm border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300">
              <FontAwesomeIcon
                icon={faCalendarRegular}
                className="text-gray-400 text-sm"
              />
              <span className="text-gray-700 font-semibold text-xs tracking-wider uppercase">
                Nov 22, 2025
              </span>
            </div>

            <div className="relative group">
              <button className="flex items-center px-5 py-3 rounded-full text-sm font-semibold bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                Reports
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="ml-2 text-xs transition-transform duration-300 group-hover:rotate-180"
                />
              </button>

              <div className="absolute right-0 mt-2 w-52 z-50 bg-white/80 backdrop-blur-md border border-gray-200/30 rounded-2xl shadow-2xl ring-1 ring-black/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right transform scale-90 group-hover:scale-100">
                <a
                  href="#"
                  onClick={generateMembersReport}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm rounded-t-xl shadow-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                >
                  <FontAwesomeIcon
                    icon={faChartSimple}
                    className="text-purple-600"
                  />
                  Customers Report
                </a>

                <a
                  href="#"
                  onClick={generateOrdersReport}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm shadow-sm hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                >
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="text-green-600"
                  />
                  Orders Report
                </a>

                <a
                  href="#"
                  onClick={generateProductsReport}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm rounded-b-xl shadow-sm hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                >
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                  Product Report
                </a>
              </div>
            </div>

            <div className="relative group">
              <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 overflow-hidden relative">
                <img
                  src={
                    admin.profileImage ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjlvNBPzsciij8KcvV9tR2rHw_5p8Ymb796A&s"
                  }
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
              </button>

              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right transform scale-95 group-hover:scale-100 z-50">
                <div className="p-4 flex items-center gap-4 border-b border-gray-100 rounded-t-2xl">
                  <img
                    src={
                      admin.profileImage ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjlvNBPzsciij8KcvV9tR2rHw_5p8Ymb796A&s"
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {admin.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {admin.email || "admin@example.com"}
                    </p>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({
                        name: admin.name,
                        email: admin.email,
                        profileImage: admin.profileImage,
                        profileImageFile: null,
                        userPassword: "",
                      });
                      setIsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg border-b border-gray-300 bg-indigo-100 text-indigo-700">
                      <FontAwesomeIcon icon={faIdBadge} />
                    </div>
                    Manage Account
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-500">
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </div>
                    Logout
                  </button>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 text-center text-xs text-gray-400 rounded-b-2xl">
                  Last login: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative border border-purple-300 shadow-2xl">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors duration-200"
              >
                <span className="text-slate-400 text-xl">×</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Update Profile
              </h2>
              <p className="text-slate-500 text-sm">
                Manage your account details
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData((prev) => ({
                        ...prev,
                        profileImageFile: e.target.files![0],
                      }));
                    }
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
              <button
                className="px-6 py-3 rounded-2xl text-slate-600 font-medium hover:bg-red-200 hover:text-red-700 transition-all duration-200"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    if (!token) return alert("You must be logged in");

                    const formDataObj = new FormData();
                    formDataObj.append("userName", formData.name);
                    formDataObj.append("userEmail", formData.email);

                    if (formData.profileImageFile) {
                      formDataObj.append(
                        "profileImage",
                        formData.profileImageFile
                      );
                    }

                    if (formData.userPassword) {
                      formDataObj.append("userPassword", formData.userPassword);
                    }

                    const res = await axios.put(
                      `http://localhost:3000/api/v1/admin/update-profile/${admin._id}`,
                      formDataObj,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    setAdmin({
                      name: res.data.user.userName,
                      email: res.data.user.userEmail,
                      profileImage: res.data.user.profileImage,
                      _id: res.data.user._id,
                    });
                    setIsModalOpen(false);
                    alert("Profile updated successfully!");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to update profile");
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
