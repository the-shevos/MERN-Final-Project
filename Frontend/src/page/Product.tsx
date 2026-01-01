import React, { useEffect, useState } from "react";
import { Home, ShoppingCart, Heart, Star, X, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  rating?: number;
  reviews?: number;
  features?: string[];
  images: string[];
}

interface CartItem extends Product {
  quantity: number;
  discountPrice: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Everything");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return (JSON.parse(saved) as CartItem[]).map((item) => ({
          ...item,
          discountPrice: item.discountPrice ?? item.price,
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [showCartNotification, setShowCartNotification] = useState(
    cart.length > 0
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length > 0) setShowCartNotification(true);
  }, [cart]);

  const addToCart = (product: Product, qty: number) => {
    const priceToUse = product.discountPrice ?? product.price;
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        { ...product, quantity: qty, discountPrice: priceToUse },
      ];
    });
    setQuantity(1);
    closeModal();
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImage(product.images[0]);
    const inCart = cart.find((item) => item._id === product._id);
    const maxQty = inCart ? product.stock - inCart.quantity : product.stock;
    setQuantity(maxQty > 0 ? 1 : 0);
  };

  const closeModal = () => setSelectedProduct(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(
          "http://localhost:3000/api/v1/products"
        );
        const inStockProducts = res.data.filter((p) => p.stock > 0);
        setProducts(inStockProducts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const getAvailableStock = (product: Product) => {
    const inCart = cart.find((item) => item._id === product._id);
    return inCart ? product.stock - inCart.quantity : product.stock;
  };

  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "Everything" ? true : p.category === selectedCategory
    )
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-tr from-purple-50 via-pink-50 to-yellow-50">
      <div className=" px-3 sm:px-6">
        <div
          className="inline-flex mt-5 items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
          onClick={() => navigate("/")}
        >
          <Home size={24} className="text-white" />
          <span>Home</span>
        </div>

        <div className="px-3 sm:px-6 flex justify-end items-start gap-3 -mt-16">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 sm:w-72 px-4 py-2 pl-10 mt-2 bg-white rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all duration-300 hover:shadow-lg"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-7 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1012 19.5a7.5 7.5 0 004.65-2.85z"
              />
            </svg>
          </div>

          <div
            className="relative bg-white shadow-xl rounded-full p-4 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
            onClick={() => {
              setIsCartOpen(true);
              setShowCartNotification(false);
            }}
          >
            <ShoppingCart size={28} className="text-blue-600" />
            {showCartNotification && cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                {cart.length}
              </span>
            )}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl heading-shadow font-extrabold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-5 text-sm sm:text-base">
            Discover our premium furniture collection, combining style, comfort,
            and quality. Elevate your living spaces with elegant, functional,
            and timeless designs.
          </p>
        </div>
      </div>

      <div className="px-3 sm:px-6 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {[
              "Everything",
              "Jackets",
              "Jeans",
              "Boots and Shocks",
              "Bags",
              "Others",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium shadow-lg transition-all duration-300 transform hover:translate-y-1 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:shadow-xl"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 px-2 sm:px-5 pb-16">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="group relative bg-white border border-gray-300 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 p-4 sm:p-6 text-center cursor-pointer"
              onClick={() => openModal(product)}
            >
              <div className="absolute top-4 left-4 z-50">
                {product.discountPrice && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 z-50 rounded-full shadow-md">
                    -
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className="absolute top-4 right-4 bg-gray-200/80 border border-gray-200 p-2 rounded-full shadow-md hover:bg-red-100 transition"
              >
                <Heart
                  size={20}
                  className="w-5 h-5"
                  color={
                    wishlist.some((item) => item._id === product._id)
                      ? "red"
                      : "gray"
                  }
                  fill={
                    wishlist.some((item) => item._id === product._id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              <div className="flex justify-center mb-4 z-10">
                <img
                  src={product.images[0]}
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 object-cover rounded-xl drop-shadow-xl group-hover:opacity-90 transition"
                />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-4 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${product.discountPrice ?? product.price}
                </p>
                {product.discountPrice && (
                  <p className="text-xs sm:text-sm font-semibold text-red-500 line-through">
                    ${product.price}
                  </p>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="mt-2 sm:mt-4 w-full py-2 sm:py-3 border-2 border-purple-500 text-purple-600 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300"
              >
                ADD TO CART
              </button>
            </motion.div>
          ))}
        </div>

        {isCartOpen && (
          <div className="fixed inset-0 z-[999] flex justify-end">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-xs sm:max-w-sm md:w-[380px] h-full bg-white/80 backdrop-blur-xl shadow-2xl border-l border-white/30 flex flex-col rounded-l-3xl overflow-hidden"
            >
              <button
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow hover:bg-white transition"
                onClick={() => setIsCartOpen(false)}
              >
                <X size={20} className="text-gray-700" />
              </button>

              <div className="px-6 pt-10 pb-4 border-b border-gray-200/50">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Your Cart
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 custom-scroll relative">
                {cart.length === 0 && (
                  <p className="text-center text-gray-500 mt-10 text-lg">
                    Your cart is empty 🛒
                  </p>
                )}

                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 sm:gap-4 bg-white/90 backdrop-blur rounded-xl p-2 sm:p-3 shadow-md hover:shadow-xl transition hover:scale-[1.02]"
                  >
                    <img
                      src={item.images[0]}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {item.name}
                      </h3>
                      <p className="text-blue-600 font-bold text-xs sm:text-sm">
                        ${item.discountPrice} × {item.quantity}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Total: $
                        {(item.discountPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition shadow-sm"
                    >
                      <Trash className="text-red-500" size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="sticky bottom-0 w-full px-6 py-5 bg-white/20 backdrop-blur-lg border-t border-gray-200/30 shadow-inner rounded-t-3xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-semibold text-lg sm:text-xl">
                    Total:
                  </span>
                  <span className="text-gray-700 font-extrabold text-xl sm:text-2xl">
                    $
                    {cart
                      .reduce(
                        (acc, item) => acc + item.discountPrice * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/userOrder")}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 sm:py-4 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300"
                >
                  Checkout
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 sm:h-5 w-4 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-2xl md:max-w-3xl h-auto md:h-[360px] flex flex-col md:flex-row overflow-hidden relative"
            >
              <button
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

              <div className="md:w-1/2 p-3 sm:p-4 flex flex-col items-center overflow-auto">
                <img
                  src={selectedImage}
                  className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover rounded-2xl mt-2 sm:mt-4 shadow-lg mb-3"
                />
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      onClick={() => setSelectedImage(img)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg cursor-pointer border-2 ${
                        selectedImage === img
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="md:w-1/2 p-3 sm:p-5 flex flex-col mt-3 md:mt-5 justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-3">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < (selectedProduct.rating || 4)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                          size={14}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      ({selectedProduct.reviews || 0})
                    </span>
                  </div>

                  <p className="text-green-600 font-medium mb-2 sm:mb-3">
                    {getAvailableStock(selectedProduct)} in stock
                  </p>

                  {selectedProduct.features &&
                    selectedProduct.features.length > 0 && (
                      <ul className="list-disc pl-4 text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                        {selectedProduct.features.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    )}
                </div>

                <div className="flex items-center justify-between mt-1 sm:mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button
                      className="px-2 sm:px-3 py-1"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-3">{quantity}</span>
                    <button
                      className="px-2 sm:px-3 py-1"
                      disabled={quantity >= getAvailableStock(selectedProduct)}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                    $
                    {(
                      (selectedProduct.discountPrice ?? selectedProduct.price) *
                      quantity
                    ).toFixed(2)}
                    {selectedProduct.discountPrice && (
                      <span className="text-gray-400 line-through text-xs sm:text-sm ml-2">
                        ${(selectedProduct.price * quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct, quantity)}
                  className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:scale-105 transition transform"
                  disabled={getAvailableStock(selectedProduct) <= 0}
                >
                  <ShoppingCart size={16} className="inline mr-2" /> Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
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
    .heading-shadow {
      font-size: 2.6rem !important;
      line-height: 3rem !important;
      margin-top: 0.5rem !important;
    }

    .grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 1rem !important;
    }

    .group {
      padding: 1.2rem !important;
    }

    img {
      width: 8.5rem !important;
      height: 8.5rem !important;
    }

    h3 {
      font-size: 1.05rem !important;
    }

    p {
      font-size: 0.85rem !important;
      line-height: 1.25rem !important;
    }

    button.absolute {
      top: 8px !important;
      right: 8px !important;
      padding: 0.4rem !important;
    }

    button.absolute svg {
      width: 18px !important;
      height: 18px !important;
    }

    button {
      padding: 0.6rem 1.2rem !important;
      font-size: 0.9rem !important;
    }

    .md\\:w-\\[380px\\] {
      width: 340px !important;
    }
  }

  @media (max-width: 480px) {
    .search-bar {
      display: none !important;
    }

    .heading-shadow {
      font-size: 1.75rem !important;
      line-height: 2.2rem !important;
      margin-top: 1rem !important;
    }

    .backdrop-blur-lg {
      padding: 0.9rem !important;
      border-radius: 1.5rem !important;
    }

    .grid {
      grid-template-columns: 1fr !important;
      gap: 0.75rem !important;
    }

    .max-w-[270px] {
      max-width: 92% !important;
    }

    img {
      width: 6.5rem !important;
      height: 6.5rem !important;
    }

    p {
      font-size: 0.78rem !important;
      line-height: 1.1rem !important;
    }

    button.absolute {
      top: 6px !important;
      right: 6px !important;
      padding: 0.3rem !important;
    }

    button.absolute svg {
      width: 14px !important;
      height: 14px !important;
    }
  }
`}</style>
      </div>
    </div>
  );
}
