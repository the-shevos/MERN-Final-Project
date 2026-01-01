import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  X,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { PaymentForm } from "../component/PaymentForm";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  images?: string[];
}

export default function OrderPage() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Sri Lanka");
  const [items, setItems] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        username: parsed.userName || "",
        email: parsed.userEmail || "",
      });
    }
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  const shippingFees = {
    "Sri Lanka": 4,
    India: 6,
    "United States": 5,
    "United Kingdom": 5,
    Canada: 7,
    Australia: 8,
    UAE: 5,
    Singapore: 6,
  };

  const subtotal = items.reduce(
    (acc, item) =>
      acc + (item.discountPrice ?? item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const delivery =
    subtotal > 2000
      ? 0
      : shippingFees[country as keyof typeof shippingFees] ?? 0;
  const total = subtotal + delivery;

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setOrderConfirmed(true);
    localStorage.removeItem("cart");
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen relative bg-gradient-to-tr from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl w-full"
        >
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1">
              <div className="bg-white/90 backdrop-blur-lg rounded-t-3xl px-12 pt-16 pb-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="inline-flex"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-pink-400 blur-3xl opacity-60 scale-150 animate-pulse"></div>
                    <CheckCircle
                      size={100}
                      className="relative text-indigo-600 z-10"
                      strokeWidth={2.5}
                    />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mt-8"
                >
                  Thank You, {user.username || "Friend"}!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xl text-gray-600 mt-4"
                >
                  Your order #{Math.floor(100000 + Math.random() * 900000)} is
                  confirmed
                </motion.p>
              </div>
            </div>

            <div className="p-12 space-y-10">
              <div className="text-center">
                <p className="text-gray-600">
                  A confirmation email has been sent to
                </p>
                <p className="text-2xl font-semibold text-indigo-600 mt-2">
                  {user.email}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="text-indigo-600" />
                    <h3 className="font-semibold text-lg">
                      Items ({items.length})
                    </h3>
                  </div>
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 mb-2"
                    >
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0]
                            : "/placeholder.png"
                        }
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                      <p className="text-gray-700 text-sm font-medium">
                        {item.name} × {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="text-pink-600" />
                    <h3 className="font-semibold text-lg">Delivers by</h3>
                  </div>
                  <p className="text-2xl font-bold text-pink-600">
                    {new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-1 rounded-2xl">
                <div className="bg-white rounded-2xl p-8 text-center">
                  <p className="text-gray-600 mb-2">Total Paid</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </p>
                  {delivery === 0 && (
                    <p className="text-green-600 font-medium mt-3">
                      Free Express Shipping Applied
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/product")}
                  className="flex items-center gap-3 px-10 py-5 bg-gray-100 text-gray-800 rounded-2xl font-medium text-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="icon-hide-mobile">
                    <ShoppingBag size={20} />
                  </div>{" "}
                  Continue Shopping
                </motion.button>
              </div>
            </div>
          </div>

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: [0.3, 1, 0.3], y: -100 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              className="absolute w-3 h-3 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full blur-sm"
              style={{ left: `${20 + i * 15}%`, top: "10%" }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-pink-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-10"
        >
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl border border-gray-300 p-10"
            >
              <div className="flex flex-col md:flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="icon-hide-mobile p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h1 className=" checkout-title text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Complete Your Order
                    </h1>
                    <p className="checkout-title text-gray-600 mt-1">
                      You're just one step away from magic
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/product")}
                  className="continue-button px-6 py-3 bg-gray-400/80 text-gray-800 rounded-2xl font-medium text-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <ShoppingBag size={20} />
                  Continue Shopping
                </motion.button>
              </div>

              <div className="space-y-10 mt-12">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Your Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Full Name",
                        value: user.username,
                        readOnly: true,
                      },
                      {
                        label: "Email Address",
                        value: user.email,
                        readOnly: true,
                      },
                      {
                        label: "Phone Number",
                        value: phone,
                        onChange: setPhone,
                        placeholder: "+94 77 123 4567",
                      },
                      {
                        label: "Country",
                        value: country,
                        onChange: setCountry,
                        type: "select",
                      },
                    ].map((field, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <div className="relative">
                            <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="peer w-full px-5 py-4 rounded-2xl bg-gray-200 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-800 font-medium appearance-none"
                            >
                              <option>Sri Lanka</option>
                              <option>India</option>
                              <option>United States</option>
                              <option>United Kingdom</option>
                              <option>Canada</option>
                              <option>Australia</option>
                              <option>UAE</option>
                              <option>Singapore</option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center transition-transform duration-300 peer-focus:rotate-180">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => field.onChange?.(e.target.value)}
                            readOnly={field.readOnly}
                            placeholder={field.placeholder}
                            className={`w-full px-5 py-4 rounded-2xl border transition-all outline-none font-medium ${
                              field.readOnly
                                ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                                : "bg-gray-200 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            }`}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    placeholder="123 Main Street, Colombo 07, Western Province, Sri Lanka"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-200 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none font-medium text-gray-800"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8"
            >
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <h3 className="text-2xl font-bold">Order Summary</h3>
                  <p className="text-white/80 mt-1">{items.length} items</p>
                </div>

                <div className="p-8 space-y-6">
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between items-center p-3 bg-white/50 rounded-xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0]
                              : "/placeholder.png"
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                        />

                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-bold text-indigo-600">
                        $
                        {(
                          (item.discountPrice ?? item.price ?? 0) *
                          (item.quantity ?? 1)
                        ).toFixed(2)}
                      </p>
                    </motion.div>
                  ))}

                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span
                        className={
                          delivery === 0 ? "text-green-600 font-medium" : ""
                        }
                      >
                        {delivery === 0 ? "Free" : `$${delivery}`}
                      </span>
                    </div>

                    {delivery === 0 && total <= 2000 && (
                      <p className="text-sm text-green-600 font-medium">
                        Free shipping applied!
                      </p>
                    )}

                    <div className="pt-6 border-t-2 border-indigo-100">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-800">
                          Total
                        </span>
                        <span className="text-4xl summary-total font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPaymentModal(true)}
                    disabled={!address || !phone || items.length === 0}
                    className="w-full order-button-complete py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <div className="icon-hide-mobile">
                      <CreditCard size={28} />
                    </div>{" "}
                    Complete Secure Payment
                  </motion.button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Secured by{" "}
                      <span className="font-bold text-indigo-600">Stripe</span>{" "}
                      • End-to-end encrypted
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 w-full max-w-lg p-10"
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={32} />
            </button>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Final Step
              </h2>
              <p className="text-gray-600 mt-3 text-lg">
                Enter your card details to complete
              </p>
            </div>
            <PaymentForm
              total={total}
              onClose={() => setShowPaymentModal(false)}
              onSuccess={handlePaymentSuccess}
              user={user}
              address={address}
              country={country}
              phone={phone}
              items={items}
            />
          </motion.div>
        </div>
      )}

      <style>{`
    .continue-button {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    @media (max-width: 480px) {
      .continue-btn {
        display: block;
        margin-left: 0;
        margin-top: 1rem;
        text-align: center;
      }

      .icon-hide-mobile {
        display: none !important;
      }

      .checkout-title {
        text-align: center !important;
      }

      .checkout-grid {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
      }

      .form-card {
        padding: 1.5rem !important;
        border-radius: 2rem !important;
      }

      .summary-card {
        margin-top: 2rem !important;
        padding: 1.5rem !important;
      }

      input,
      select,
      textarea {
        padding: 0.75rem !important;
        font-size: 0.9rem !important;
      }

      h1, h2, h3 {
        font-size: 1.5rem !important;
      }

      .order-button,
      .continue-button {
        font-size: 1rem !important;
        padding: 0.75rem 1rem !important;
      }

      img {
        width: 3rem !important;
        height: 3rem !important;
      }
    }

    .summary-total {
      font-size: 1.5rem !important;
    }

    .order-button-complete {
      font-size: 0.9rem !important;
      padding: 0.75rem !important;
    }
`}</style>
    </div>
  );
}
