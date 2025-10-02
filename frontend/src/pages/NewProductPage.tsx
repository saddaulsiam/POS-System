import React, { useState, useEffect } from "react";
import { productsAPI, categoriesAPI } from "../services/api";
import { Category } from "../types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NewProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    lowStockThreshold: "10",
    isActive: true,
    isWeighted: false,
    taxRate: "0",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await categoriesAPI.getAll();
      setCategories(cats);
    } catch (error) {
      setCategories([]);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        categoryId: parseInt(form.categoryId),
        purchasePrice: parseFloat(form.purchasePrice),
        sellingPrice: parseFloat(form.sellingPrice),
        stockQuantity: parseFloat(form.stockQuantity),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        isActive: form.isActive,
        isWeighted: form.isWeighted,
        taxRate: parseFloat(form.taxRate),
      };
      await productsAPI.create(payload);
      toast.success("Product added successfully");
      navigate("/products");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">Add New Product</h2>
        <p className="mb-4 text-gray-500 text-sm text-center">
          Fill in the details below to add a new product to your inventory.
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddProduct}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Coca Cola 500ml"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. CC500ML"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Purchase Price <span className="text-red-500">*</span>
            </label>
            <input
              name="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              value={form.purchasePrice}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 10.00"
            />
            <span className="text-xs text-gray-400">The cost you pay to acquire this product.</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Selling Price <span className="text-red-500">*</span>
            </label>
            <input
              name="sellingPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.sellingPrice}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 15.00"
            />
            <span className="text-xs text-gray-400">The price at which you sell this product.</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              name="stockQuantity"
              type="number"
              min="0"
              step="1"
              value={form.stockQuantity}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 100"
            />
            <span className="text-xs text-gray-400">Initial stock available for this product.</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
            <input
              name="lowStockThreshold"
              type="number"
              min="0"
              step="1"
              value={form.lowStockThreshold}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 10"
            />
            <span className="text-xs text-gray-400">Get notified when stock falls below this number.</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
            <input
              name="taxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.taxRate}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 5"
            />
            <span className="text-xs text-gray-400">Leave 0 if not applicable.</span>
          </div>
          <div className="flex items-center mt-2">
            <input
              name="isWeighted"
              type="checkbox"
              checked={form.isWeighted}
              onChange={handleFormChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Weighted Product</label>
          </div>
          <div className="flex items-center mt-2">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleFormChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active</label>
          </div>
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
