import React, { useState } from "react";
import { X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
}

interface UpdatePriceModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (productId: number, sellingPrice: number) => Promise<void>;
}

const UpdatePriceModal: React.FC<UpdatePriceModalProps> = ({ product, onClose, onUpdate }) => {
  const [sellingPrice, setSellingPrice] = useState(product.sellingPrice.toString());
  const [targetMargin, setTargetMargin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate current margin
  const currentMargin =
    product.sellingPrice > 0 ? ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100 : 0;

  // Calculate new margin based on selling price input
  const newMargin =
    parseFloat(sellingPrice) > 0
      ? ((parseFloat(sellingPrice) - product.purchasePrice) / parseFloat(sellingPrice)) * 100
      : 0;

  // Calculate profit amount
  const profitAmount = parseFloat(sellingPrice) - product.purchasePrice;

  // Handle target margin change - calculate selling price from margin
  const handleTargetMarginChange = (margin: string) => {
    setTargetMargin(margin);
    if (margin && !isNaN(parseFloat(margin))) {
      const marginDecimal = parseFloat(margin) / 100;
      // Formula: sellingPrice = purchasePrice / (1 - margin)
      const calculatedSellingPrice = product.purchasePrice / (1 - marginDecimal);
      setSellingPrice(calculatedSellingPrice.toFixed(2));
    }
  };

  // Handle selling price change
  const handleSellingPriceChange = (price: string) => {
    setSellingPrice(price);
    // Clear target margin when manually entering price
    setTargetMargin("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(sellingPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(product.id, price);
      onClose();
    } catch (error) {
      console.error("Failed to update price:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick margin buttons
  const quickMargins = [10, 15, 20, 25, 30, 40, 50];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Update Selling Price</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Purchase Price</p>
                <p className="text-lg font-semibold text-gray-900">৳{product.purchasePrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Selling Price</p>
                <p className="text-lg font-semibold text-gray-900">৳{product.sellingPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Current Margin</p>
              <p
                className={`text-lg font-semibold ${
                  currentMargin < 0 ? "text-red-600" : currentMargin < 10 ? "text-yellow-600" : "text-green-600"
                }`}
              >
                {currentMargin.toFixed(2)}% (৳{(product.sellingPrice - product.purchasePrice).toFixed(2)})
              </p>
            </div>
          </div>

          {/* Quick Margin Buttons */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Margin Selection</label>
            <div className="flex flex-wrap gap-2">
              {quickMargins.map((margin) => (
                <button
                  key={margin}
                  type="button"
                  onClick={() => handleTargetMarginChange(margin.toString())}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    targetMargin === margin.toString()
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {margin}%
                </button>
              ))}
            </div>
          </div>

          {/* Target Margin Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Target Margin %</label>
            <input
              type="number"
              step="0.01"
              value={targetMargin}
              onChange={(e) => handleTargetMarginChange(e.target.value)}
              placeholder="e.g., 25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Margin % = (Selling Price - Purchase Price) / Selling Price × 100
            </p>
          </div>

          {/* Selling Price Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Selling Price *</label>
            <input
              type="number"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => handleSellingPriceChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Calculation Summary */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h4 className="font-medium text-indigo-900 mb-3">Price Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Purchase Price:</span>
                <span className="font-medium">৳{product.purchasePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New Selling Price:</span>
                <span className="font-medium">৳{parseFloat(sellingPrice || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-indigo-200">
                <span className={profitAmount < 0 ? "text-red-600" : "text-green-600"}>Profit per Unit:</span>
                <span className={profitAmount < 0 ? "text-red-600" : "text-green-600"}>৳{profitAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span
                  className={newMargin < 0 ? "text-red-600" : newMargin < 10 ? "text-yellow-600" : "text-green-600"}
                >
                  Profit Margin:
                </span>
                <span
                  className={newMargin < 0 ? "text-red-600" : newMargin < 10 ? "text-yellow-600" : "text-green-600"}
                >
                  {newMargin.toFixed(2)}%
                </span>
              </div>
            </div>

            {newMargin < 0 && (
              <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800">
                ⚠️ Warning: Negative margin - you will lose money on each sale!
              </div>
            )}
            {newMargin >= 0 && newMargin < 10 && (
              <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                ⚠️ Warning: Low margin - consider increasing the selling price
              </div>
            )}
            {newMargin >= 10 && (
              <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-xs text-green-800">
                ✓ Good margin - profitable pricing
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !sellingPrice || parseFloat(sellingPrice) <= 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Price"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePriceModal;
