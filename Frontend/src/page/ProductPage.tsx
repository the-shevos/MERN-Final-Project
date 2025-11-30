import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  createdAt: string;
}

type FilterType = "all" | "discounted" | "inStock" | "outOfStock";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    images: [] as File[],
    imagePreviews: [] as string[],
  });

  const productsPerPage = 8;
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
  }, [modalOpen]);

  const filteredProducts = products.filter((p) => {
    if (filter === "discounted") return p.discountPrice != null;
    if (filter === "inStock") return p.stock > 0;
    if (filter === "outOfStock") return p.stock === 0;
    return true;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (files: FileList) => {
    const selectedFiles = Array.from(files);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: selectedFiles,
      imagePreviews: previews,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      discountPrice: "",
      stock: "",
      images: [],
      imagePreviews: [],
    });
    setEditingProductId(null);
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Name, Price, and Stock are required");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file: File) => data.append("images", file));
      } else if (key !== "imagePreviews") {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingProductId) {
        await axios.put(
          `http://localhost:3000/api/v1/products/${editingProductId}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Product updated");
      } else {
        await axios.post("http://localhost:3000/api/v1/products", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product added");
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  const handleEdit = (p: Product) => {
    setEditingProductId(p._id);
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || "",
      stock: p.stock,
      images: [],
      imagePreviews: p.images || [],
    });
    setModalOpen(true);
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-xl text-gray-500">Loading...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-8">
        My Products
      </h1>

      <div className="flex flex-wrap items-center ml-[80px] gap-4 mb-8">
        <div className="flex flex-wrap gap-4">
          {(["all", "discounted", "inStock", "outOfStock"] as FilterType[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 rounded-full cursor-pointer font-medium transition-all duration-200 ${
                  filter === f
                    ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {f === "all"
                  ? "All Products"
                  : f === "discounted"
                  ? "Discounted"
                  : f === "inStock"
                  ? "In Stock"
                  : "Out of Stock"}
              </button>
            )
          )}
        </div>

        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition ml-auto"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((p) => (
          <div
            key={p._id}
            className="relative bg-white border border-gray-300 rounded-2xl shadow hover:shadow-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-[1.03]"
          >
            <span
              className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                p.stock > 0
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {p.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>

            {p.discountPrice && (
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-yellow-400 text-purple-800 font-semibold text-xs">
                -{Math.round(((p.price - p.discountPrice) / p.price) * 100)}%
              </span>
            )}

            <div className="mb-2">
              {(p.images.length > 0 ? p.images.slice(0, 2) : []).map(
                (img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${p.name}-${i}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )
              )}
            </div>

            <h2 className="text-gray-800 font-bold text-lg mb-1">{p.name}</h2>
            <p className="text-gray-500 text-sm mb-1">{p.category}</p>
            <p className="text-gray-400 text-xs mb-2">
              Added: {new Date(p.createdAt).toLocaleDateString()}
            </p>

            <p className="text-gray-700 font-semibold mb-3">
              {p.discountPrice ? (
                <>
                  <span className="line-through text-gray-400 mr-2">
                    ${p.price}
                  </span>
                  <span className="text-red-500">${p.discountPrice}</span>
                </>
              ) : (
                `$${p.price}`
              )}
            </p>

            <div className="flex gap-3 mt-auto justify-end w-full">
              <button
                onClick={() => handleEdit(p)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-2 text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-5">
              {editingProductId ? "Edit Product" : "Add Product"}
            </h2>

            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition-transform hover:scale-125"
              onClick={resetForm}
            >
              &times;
            </button>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <input
                  type="number"
                  name="discountPrice"
                  placeholder="Discount Price"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e.target.files!)}
                  className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
                />
              </div>

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
              />

              {formData.imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {formData.imagePreviews.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`preview-${idx}`}
                      className="w-full h-28 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition transform hover:scale-105 font-semibold mt-4 shadow-lg"
              >
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
