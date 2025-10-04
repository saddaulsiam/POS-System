import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { QuickSaleItem, Product } from "../../types";
import { quickSaleItemsAPI } from "../../services/api";
import { Button } from "../common";

interface QuickSaleButtonsProps {
  onProductSelect: (product: Product) => void;
}

export const QuickSaleButtons: React.FC<QuickSaleButtonsProps> = ({
  onProductSelect,
}) => {
  const [quickItems, setQuickItems] = useState<QuickSaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);

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
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">No quick sale items configured</p>
          <button
            onClick={() => setShowManageModal(true)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Configure Quick Items
          </button>
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
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
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
              <span className="text-white font-semibold text-sm leading-tight drop-shadow-md">
                {item.displayName}
              </span>
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

      {/* Manage Modal - Will be implemented separately */}
      {showManageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Manage Quick Items</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure quick sale items from the Products page by using the
              "Add to Quick Sale" option.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowManageModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
