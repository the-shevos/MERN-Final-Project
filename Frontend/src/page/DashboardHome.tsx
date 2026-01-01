import React, { useEffect, useState } from "react";
import { ResponsiveContainer } from "recharts";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { faHeadset } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const DashboardHome = () => {
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "completed" | "in-progress" | "pending"
  >("all");
  const [chartData, setChartData] = useState<
    { day: string; InProgress: number; Completed: number }[]
  >([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const fetchLatestOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/orders/latest");
      const orders = res.data;
      setLatestOrders(orders);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      const days: string[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(day.getDate() + i);
        days.push(
          day.toLocaleDateString("en-US", { day: "2-digit", month: "short" })
        );
      }
      const completedCounts = new Array(7).fill(0);
      const inProgressCounts = new Array(7).fill(0);
      for (const order of orders) {
        const orderDate = new Date(order.createdAt);
        const diffDays = Math.floor(
          (orderDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays >= 0 && diffDays < 7) {
          if (order.status === "completed") {
            completedCounts[diffDays]++;
          } else if (order.status === "in-progress") {
            inProgressCounts[diffDays]++;
          }
        }
      }
      const newChartData = days.map((day, idx) => ({
        day,
        InProgress: inProgressCounts[idx],
        Completed: completedCounts[idx],
      }));
      setChartData(newChartData);
    } catch (err) {
      console.error(err);
    }
  };

  const loadContacts = async () => {
    const res = await axios.get("http://localhost:3000/api/v1/contact/limit");
    setContacts(res.data);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    fetchLatestOrders();
  }, []);

  const getTotalQuantity = (items: OrderItem[]) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredOrders =
    activeTab === "all"
      ? latestOrders
      : latestOrders.filter((o) => o.status === activeTab);

  const pendingCount = latestOrders.filter(
    (o) => o.status === "pending"
  ).length;
  const inProgressCount = latestOrders.filter(
    (o) => o.status === "in-progress"
  ).length;
  const completedCount = latestOrders.filter(
    (o) => o.status === "completed"
  ).length;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  const startStr = startDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
  const endStr = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
  const dateRange = `${startStr} - ${endStr}`;

  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedOrder]);

  useEffect(() => {
    if (contacts.length === 0) return;
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 2) % contacts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [contacts]);

  const visibleContacts = contacts.slice(visibleIndex, visibleIndex + 2);
  if (visibleContacts.length < 2) {
    visibleContacts.push(...contacts.slice(0, 2 - visibleContacts.length));
  }

  type TabType = "all" | "completed" | "in-progress" | "pending";

  const tabs: { label: string; value: TabType }[] = [
    { label: "All Tasks", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "In Progress", value: "in-progress" },
    { label: "Pending", value: "pending" },
  ];

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`pb-2 font-semibold text-lg transition-all ${
                  activeTab === tab.value
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-end">
            {[
              { label: "Pending", count: pendingCount, color: "yellow" },
              { label: "Processing", count: inProgressCount, color: "blue" },
              { label: "Complete", count: completedCount, color: "green" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center px-5 py-2 rounded-2xl shadow-md border border-gray-100 transition-all hover:scale-105 ${
                  stat.color === "yellow"
                    ? "bg-yellow-50"
                    : stat.color === "blue"
                    ? "bg-blue-50"
                    : "bg-green-50"
                }`}
              >
                <p
                  className={`text-3xl md:text-4xl font-bold ${
                    stat.color === "yellow"
                      ? "text-yellow-700"
                      : stat.color === "blue"
                      ? "text-blue-700"
                      : "text-green-700"
                  }`}
                >
                  {stat.count}
                </p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl shadow-lg border border-gray-300 bg-white">
          <table className="w-full min-w-[700px] text-sm text-left">
            <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white rounded-t-3xl">
              <tr className="uppercase tracking-wide text-xs">
                <th className="py-3 px-6 font-medium text-center">Order</th>
                <th className="py-3 px-6 font-medium text-center">User</th>
                <th className="py-3 px-6 font-medium text-center">Quantity</th>
                <th className="py-3 px-6 font-medium text-center">Status</th>
                <th className="py-3 px-6 font-medium text-center">Date</th>
                <th className="py-3 px-6 font-medium text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-indigo-50 transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-4 px-6 font-medium text-gray-700 text-center">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-center">
                    {order.user}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-center">
                    {getTotalQuantity(order.items)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : order.status === "in-progress"
                          ? "bg-blue-200 text-blue-800"
                          : order.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {order.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-center">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order Progress
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Daily order activity overview
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-cyan-400" />
                  In Progress
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-slate-800" />
                  Completed
                </div>
              </div>

              <div className="bg-gray-100 text-gray-700 rounded-xl px-4 py-1.5 text-sm font-medium cursor-pointer hover:bg-gray-200 transition">
                {dateRange}
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="inProgressGlow"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient
                    id="completedGlow"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0f172a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e5e7eb"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    padding: "12px",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "4px",
                  }}
                  itemStyle={{
                    fontWeight: 500,
                    color: "#374151",
                  }}
                />

                <Line
                  type="natural"
                  dataKey="InProgress"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#22d3ee",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  fill="url(#inProgressGlow)"
                />

                <Line
                  type="natural"
                  dataKey="Completed"
                  stroke="#0f172a"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#0f172a",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  fill="url(#completedGlow)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-3xl p-6 shadow-2xl border border-slate-700">
          <h2 className="flex items-center justify-center gap-1 text-xl font-bold text-white mb-5 tracking-wide">
            <FontAwesomeIcon
              icon={faHeadset}
              className="text-purple-400 text-xl"
            />
            <span>Contact Support</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {visibleContacts.map((c) => (
              <div
                key={c._id}
                className="group relative bg-white/95 backdrop-blur rounded-2xl p-5 border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex flex-col gap-1 text-center">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    {c.name}
                  </h3>

                  <p className="text-xs text-gray-500">{c.email}</p>

                  <div className=" rounded-xl p-3 text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">
                      Message:
                    </span>{" "}
                    {c.message}
                  </div>

                  <p className="text-[11px] text-gray-400 mt-2">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="absolute top-0 right-0 h-full w-1 bg-indigo-500 group-hover:w-2 transition-all duration-300 rounded-r-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-6 overflow-auto max-h-[90vh] relative shadow-2xl animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-600 font-bold text-3xl hover:text-gray-800 transition-all"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-purple-500 border-b pb-3">
              Order Details #{selectedOrder._id.slice(-6)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700 text-sm">
              <p>
                <span className="font-medium text-gray-800">User:</span>{" "}
                {selectedOrder.user}
              </p>
              <p>
                <span className="font-medium text-gray-800">Payment:</span>{" "}
                {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="font-medium text-gray-800">Total Amount:</span>{" "}
                ${selectedOrder.totalAmount}
              </p>
              <p>
                <span className="font-medium text-gray-800">Shipping:</span>{" "}
                {selectedOrder.shippingAddress}
              </p>
              <p>
                <span className="font-medium text-gray-800">Created At:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium text-gray-800">Status:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : selectedOrder.status === "in-progress"
                      ? "bg-blue-200 text-blue-800"
                      : selectedOrder.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {selectedOrder.status.toUpperCase()}
                </span>
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Items in Order
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 rounded-2xl transition-all p-4 flex items-center gap-4 border border-gray-100 w-72"
                >
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  )}
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-gray-800 text-lg hover:text-indigo-600 transition-colors">
                      {item.product.name}
                    </h4>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">
                      Price: ${item.product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHome;
