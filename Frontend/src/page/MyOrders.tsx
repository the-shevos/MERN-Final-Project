import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Package, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
  product: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!user?._id) return;
    fetch(`http://localhost:3000/api/v1/orders/user/${user._id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-700">
        Please login to view your orders
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-tr from-purple-50 via-pink-50 to-yellow-50">
      <div
        className="inline-flex items-center gap-2 mt-4 ml-5 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer mb-8"
        onClick={() => navigate("/")}
      >
        <Home size={22} />
        <span>Home</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-10 -mt-24">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-2 heading-shadow">
            My Orders
          </h1>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl">
            Review all your past purchases and track their status
          </p>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg sm:text-xl">
            You have no orders yet 🛒
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-gray-300 hover:shadow-3xl transition-all duration-400 p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Order ID</p>
                    <p className="font-semibold text-base sm:text-lg md:text-xl text-purple-500">
                      #{order._id.slice(-6)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <p className="text-xs sm:text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package size={14} />
                    <p className="text-xs sm:text-sm">
                      {order.items.length} items
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-3 sm:gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-2xl border border-gray-100 bg-white/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-xl border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-xl" />
                      )}

                      <div className="flex-1 flex flex-col">
                        <p className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base">
                          {item.name || "Unnamed Product"}
                        </p>
                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
                          Quantity: {item.quantity} | Price: $
                          {item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-gray-800 font-semibold text-xs sm:text-sm md:text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-purple-500 font-bold text-base sm:text-lg md:text-xl mt-2 text-center">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .heading-shadow {
          text-shadow: 2px 2px 6px rgba(72, 75, 200, 0.6);
        }

        ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
        }

        ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #a78bfa, #8b5cf6);
        border: 3px solid transparent;
        }

        ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #5b21b6, #4c1d95);
        }

        @media (min-width: 481px) and (max-width: 1023px) {
          .heading-shadow { font-size: 2.5rem !important; line-height: 3rem !important; margin-top: 5px !important; }
          .backdrop-blur-lg { padding: 1.5rem !important; }
          .grid { gap: 1.5rem !important; grid-template-columns: repeat(2, 1fr) !important; }
          img { width: 4.5rem !important; height: 4.5rem !important; }
          p { font-size: 0.875rem !important; }
        }

        @media (max-width: 480px) {
          .heading-shadow { margin-top: 20px !important; font-size: 1.75rem !important; line-height: 2rem !important; }
          .backdrop-blur-lg { padding: 1rem !important; }
          .grid { gap: 1rem !important; }
          img { width: 3.5rem !important; height: 3.5rem !important; }
          p { font-size: 0.75rem !important; }
        }
      `}</style>
    </div>
  );
}
