import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Product } from "../../types";
import { quickSaleItemsAPI } from "../../services";
import { Button } from "../common";

interface QuickSaleItem {
  id: number;
  productId: number;
  displayName: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  product?: Product;
}

interface QuickSaleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

const COLOR_OPTIONS = [
  { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
  { value: "#10B981", label: "Green", class: "bg-green-500" },
  { value: "#F59E0B", label: "Orange", class: "bg-orange-500" },
  { value: "#EF4444", label: "Red", class: "bg-red-500" },
  { value: "#8B5CF6", label: "Purple", class: "bg-purple-500" },
  { value: "#EC4899", label: "Pink", class: "bg-pink-500" },
  { value: "#14B8A6", label: "Teal", class: "bg-teal-500" },
  { value: "#F97316", label: "Amber", class: "bg-amber-500" },
];

export const QuickSaleManager: React.FC<QuickSaleManagerProps> = ({ isOpen, onClose, product, onSuccess }) => {
  const [quickItems, setQuickItems] = useState<QuickSaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [sortOrder, setSortOrder] = useState(0);
  const [editingItem, setEditingItem] = useState<QuickSaleItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadQuickItems();
      if (product) {
        setDisplayName(product.name);
        // Find next available sort order
        const maxOrder = quickItems.length > 0 ? Math.max(...quickItems.map((i) => i.sortOrder)) : -1;
        setSortOrder(maxOrder + 1);
      }
    }
  }, [isOpen, product]);

  const loadQuickItems = async () => {
    try {
      setLoading(true);
      const response = await quickSaleItemsAPI.getAll();
      setQuickItems(response);
    } catch (error) {
      console.error("Error loading quick sale items:", error);
      toast.error("Failed to load quick sale items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQuickSale = async () => {
    if (!product && !editingItem) return;

    if (!displayName.trim()) {
      toast.error("Display name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingItem) {
        // Update existing item
        await quickSaleItemsAPI.update(editingItem.id, {
          displayName: displayName.trim(),
          color: selectedColor,
          sortOrder,
        });
        toast.success("Quick Sale item updated!");
        setEditingItem(null);
      } else if (product) {
        // Create new item
        await quickSaleItemsAPI.create({
          productId: product.id,
          displayName: displayName.trim(),
          color: selectedColor,
          sortOrder,
        });
        toast.success("Added to Quick Sale!");
      }

      loadQuickItems();
      onSuccess();

      // Reset form
      setDisplayName("");
      setSelectedColor("#3B82F6");
      setSortOrder(0);
    } catch (error: any) {
      console.error("Error saving quick sale item:", error);
      toast.error(error.response?.data?.error || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromQuickSale = async (itemId: number) => {
    if (!confirm("Remove this item from Quick Sale?")) return;

    try {
      await quickSaleItemsAPI.delete(itemId);
      toast.success("Removed from Quick Sale");
      loadQuickItems();
      onSuccess();
    } catch (error) {
      console.error("Error removing quick sale item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleEditQuickSale = (item: QuickSaleItem) => {
    setEditingItem(item);
    setDisplayName(item.displayName);
    setSelectedColor(item.color);
    setSortOrder(item.sortOrder);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    if (product) {
      setDisplayName(product.name);
      const maxOrder = quickItems.length > 0 ? Math.max(...quickItems.map((i) => i.sortOrder)) : -1;
      setSortOrder(maxOrder + 1);
    } else {
      setDisplayName("");
      setSortOrder(0);
    }
    setSelectedColor("#3B82F6");
  };

  if (!isOpen) return null;

  // Check if current product is already in quick sale
  const isProductInQuickSale = product && quickItems.some((item) => item.productId === product.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quick Sale Manager</h2>
              <p className="text-sm text-blue-100">Manage fast-access products</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Product Section */}
          {(product || editingItem) && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {editingItem
                      ? "✏️ Edit Quick Sale Item"
                      : isProductInQuickSale
                      ? "⚡ Already in Quick Sale"
                      : "➕ Add to Quick Sale"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Product:{" "}
                    <span className="font-semibold text-gray-900">
                      {editingItem ? editingItem.product?.name || `ID: ${editingItem.productId}` : product?.name}
                    </span>
                  </p>

                  {!isProductInQuickSale || editingItem ? (
                    <div className="space-y-4">
                      {/* Display Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g., Milk, Bread, Coffee"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Short name displayed on the button</p>
                      </div>

                      {/* Color Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Color <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setSelectedColor(color.value)}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                                selectedColor === color.value
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className={`w-6 h-6 rounded ${color.class}`}></div>
                              <span className="text-sm font-medium">{color.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort Order */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                        <input
                          type="number"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                      </div>

                      {/* Preview */}
                      <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                        <button
                          type="button"
                          style={{ backgroundColor: selectedColor }}
                          className="px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                        >
                          {displayName || "Preview"}
                        </button>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end pt-2 space-x-3">
                        <Button
                          variant="primary"
                          onClick={handleAddToQuickSale}
                          disabled={isSubmitting || !displayName.trim()}
                          className="flex items-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={editingItem ? "M5 13l4 4L19 7" : "M13 10V3L4 14h7v7l9-11h-7z"}
                            />
                          </svg>
                          {isSubmitting
                            ? editingItem
                              ? "Updating..."
                              : "Adding..."
                            : editingItem
                            ? "Update Item"
                            : "Add to Quick Sale"}
                        </Button>
                        {editingItem && (
                          <Button variant="secondary" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">This product is already in Quick Sale</span>
                      </div>
                      <p className="text-sm text-green-700 mt-2">
                        You can manage it in the list below or remove it if needed.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Quick Sale Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Current Quick Sale Items ({quickItems.length})
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading...</p>
              </div>
            ) : quickItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                <p className="text-gray-600 font-medium">No Quick Sale items yet</p>
                <p className="text-sm text-gray-500 mt-1">Add products to enable fast checkout</p>
              </div>
            ) : (
              <div className="space-y-3">
                {quickItems
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Color Preview */}
                          <div
                            style={{ backgroundColor: item.color }}
                            className="w-12 h-12 rounded-lg shadow-sm flex items-center justify-center"
                          >
                            <span className="text-white font-bold text-lg">#{item.sortOrder}</span>
                          </div>

                          {/* Item Info */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.displayName}</h4>
                            <p className="text-sm text-gray-600">
                              Product: {item.product?.name || `ID: ${item.productId}`}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">Order: {item.sortOrder}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditQuickSale(item)}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveFromQuickSale(item.id)}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
