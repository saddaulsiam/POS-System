import React, { useState, useEffect } from "react";
import { productsAPI, categoriesAPI } from "../services/api";
import { Product, Category } from "../types";
import toast from "react-hot-toast";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
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
    image: "",
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const productsResponse = await productsAPI.getAll({ page: 1, limit: 50 });
      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

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
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
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
        image: form.image || undefined,
      };
      await productsAPI.create(payload);
      toast.success("Product added successfully");
      setForm({
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
        image: "",
      });
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    if (deletingId === null) return;
    try {
      await productsAPI.delete(deletingId);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.id !== deletingId));
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to delete product");
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.categoryId === parseInt(categoryFilter) : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Products Management</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              className="border rounded px-3 py-2 w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold tracking-wide"
            onClick={() => setShowAddModal(true)}
          >
            Add New Product
          </button>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-700">Add New Product</h2>
              <p className="mb-4 text-gray-500 text-sm">
                Fill in the details below to add a new product to your inventory.
              </p>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddProduct}>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setForm((prev) => ({ ...prev, image: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {form.image && (
                      <img src={form.image} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
                    )}
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
                <div className="flex items-center mt-6">
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
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Products ({filteredProducts.length})</h2>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No products found. Try adjusting your search or filters.</p>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold tracking-wide"
                onClick={() => setShowAddModal(true)}
              >
                Add New Product
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 bg-white hover:shadow-lg transition-shadow flex gap-4 items-center"
                >
                  <div className="flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded border" />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded border text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
                      <span>SKU: {product.sku}</span>
                      <span>Category: {categories.find((c) => c.id === product.categoryId)?.name || "-"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
                      <span>Price: ${product.sellingPrice}</span>
                      <span>Stock: {product.stockQuantity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      className={`px-2 py-1 rounded-lg text-xs font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        product.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-400"
                          : "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-400"
                      }`}
                      onClick={async () => {
                        try {
                          await productsAPI.update(product.id, { isActive: !product.isActive });
                          setProducts((prev) =>
                            prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
                          );
                          toast.success(`Product marked as ${!product.isActive ? "Active" : "Inactive"}`);
                        } catch {
                          toast.error("Failed to update status");
                        }
                      }}
                      title={product.isActive ? "Click to deactivate" : "Click to activate"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      className="text-blue-600 hover:bg-blue-50 hover:underline text-xs rounded-lg px-2 py-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                      onClick={() => {
                        setEditProduct(product);
                        setForm({
                          name: product.name,
                          sku: product.sku,
                          categoryId: product.categoryId.toString(),
                          purchasePrice: product.purchasePrice.toString(),
                          sellingPrice: product.sellingPrice.toString(),
                          stockQuantity: product.stockQuantity.toString(),
                          lowStockThreshold: product.lowStockThreshold.toString(),
                          isActive: product.isActive,
                          isWeighted: product.isWeighted,
                          taxRate: product.taxRate.toString(),
                          image: product.image || "",
                        });
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-50 hover:underline text-xs rounded-lg px-2 py-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Edit Product Modal */}
          {showEditModal && editProduct && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-2 text-blue-700">Edit Product</h2>
                <p className="mb-4 text-gray-500 text-sm">
                  Update the details below and save to apply changes to this product.
                </p>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={async (e) => {
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
                        image: form.image || undefined,
                      };
                      await productsAPI.update(editProduct.id, payload);
                      toast.success("Product updated successfully");
                      setShowEditModal(false);
                      setEditProduct(null);
                      loadData();
                    } catch (error: any) {
                      toast.error(error?.response?.data?.error || "Failed to update product");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <span className="text-xs text-gray-400">Current stock available for this product.</span>
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
                  <div className="flex items-center mt-6">
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
                      className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold shadow"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-150 shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletingId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-150 shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    onClick={confirmDeleteProduct}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
