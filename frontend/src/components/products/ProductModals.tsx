import React from "react";
import { toast } from "react-hot-toast";
import { Product, Category, Supplier } from "../../types";
import { Button } from "../common";
import { Input, Select } from "../common/Input";

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
                <Input
                  name="name"
                  label={"Name"}
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. Coca Cola 500ml"
                />
              </div>
              <div>
                <Input
                  name="sku"
                  label={"SKU"}
                  value={form.sku}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. CC500ML"
                />
              </div>
              <div>
                <Input
                  name="barcode"
                  label={"Barcode (optional, company default)"}
                  value={form.barcode}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 123456789012"
                  maxLength={32}
                />
              </div>
              <div>
                <Select
                  name="categoryId"
                  label="Category"
                  value={form.categoryId}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  options={[
                    { value: "", label: "Select category" },
                    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
                  ]}
                />
              </div>
              <div>
                <Select
                  name="supplierId"
                  label="Supplier"
                  value={form.supplierId}
                  onChange={handleFormChange}
                  fullWidth
                  options={[
                    { value: "", label: "Select supplier (optional)" },
                    ...suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name })),
                  ]}
                />
              </div>
              <div>
                <Input
                  name="purchasePrice"
                  label="Purchase Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 10.00"
                />
                <span className="text-xs text-gray-400">The cost you pay to acquire this product.</span>
              </div>
              <div>
                <Input
                  name="sellingPrice"
                  label="Selling Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 15.00"
                />
                <span className="text-xs text-gray-400">The price at which you sell this product.</span>
              </div>
              <div>
                <Input
                  name="stockQuantity"
                  label="Stock Quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 100"
                />
                <span className="text-xs text-gray-400">Initial stock available for this product.</span>
              </div>
              <div>
                <Input
                  name="lowStockThreshold"
                  label="Low Stock Threshold"
                  type="number"
                  min="0"
                  step="1"
                  value={form.lowStockThreshold}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 10"
                />
                <span className="text-xs text-gray-400">Get notified when stock falls below this number.</span>
              </div>
              <div>
                <Input
                  name="taxRate"
                  label="Tax Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.taxRate}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 5"
                />
                <span className="text-xs text-gray-400">Leave 0 if not applicable.</span>
              </div>
              <div className="flex space-x-10">
                <div className="flex items-center mt-2">
                  <input
                    id="isWeighted"
                    name="isWeighted"
                    type="checkbox"
                    checked={form.isWeighted}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isWeighted" className="text-sm font-medium">
                    Weighted Product
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
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
                <Input
                  name="name"
                  label={"Name"}
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. Coca Cola 500ml"
                />
              </div>
              <div>
                <Input
                  name="sku"
                  label={"SKU"}
                  value={form.sku}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. CC500ML"
                />
              </div>
              <div>
                <Input
                  name="barcode"
                  label={"Barcode (optional, company default)"}
                  value={form.barcode}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 123456789012"
                  maxLength={32}
                />
              </div>
              <div>
                <Select
                  name="categoryId"
                  label="Category"
                  value={form.categoryId}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  options={[
                    { value: "", label: "Select category" },
                    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
                  ]}
                />
              </div>
              <div>
                <Select
                  name="supplierId"
                  label="Supplier"
                  value={form.supplierId}
                  onChange={handleFormChange}
                  fullWidth
                  options={[
                    { value: "", label: "Select supplier (optional)" },
                    ...suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name })),
                  ]}
                />
              </div>
              <div>
                <Input
                  name="purchasePrice"
                  label="Purchase Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 10.00"
                />
                <span className="text-xs text-gray-400">The cost you pay to acquire this product.</span>
              </div>
              <div>
                <Input
                  name="sellingPrice"
                  label="Selling Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 15.00"
                />
                <span className="text-xs text-gray-400">The price at which you sell this product.</span>
              </div>
              <div>
                <Input
                  name="stockQuantity"
                  label="Stock Quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 100"
                />
                <span className="text-xs text-gray-400">Current stock available for this product.</span>
              </div>
              <div>
                <Input
                  name="lowStockThreshold"
                  label="Low Stock Threshold"
                  type="number"
                  min="0"
                  step="1"
                  value={form.lowStockThreshold}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 10"
                />
                <span className="text-xs text-gray-400">Get notified when stock falls below this number.</span>
              </div>
              <div>
                <Input
                  name="taxRate"
                  label="Tax Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.taxRate}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 5"
                />
                <span className="text-xs text-gray-400">Leave 0 if not applicable.</span>
              </div>
              <div className="flex space-x-10">
                <div className="flex items-center mt-2">
                  <input
                    id="isWeighted"
                    name="isWeighted"
                    type="checkbox"
                    checked={form.isWeighted}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isWeighted" className="text-sm font-medium">
                    Weighted Product
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 mt-2">
                <Button type="submit" variant="primary" fullWidth size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeletingId(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingId(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteProduct}>
                Delete
              </Button>
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
              <Button
                variant="warning"
                onClick={() => {
                  printBarcodeLabel(printProduct, printCopies);
                  setShowPrintModal(false);
                  setPrintProduct(null);
                  setPrintCopies(1);
                }}
              >
                🖨️ Print
              </Button>
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

            <Button
              variant="warning"
              fullWidth
              size="lg"
              onClick={handleImportCSV}
              disabled={!importFile || isImporting}
            >
              {isImporting ? "Importing..." : "Import Products"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
