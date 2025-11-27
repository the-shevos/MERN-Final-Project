import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
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
const DashboardHome = () => {
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "completed" | "in-progress" | "pending"
  >("all");
  const [chartData, setChartData] = useState<
    { day: string; InProgress: number; Completed: number }[]
  >([]);
  const fetchLatestOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/orders/latest");
      const orders = res.data;
      setLatestOrders(orders);
      // Compute chart data from real orders
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
  return (
    <>
      <div className="bg-white rounded-3xl p-7 shadow-xl border border-gray-400/90">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex gap-6">
            {[
              { label: "All Tasks", value: "all" },
              { label: "Completed", value: "completed" },
              { label: "In Progress", value: "in-progress" },
              { label: "Pending", value: "pending" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`pb-2 font-semibold transition-all ${
                  activeTab === tab.value
                    ? "text-gray-600 border-b-2 border-gray-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center items-center gap-10">
            <div className="flex items-center gap-10">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-800">
                  {pendingCount}
                </p>
                <p className="text-gray-500 text-sm mt-1">Pending</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-800">
                  {completedCount}
                </p>
                <p className="text-gray-500 text-sm mt-1">Done</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-800">
                  {inProgressCount}
                </p>
                <p className="text-gray-500 text-sm mt-1">Processing</p>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="py-3 px-4 font-medium">Order</th>
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Quantity</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-4 px-4 font-medium text-gray-700">
                    Order #{order._id.slice(-6)}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{order.user}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {getTotalQuantity(order.items)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    ${order.totalAmount}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-600 w-[600px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Order Progress</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>In
                Progress
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                Completed
              </div>
              <div className="bg-gray-300 rounded-lg px-3 py-1 text-sm flex items-center gap-1 cursor-pointer">
                {dateRange}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Data updates every 3 hours
          </p>
          <div className="relative h-42">
            <LineChart
              width={550}
              height={168}
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, "dataMax + 1"]}
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
                itemStyle={{ color: "#333" }}
              />
              <Line
                type="monotone"
                dataKey="InProgress"
                stroke="#22d3ee"
                strokeWidth={2}
                activeDot={{ r: 8, fill: "#22d3ee", stroke: "white" }}
                dot={{ r: 4, fill: "#22d3ee", stroke: "white" }}
              />
              <Line
                type="monotone"
                dataKey="Completed"
                stroke="#1e293b"
                strokeWidth={2}
                activeDot={{ r: 8, fill: "#1e293b", stroke: "white" }}
                dot={{ r: 4, fill: "#1e293b", stroke: "white" }}
              />
            </LineChart>
          </div>
        </div>
        <div className="bg-slate-800 rounded-3xl p-8 text-white relative">
          <h2 className="text-[22px] font-semibold mb-6">
            Assistance for Contact Support
          </h2>
          <div id="card-container" className="relative h-40">
            <div className="bg-white rounded-2xl p-4 text-gray-800 absolute inset-0 opacity-100">
              <h3 className="font-medium mb-1">John Doe</h3>
              <p className="text-gray-500 text-sm mb-2">john@example.com</p>
              <p className="text-gray-700 text-sm">Task: Setup dashboard</p>
            </div>
          </div>
        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 overflow-auto max-h-[90vh] relative">
            <button
              className="absolute top-3 right-3 text-gray-600 font-bold text-2xl"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Order Details #{selectedOrder._id.slice(-6)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700 text-sm">
              <p>
                <span className="font-medium">User:</span> {selectedOrder.user}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> $
                {selectedOrder.totalAmount}
              </p>
              <p>
                <span className="font-medium">Shipping:</span>{" "}
                {selectedOrder.shippingAddress}
              </p>
              <p>
                <span className="font-medium">Created At:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl shadow p-4 flex items-center gap-4"
                >
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-gray-800">
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
