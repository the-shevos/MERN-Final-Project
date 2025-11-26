import React, { useEffect, useState } from "react";
import axios from "axios";

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
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="text-center text-white mt-10">Loading orders...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Order #{order._id.slice(-6)}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : order.status === "in-progress"
                    ? "bg-blue-200 text-blue-800"
                    : order.status === "completed"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="text-gray-600 text-sm space-y-1">
              <p>
                <span className="font-medium">User:</span> {order.user}
              </p>
              <p>
                <span className="font-medium">Payment:</span> {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Total:</span> ${order.totalAmount}
              </p>
              <p>
                <span className="font-medium">Shipping:</span> {order.shippingAddress}
              </p>
              <p>
                <span className="font-medium">Items:</span>{" "}
                {order.items
                  .map((item) => `${item.product.name} (${item.quantity})`)
                  .join(", ")}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Created: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
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
                <span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> ${selectedOrder.totalAmount}
              </p>
              <p>
                <span className="font-medium">Shipping:</span> {selectedOrder.shippingAddress}
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
                    <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              {selectedOrder.status === "pending" && (
                <>
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={() => updateStatus(selectedOrder._id, "in-progress")}
                  >
                    Start Progress
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    onClick={() => updateStatus(selectedOrder._id, "cancelled")}
                  >
                    Cancel
                  </button>
                </>
              )}

              {selectedOrder.status === "in-progress" && (
                <>
                  <button
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    onClick={() => updateStatus(selectedOrder._id, "completed")}
                  >
                    Complete
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
