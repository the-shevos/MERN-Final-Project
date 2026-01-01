import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 9;
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedOrder ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedOrder]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members.");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="ml-[220px] w-14 h-14 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-700">
        Orders Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between relative"
          >
            <div className="absolute bottom-4 right-4">
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl cursor-pointer font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrder(order);
                }}
              >
                &#x22EE;
              </button>
            </div>

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-purple-500">
                Order #{order._id.slice(-6)}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-500 mb-2 text-sm">
              <span className="font-medium">User:</span> {order.user}
            </p>
            <p className="text-gray-500 mb-2 text-sm">
              <span className="font-medium">Total:</span> ${order.totalAmount}
            </p>
            <p className="text-gray-500 mb-2 text-sm">
              <span className="font-medium">Items:</span>{" "}
              {order.items.map((i) => i.product.name).join(", ")}
            </p>
            <p className="text-gray-400 text-xs">
              Created: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-5 py-2 rounded-xl font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 disabled:cursor-not-allowed shadow-sm"
        >
          Previous
        </button>

        <span className="px-3 py-2 text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-5 py-2 rounded-xl font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 disabled:cursor-not-allowed shadow-sm"
        >
          Next
        </button>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-6 overflow-auto max-h-[90vh] shadow-2xl relative border border-gray-200 transform transition-all scale-95 animate-scaleIn">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
              <h2 className="text-2xl font-extrabold text-purple-500">
                Order Details #{selectedOrder._id.slice(-6)}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800 font-bold text-3xl transition-transform hover:scale-125"
                onClick={() => setSelectedOrder(null)}
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
              <p>
                <span className="font-semibold">User:</span>{" "}
                {selectedOrder.user}
              </p>
              <p>
                <span className="font-semibold">Payment:</span>{" "}
                {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="font-semibold">Total Amount:</span> $
                {selectedOrder.totalAmount}
              </p>
              <p>
                <span className="font-semibold">Shipping:</span>{" "}
                {selectedOrder.shippingAddress}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
            ${
              selectedOrder.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : selectedOrder.status === "in-progress"
                ? "bg-blue-100 text-blue-800"
                : selectedOrder.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
                >
                  {selectedOrder.status === "completed" && <FaCheckCircle />}
                  {selectedOrder.status === "cancelled" && <FaTimesCircle />}
                  {selectedOrder.status === "pending" && <FaBoxOpen />}
                  {selectedOrder.status.toUpperCase()}
                </span>
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Items
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200/80 rounded-2xl shadow hover:shadow-md p-4 flex items-center gap-4 transition transform hover:scale-[1.02]"
                >
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                      No Image
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {item.product.name}
                    </h4>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {selectedOrder.status === "pending" && (
                <>
                  <button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-[1.02]"
                    onClick={() =>
                      updateStatus(selectedOrder._id, "in-progress")
                    }
                  >
                    Start Progress
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-2xl hover:from-red-600 hover:to-red-700 transition transform hover:scale-[1.02]"
                    onClick={() => updateStatus(selectedOrder._id, "cancelled")}
                  >
                    Cancel
                  </button>
                </>
              )}
              {selectedOrder.status === "in-progress" && (
                <>
                  <button
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-2xl hover:from-green-600 hover:to-green-700 transition transform hover:scale-[1.02]"
                    onClick={() => updateStatus(selectedOrder._id, "completed")}
                  >
                    Complete
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-2xl hover:from-red-600 hover:to-red-700 transition transform hover:scale-[1.02]"
                    onClick={() => updateStatus(selectedOrder._id, "cancelled")}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
