import React from "react";
import { Product, Category } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface POSProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
  onProductClick: (product: Product) => void;
}

export const POSProductGrid: React.FC<POSProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onCategoryClick,
  onProductClick,
}) => {
  const { settings } = useSettings();

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onCategoryClick(null)}
          className={`p-4 rounded-lg shadow hover:shadow-md transition-shadow border ${
            selectedCategory === null ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
          }`}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-blue-600 text-xl">🛒</span>
            </div>
            <p className="text-sm font-medium text-gray-900">All Products</p>
          </div>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`p-4 rounded-lg shadow hover:shadow-md transition-shadow border ${
              selectedCategory === category.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-blue-600 text-xl">{category.icon || "📦"}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{category.name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {products.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "All Products"}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onProductClick(product)}
                disabled={product.stockQuantity <= 0}
                className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 truncate">{product.sku}</p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(product.sellingPrice, settings)}
                  </p>
                  <p className="text-xs text-gray-500">Stock: {product.stockQuantity}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
