import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, X, Trash } from "lucide-react";
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

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved).map((item: any) => ({
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

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="fixed top-6 right-6 z-50 cursor-pointer">
        <div
          className="relative bg-white shadow-xl rounded-full p-4 hover:shadow-2xl transition"
          onClick={() => {
            setIsCartOpen(true);
            setShowCartNotification(false);
          }}
        >
          <ShoppingCart size={28} className="text-blue-600" />
          {showCartNotification && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {cart.length}
            </span>
          )}
        </div>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 text-center mb-16">
        Our Products
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition cursor-pointer"
          >
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-64 object-cover rounded-t-3xl transition-transform duration-500 group-hover:scale-105"
              onClick={() => openModal(product)}
            />
            <div className="p-6 flex flex-col justify-between">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-yellow-400" size={16} />
                <span>{product.rating || 0}</span>
                <span className="text-gray-400">({product.reviews || 0})</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  ${product.discountPrice ?? product.price}
                </p>
                {product.discountPrice && (
                  <p className="text-gray-400 line-through">{product.price}</p>
                )}
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:bg-blue-700 transition flex-1 justify-center"
                  disabled={getAvailableStock(product) <= 0}
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button className="ml-2 bg-gray-100 p-2 rounded-xl hover:bg-gray-200 transition">
                  <Heart size={20} className="text-red-500" />
                </button>
              </div>
              {getAvailableStock(product) <= 0 && (
                <p className="text-red-500 mt-2 text-sm">Out of stock</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 bg-white h-full shadow-xl p-6 flex flex-col relative"
          >
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsCartOpen(false)}
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {cart.length === 0 && (
                <p className="text-center text-gray-500">Cart is empty</p>
              )}
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-gray-100 p-3 rounded-xl"
                >
                  <img
                    src={item.images[0]}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-blue-600 font-bold">
                      ${item.discountPrice} × {item.quantity}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Total: ${(item.discountPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button onClick={() => removeFromCart(item._id)}>
                    <Trash className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="text-xl font-bold">
                  Total: $
                  {cart
                    .reduce(
                      (sum, item) => sum + item.discountPrice * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mt-4 hover:bg-green-700">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
          >
            <button
              className="absolute top-4 right-4 p-3 rounded-full bg-gray-100"
              onClick={closeModal}
            >
              <X size={20} />
            </button>

            <div className="md:w-1/2 p-6 flex flex-col items-center">
              <img
                src={selectedImage}
                className="w-80 h-80 object-cover rounded-2xl shadow mb-4"
              />
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg cursor-pointer border-2 ${
                      selectedImage === img
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="md:w-1/2 p-6">
              <h2 className="text-3xl font-bold mb-4">
                {selectedProduct.name}
              </h2>
              <p className="text-gray-700 mb-4">
                {selectedProduct.description}
              </p>
              <p className="text-green-600 mb-4">
                {getAvailableStock(selectedProduct)} in stock
              </p>

              <div className="flex items-center gap-3 mb-6">
                <span>Quantity:</span>
                <div className="flex items-center border rounded">
                  <button
                    className="px-3 py-1"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-3">{quantity}</span>
                  <button
                    className="px-3 py-1"
                    disabled={quantity >= getAvailableStock(selectedProduct)}
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-3xl font-bold text-blue-600 mb-6">
                $
                {(
                  selectedProduct.discountPrice ??
                  selectedProduct.price * quantity
                ).toFixed(2)}
                <span className="text-gray-400 line-through text-xl">
                  ${(selectedProduct.price * quantity).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => addToCart(selectedProduct, quantity)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
                disabled={getAvailableStock(selectedProduct) <= 0}
              >
                <ShoppingCart size={20} className="inline mr-2" /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
