import React, { useState, useEffect } from "react";
import { productsAPI, categoriesAPI, suppliersAPI } from "../services/api";
import { Product, Category, Supplier } from "../types";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const canWrite = user?.role === "ADMIN" || user?.role === "MANAGER";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printProduct, setPrintProduct] = useState<Product | null>(null);
  const [printCopies, setPrintCopies] = useState(1);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
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
    image: "",
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    loadData();
    loadCategories();
    loadSuppliers();
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

  const loadSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll({ limit: 1000 });
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      setSuppliers([]);
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
      setForm({
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
        image: "",
      });
      setImageFile(null);
      setImagePreview("");
      setShowAddModal(false);
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

  const handleExportCSV = async () => {
    try {
      const blob = await productsAPI.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `products_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Products exported successfully");
    } catch (error: any) {
      toast.error("Failed to export products");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await productsAPI.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products_import_template.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error("Failed to download template");
    }
  };

  const handleImportCSV = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    setIsImporting(true);
    try {
      const result = await productsAPI.importCSV(importFile);

      if (result.invalid && result.invalid.length > 0) {
        const errorMessage = `Imported ${result.imported} products. ${result.skipped} rows had errors.`;
        toast.success(errorMessage);
        console.warn("Import validation errors:", result.invalid);
      } else {
        toast.success(`Successfully imported ${result.imported} products`);
      }

      setShowImportModal(false);
      setImportFile(null);
      loadData();
    } catch (error: any) {
      const errorData = error?.response?.data;
      if (errorData?.existingSkus) {
        toast.error(`Some SKUs already exist: ${errorData.existingSkus.join(", ")}`);
      } else if (errorData?.invalidCategoryIds) {
        toast.error(`Invalid category IDs: ${errorData.invalidCategoryIds.join(", ")}`);
      } else if (errorData?.invalidSupplierIds) {
        toast.error(`Invalid supplier IDs: ${errorData.invalidSupplierIds.join(", ")}`);
      } else if (errorData?.duplicates) {
        toast.error(`Duplicate SKUs in file: ${errorData.duplicates.join(", ")}`);
      } else {
        toast.error(errorData?.error || "Failed to import products");
      }
    } finally {
      setIsImporting(false);
    }
  };

  const printBarcodeLabel = (product: Product, copies: number = 1) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const labels = Array(copies)
        .fill(null)
        .map(
          () => `
        <div class="barcode-label">
          <div class="label-header">
            <h3>${product.name}</h3>
          </div>
          <div class="label-info">
            <div class="info-row">
              <span class="label">SKU:</span>
              <span class="value">${product.sku}</span>
            </div>
            <div class="info-row">
              <span class="label">Price:</span>
              <span class="value price">$${product.sellingPrice.toFixed(2)}</span>
            </div>
          </div>
          <div class="barcode-container">
            <img src="${productsAPI.getBarcodeImage(product.id)}" alt="Barcode" class="barcode-image"/>
          </div>
          <div class="barcode-text">${product.barcode}</div>
        </div>
      `
        )
        .join("");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode Labels - ${product.name}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: 'Arial', sans-serif;
                padding: 8mm;
                background: white;
              }

              .labels-container {
                display: flex;
                flex-wrap: wrap;
                gap: 4mm;
                justify-content: flex-start;
                align-content: flex-start;
              }

              .barcode-label {
                width: 60mm;
                height: 42mm;
                border: 1.5px solid #333;
                padding: 2mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                page-break-inside: avoid;
              }

              .label-header {
                text-align: center;
                border-bottom: 1px solid #333;
                padding-bottom: 1mm;
                margin-bottom: 1mm;
              }

              .label-header h3 {
                font-size: 9pt;
                font-weight: bold;
                color: #333;
                text-transform: uppercase;
                word-wrap: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .label-info {
                margin-bottom: 1mm;
              }

              .info-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5mm 0;
                font-size: 8pt;
              }

              .info-row .label {
                font-weight: bold;
                color: #666;
              }

              .info-row .value {
                color: #333;
              }

              .info-row .price {
                font-weight: bold;
                font-size: 9pt;
                color: #000;
              }

              .barcode-container {
                text-align: center;
                padding: 1mm 0;
                background: white;
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .barcode-image {
                max-width: 100%;
                max-height: 100%;
                height: auto;
              }

              .barcode-text {
                text-align: center;
                font-family: 'Courier New', monospace;
                font-size: 7pt;
                font-weight: bold;
                letter-spacing: 0.5px;
                color: #333;
                margin-top: 0.5mm;
              }

              @media print {
                @page {
                  size: A4;
                  margin: 8mm;
                }

                body {
                  padding: 0;
                  background: white;
                }

                .labels-container {
                  gap: 4mm;
                }

                .barcode-label {
                  border: 1.5px solid #000;
                  page-break-inside: avoid;
                }

                .labels-container {
                  gap: 5mm;
                }
              }

              @page {
                size: A4;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
            <div class="labels-container">
              ${labels}
            </div>
            <script>
              window.onload = function() {
                const images = document.getElementsByTagName('img');
                let loaded = 0;
                const total = images.length;
                
                if (total === 0) {
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => window.close(), 100);
                  }, 250);
                  return;
                }

                for (let i = 0; i < total; i++) {
                  if (images[i].complete) {
                    loaded++;
                  } else {
                    images[i].onload = function() {
                      loaded++;
                      if (loaded === total) {
                        setTimeout(() => {
                          window.print();
                          setTimeout(() => window.close(), 100);
                        }, 250);
                      }
                    };
                    images[i].onerror = function() {
                      loaded++;
                      if (loaded === total) {
                        setTimeout(() => {
                          window.print();
                          setTimeout(() => window.close(), 100);
                        }, 250);
                      }
                    };
                  }
                }

                if (loaded === total) {
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => window.close(), 100);
                  }, 250);
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
          {canWrite && (
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-150 hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
                onClick={handleExportCSV}
                title="Export products to CSV"
              >
                📥 Export
              </button>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-150 hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 font-semibold"
                onClick={() => setShowImportModal(true)}
                title="Import products from CSV"
              >
                📤 Import
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold tracking-wide"
                onClick={() => setShowAddModal(true)}
              >
                Add New Product
              </button>
            </div>
          )}
        </div>

        {/* Print Barcode Modal */}
        {showPrintModal && printProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => {
                  setShowPrintModal(false);
                  setPrintProduct(null);
                  setPrintCopies(1);
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Print Barcode Labels</h2>
              <p className="mb-4 text-gray-600 text-sm text-center">
                Print barcode labels for: <strong>{printProduct.name}</strong>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Number of Labels</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={printCopies}
                  onChange={(e) => setPrintCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                />
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2">Quick Select:</p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPrintCopies(num)}
                      className={`px-3 py-2 rounded-lg border transition-all duration-150 ${
                        printCopies === num
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Labels will be arranged on A4 paper. 18 labels will fit per page (3 columns × 6
                  rows).
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    setPrintProduct(null);
                    setPrintCopies(1);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-150 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    printBarcodeLabel(printProduct, printCopies);
                    setShowPrintModal(false);
                    setPrintProduct(null);
                    setPrintCopies(1);
                  }}
                  className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-purple-700 hover:shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                >
                  🖨️ Print
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Import Products</h2>
              <p className="mb-4 text-gray-600 text-sm">
                Upload a CSV file to import multiple products at once. Make sure your CSV follows the correct format.
              </p>

              <div className="mb-4">
                <button
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-150 font-medium mb-2"
                  onClick={handleDownloadTemplate}
                >
                  📄 Download Template CSV
                </button>
                <p className="text-xs text-gray-500">
                  Download a template file to see the correct format for importing products.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {importFile && <p className="text-sm text-gray-600 mt-2">Selected: {importFile.name}</p>}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-xs text-blue-800 font-semibold mb-1">Important Notes:</p>
                <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>SKUs must be unique</li>
                  <li>Category IDs must exist in your database</li>
                  <li>Supplier IDs are optional but must exist if provided</li>
                  <li>All prices must be positive numbers</li>
                </ul>
              </div>

              <button
                onClick={handleImportCSV}
                disabled={!importFile || isImporting}
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              >
                {isImporting ? "Importing..." : "Import Products"}
              </button>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => {
                  setShowAddModal(false);
                  setImageFile(null);
                  setImagePreview("");
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">Add New Product</h2>
              <p className="mb-4 text-gray-500 text-sm text-center">
                Fill in the details below to add a new product to your inventory.
              </p>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddProduct}>
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
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
                      }}
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

        {/* Products Table or Loading */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-800">
              Products List{" "}
              <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length} items)</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 mt-4 font-medium">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first product</p>
              {canWrite && (
                <button
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SKU / Barcode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      {/* Product Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            {product.supplierId && (
                              <p className="text-xs text-gray-500">
                                Supplier: {suppliers.find((s) => s.id === product.supplierId)?.name || "-"}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU / Barcode Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{product.sku}</p>
                          {product.barcode && <p className="text-xs text-gray-500 font-mono">{product.barcode}</p>}
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {categories.find((c) => c.id === product.categoryId)?.name || "-"}
                        </span>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-green-700">${product.sellingPrice.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Cost: ${product.purchasePrice.toFixed(2)}</p>
                        </div>
                      </td>

                      {/* Stock Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              product.stockQuantity <= product.lowStockThreshold
                                ? "bg-red-100 text-red-800"
                                : product.stockQuantity <= product.lowStockThreshold * 2
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.stockQuantity} units
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              product.isActive ? "bg-green-600" : "bg-gray-600"
                            }`}
                          ></span>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {product.barcode && (
                            <button
                              onClick={() => {
                                setPrintProduct(product);
                                setPrintCopies(1);
                                setShowPrintModal(true);
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Print Barcode"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                              </svg>
                            </button>
                          )}
                          {canWrite && (
                            <>
                              <button
                                onClick={() => {
                                  setEditProduct(product);
                                  setForm({
                                    name: product.name,
                                    sku: product.sku,
                                    categoryId: product.categoryId.toString(),
                                    supplierId: product.supplierId?.toString() || "",
                                    purchasePrice: product.purchasePrice.toString(),
                                    sellingPrice: product.sellingPrice.toString(),
                                    stockQuantity: product.stockQuantity.toString(),
                                    lowStockThreshold: product.lowStockThreshold.toString(),
                                    isActive: product.isActive,
                                    isWeighted: product.isWeighted,
                                    taxRate: product.taxRate.toString(),
                                    image: product.image || "",
                                  });
                                  setImagePreview(product.image || "");
                                  setShowEditModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await productsAPI.update(product.id, { isActive: !product.isActive });
                                    setProducts((prev) =>
                                      prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
                                    );
                                    toast.success(`Product ${!product.isActive ? "activated" : "deactivated"}`);
                                  } catch {
                                    toast.error("Failed to update status");
                                  }
                                }}
                                className={`p-2 rounded-lg transition-colors ${
                                  product.isActive
                                    ? "text-green-600 hover:bg-green-50"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                                title={product.isActive ? "Deactivate" : "Activate"}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                      product.isActive
                                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    }
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deletingId === product.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete Product"
                              >
                                {deletingId === product.id ? (
                                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Product Modal */}
        {showEditModal && editProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => {
                  setShowEditModal(false);
                  setImageFile(null);
                  setImagePreview("");
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">Edit Product</h2>
              <p className="mb-4 text-gray-500 text-sm text-center">
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
                      supplierId: form.supplierId ? parseInt(form.supplierId) : undefined,
                      purchasePrice: parseFloat(form.purchasePrice),
                      sellingPrice: parseFloat(form.sellingPrice),
                      stockQuantity: parseFloat(form.stockQuantity),
                      lowStockThreshold: parseInt(form.lowStockThreshold),
                      isActive: form.isActive,
                      isWeighted: form.isWeighted,
                      taxRate: parseFloat(form.taxRate),
                    };
                    await productsAPI.update(editProduct.id, payload);

                    // Upload image if selected
                    if (imageFile && editProduct.id) {
                      const formData = new FormData();
                      formData.append("image", imageFile);
                      try {
                        await productsAPI.uploadImage(editProduct.id, formData);
                      } catch (error) {
                        toast.error("Product updated but image upload failed");
                      }
                    }

                    toast.success("Product updated successfully");
                    setShowEditModal(false);
                    setEditProduct(null);
                    setImageFile(null);
                    setImagePreview("");
                    loadData();
                  } catch (error: any) {
                    toast.error(error?.response?.data?.error || "Failed to update product");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
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
                      }}
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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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
  );
};

export default ProductsPage;
