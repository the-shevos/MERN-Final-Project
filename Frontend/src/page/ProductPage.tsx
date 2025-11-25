import React, { useEffect, useState } from "react";
import axios from "axios";

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

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (files: FileList) => {
    setFormData({ ...formData, images: Array.from(files) });
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
      } else {
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

      const res = await axios.get("http://localhost:3000/api/v1/products");
      setProducts(res.data);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      images: [],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
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
    });
    setEditingProductId(null);
    setModalOpen(false);
  };

  if (loading)
    return <p className="text-center text-white mt-10">Loading products...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <button
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition"
          onClick={() => setModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {p.images[0] && (
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-500 text-sm">{p.category}</p>
              <p className="text-gray-600 text-sm mt-1">{p.description}</p>
              <p className="text-gray-700 mt-1">
                $
                {p.discountPrice ? (
                  <span className="line-through mr-2">{p.price}</span>
                ) : (
                  p.price
                )}
                {p.discountPrice && (
                  <span className="text-red-500 font-bold">
                    {p.discountPrice}
                  </span>
                )}
              </p>
              <p className="text-gray-600 text-sm mt-1">Stock: {p.stock}</p>
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-600 font-bold text-xl"
              onClick={resetForm}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingProductId ? "Edit Product" : "Add Product"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="number"
              name="discountPrice"
              placeholder="Discount Price"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <div className="mb-3">
              <label className="block mb-2 font-medium text-gray-700">
                Product Images
              </label>
              <div
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                <p className="text-gray-500 text-sm">
                  Click or drag images here (max 5)
                </p>
                <input
                  type="file"
                  id="imageInput"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleFileChange(e.target.files)
                  }
                />
              </div>
              {formData.images && formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.images.map((file: File, index: number) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 border rounded overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            images: formData.images.filter(
                              (_: any, i: number) => i !== index
                            ),
                          })
                        }
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
