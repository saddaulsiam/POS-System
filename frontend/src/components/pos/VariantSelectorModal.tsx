import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Product, ProductVariant } from "../../types";
import { productVariantsAPI } from "../../services";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";
import { Modal } from "../common";

interface VariantSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const VariantSelectorModal: React.FC<VariantSelectorModalProps> = ({
  isOpen,
  onClose,
  product,
  onSelectVariant,
}) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    if (isOpen && product.id) {
      loadVariants();
    }
  }, [isOpen, product.id]);

  const loadVariants = async () => {
    try {
      setLoading(true);
      const data = await productVariantsAPI.getAll({ productId: product.id });
      // Only show active variants with stock
      const variantsArr = Array.isArray(data) ? data : data.data || [];
      const activeVariants = variantsArr.filter((v: ProductVariant) => v.isActive && (v.stockQuantity || 0) > 0);
      setVariants(activeVariants);
    } catch (error) {
      console.error("Error loading variants:", error);
      toast.error("Failed to load product variants");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    onSelectVariant(variant);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Select Variant - ${product.name}`} size="lg">
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium">Loading variants...</p>
          </div>
        ) : variants.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-2">No variants available</p>
            <p className="text-sm text-gray-600">All variants are either inactive or out of stock.</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-blue-800">Select a variant to add to cart</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleSelectVariant(variant)}
                  className="group relative w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white"
                >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>

                  <div className="relative flex items-center justify-between">
                    {/* Left Section: Icon and Info */}
                    <div className="flex items-center flex-1">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {variant.name}
                        </h3>
                        {variant.sku && <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {variant.sku}</p>}

                        {/* Stock Badge */}
                        <div className="mt-2">
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              (variant.stockQuantity || 0) > 10
                                ? "bg-green-100 text-green-700"
                                : (variant.stockQuantity || 0) > 5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            {variant.stockQuantity || 0} in stock
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Price and Arrow */}
                    <div className="flex items-center ml-4 space-x-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(variant.sellingPrice, settings)}
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
