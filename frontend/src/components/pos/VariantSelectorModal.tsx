import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Product, ProductVariant } from "../../types";
import { productVariantsAPI } from "../../services/api";
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
      const data = await productVariantsAPI.getByProduct(product.id);
      // Only show active variants with stock
      const activeVariants = data.filter((v: ProductVariant) => v.isActive && (v.stockQuantity || 0) > 0);
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Select Variant - ${product.name}`} size="md">
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading variants...</p>
          </div>
        ) : variants.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-900">No variants available</p>
            <p className="mt-2 text-sm text-gray-600">All variants are either inactive or out of stock.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">Select a variant to add to cart:</p>
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleSelectVariant(variant)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{variant.name}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      {variant.sku && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          SKU: {variant.sku}
                        </span>
                      )}
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        Stock: {variant.stockQuantity || 0}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(variant.sellingPrice, settings)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
