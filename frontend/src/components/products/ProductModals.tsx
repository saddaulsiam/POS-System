import React from "react";
import { toast } from "react-hot-toast";
import { Product, Category, Supplier } from "../../types";

interface ProductModalsProps {
  // Add Modal
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  form: any;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddProduct: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  categories: Category[];
  suppliers: Supplier[];
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;

  // Edit Modal
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editProduct: Product | null;
  setEditProduct: (product: Product | null) => void;
  handleUpdateProduct: (e: React.FormEvent) => void;

  // Delete Modal
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  deletingId: number | null;
  setDeletingId: (id: number | null) => void;
  confirmDeleteProduct: () => void;

  // Print Modal
  showPrintModal: boolean;
  setShowPrintModal: (show: boolean) => void;
  printProduct: Product | null;
  setPrintProduct: (product: Product | null) => void;
  printCopies: number;
  setPrintCopies: (copies: number) => void;
  printBarcodeLabel: (product: Product, copies: number) => void;

  // Import Modal
  showImportModal: boolean;
  setShowImportModal: (show: boolean) => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  isImporting: boolean;
  handleImportCSV: () => void;
  handleDownloadTemplate: () => void;
}

export const ProductModals: React.FC<ProductModalsProps> = ({
  showAddModal,
  setShowAddModal,
  form,
  handleFormChange,
  handleAddProduct,
  isSubmitting,
  categories,
  suppliers,
  setImageFile,
  imagePreview,
  setImagePreview,
  showEditModal,
  setShowEditModal,
  editProduct,
  handleUpdateProduct,
  showDeleteConfirm,
  setShowDeleteConfirm,
  setDeletingId,
  confirmDeleteProduct,
  showPrintModal,
  setShowPrintModal,
  printProduct,
  setPrintProduct,
  printCopies,
  setPrintCopies,
  printBarcodeLabel,
  showImportModal,
  setShowImportModal,
  importFile,
  setImportFile,
  isImporting,
  handleImportCSV,
  handleDownloadTemplate,
}) => {
  return (
    <>
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleUpdateProduct}>
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
    </>
  );
};
