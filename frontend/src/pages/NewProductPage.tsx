import React, { useState, useEffect } from "react";
import { productsAPI, categoriesAPI, suppliersAPI } from "../services/api";
import { Category, Supplier } from "../types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common";

const NewProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    supplierId: "",
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
    loadSuppliers();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await categoriesAPI.getAll();
      setCategories(cats);
    } catch (error) {
      setCategories([]);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll({ limit: 1000 });
      console.log("✅ Loaded suppliers:", response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error("❌ Error loading suppliers:", error);
      setSuppliers([]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        supplierId: form.supplierId ? parseInt(form.supplierId) : undefined,
        purchasePrice: parseFloat(form.purchasePrice),
        sellingPrice: parseFloat(form.sellingPrice),
        stockQuantity: parseFloat(form.stockQuantity),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        isActive: form.isActive,
        isWeighted: form.isWeighted,
        taxRate: parseFloat(form.taxRate),
      };
      const product = await productsAPI.create(payload);

      // Upload image if selected
      if (imageFile && product.id) {
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
          await productsAPI.uploadImage(product.id, formData);
        } catch (error) {
          toast.error("Product created but image upload failed");
        }
      }

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
          Fill in the details below to add a new product to your inventory. A barcode will be automatically generated.
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddProduct}>
          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded border" />
              )}
            </div>
            <span className="text-xs text-gray-400 mt-1 block">
              Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
            </span>
          </div>

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
            <label className="block text-sm font-medium mb-1">Supplier</label>
            <select
              name="supplierId"
              value={form.supplierId}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select supplier (optional)</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
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
          <div className="flex space-x-10">
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
          </div>
          <div className="md:col-span-2 mt-2">
            <Button type="submit" variant="primary" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
