import React from "react";
import { Product } from "../../types";
import { Button, Badge } from "../common";

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  onAdjustStock: (product: Product) => void;
  onViewHistory: (product: Product) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  isLoading,
  onAdjustStock,
  onViewHistory,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-gray-500">No products found</p>;
  }

  return (
    <table className="min-w-full rounded-lg overflow-hidden border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-16">Image</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Name</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[80px]">SKU</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[60px]">Stock</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[90px]">Status</th>
          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, idx) => {
          let status = "In Stock";
          let variant: "success" | "danger" | "warning" = "success";
          if (product.stockQuantity <= 0) {
            status = "Out of Stock";
            variant = "danger";
          } else if (product.stockQuantity <= product.lowStockThreshold) {
            status = "Low Stock";
            variant = "warning";
          }

          return (
            <tr
              key={product.id}
              className={`align-middle transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
            >
              <td className="px-3 py-2">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded border"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-400 rounded border">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </td>
              <td className="px-3 py-2 font-medium text-gray-900 min-w-[120px]">{product.name}</td>
              <td className="px-3 py-2 text-gray-600 min-w-[80px]">{product.sku}</td>
              <td className="px-3 py-2 text-gray-900 min-w-[60px]">{product.stockQuantity}</td>
              <td className="px-3 py-2 min-w-[90px]">
                <Badge variant={variant} size="sm">
                  {status}
                </Badge>
              </td>
              <td className="px-3 py-2 min-w-[120px]">
                <div className="flex items-center justify-center gap-2 w-full">
                  <Button variant="primary" size="sm" onClick={() => onAdjustStock(product)}>
                    Adjust Stock
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onViewHistory(product)}>
                    History
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
