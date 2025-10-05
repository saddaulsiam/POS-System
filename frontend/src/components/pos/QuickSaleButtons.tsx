import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { QuickSaleItem, Product } from "../../types";
import { quickSaleItemsAPI } from "../../services/api";
import { Button } from "../common";

interface QuickSaleButtonsProps {
  onProductSelect: (product: Product) => void;
}

export const QuickSaleButtons: React.FC<QuickSaleButtonsProps> = ({ onProductSelect }) => {
  const [quickItems, setQuickItems] = useState<QuickSaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuickItems();
  }, []);

  const loadQuickItems = async () => {
    try {
      setLoading(true);
      const data = await quickSaleItemsAPI.getAll();
      setQuickItems(data.filter((item: QuickSaleItem) => item.isActive));
    } catch (error) {
      console.error("Error loading quick sale items:", error);
      toast.error("Failed to load quick sale items");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickItemClick = (item: QuickSaleItem) => {
    if (item.product) {
      onProductSelect(item.product);
      toast.success(`Added ${item.displayName} to cart`);
    }
  };

  const handleConfigureClick = () => {
    navigate("/products");
    toast.success("Opening Products page to configure quick sale items");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading quick items...</span>
        </div>
      </div>
    );
  }

  if (quickItems.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 p-6">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Sale Items</h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
            Add your most frequently sold products here for lightning-fast checkout
          </p>

          {/* Features List */}
          <div className="bg-white rounded-lg p-4 mb-4 text-left max-w-sm mx-auto">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-blue-600">💡</span>
              What are Quick Sale Items?
            </p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>One-click access to popular products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>Customizable colors for easy identification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>Perfect for drinks, snacks, or hot items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span>Speed up your checkout process</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfigureClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Configure Quick Items
          </button>

          {/* Hint */}
          <p className="text-xs text-gray-500 mt-3">
            Go to <span className="font-semibold text-blue-600">Products</span> page to add items
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Quick Sale</h3>
        <button
          onClick={() => setShowManageModal(true)}
          className="text-sm text-gray-600 hover:text-gray-900"
          title="Manage quick items"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {quickItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleQuickItemClick(item)}
            className="relative group overflow-hidden rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: item.color,
              minHeight: "80px",
            }}
          >
            <div className="p-4 h-full flex flex-col items-center justify-center text-center">
              <span className="text-white font-semibold text-sm leading-tight drop-shadow-md">{item.displayName}</span>
              {item.product && (
                <span className="text-white text-xs mt-1 opacity-90 drop-shadow-sm">
                  ${item.product.sellingPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
        ))}
      </div>

      {/* Manage Modal - Enhanced */}
      {showManageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Sale Items Setup
                </h3>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">How to Add Quick Items</h4>
                    <p className="text-sm text-gray-600">
                      Follow these simple steps to configure your quick sale buttons
                    </p>
                  </div>
                </div>

                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Go to Products Page</p>
                      <p className="text-xs text-gray-600">Navigate to the Products section from the Admin Panel</p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Select a Product</p>
                      <p className="text-xs text-gray-600">Click on any product you want to add as a quick item</p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Add to Quick Sale</p>
                      <p className="text-xs text-gray-600">Use the "Add to Quick Sale" option and choose a color</p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Done!</p>
                      <p className="text-xs text-gray-600">Your quick item will appear here for one-click access</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Tips Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
                  <span>💡</span> Pro Tips
                </p>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>• Add your best-selling items for faster checkout</li>
                  <li>• Use different colors to categorize items (drinks, snacks, etc.)</li>
                  <li>• You can add up to 12 quick sale items</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
              <Button variant="primary" onClick={handleConfigureClick} className="px-6">
                Lets Go!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
