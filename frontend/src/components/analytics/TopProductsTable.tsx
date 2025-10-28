import React from "react";
import { TopProduct } from "../../types/analyticsTypes";

interface TopProductsTableProps {
  topProducts: TopProduct[];
  settings: any;
  formatCurrency: (value: number, settings: any) => string;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ topProducts, settings, formatCurrency }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-600 font-semibold">Rank</th>
            <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
            <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
            <th className="text-right py-3 px-4 text-gray-600 font-semibold">Qty Sold</th>
            <th className="text-right py-3 px-4 text-gray-600 font-semibold">Revenue</th>
            <th className="text-right py-3 px-4 text-gray-600 font-semibold">Avg Price</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-600"
                        : "bg-blue-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                <td className="py-3 px-4 text-gray-600">{product.category}</td>
                <td className="py-3 px-4 text-right text-gray-800 font-semibold">{product.quantitySold.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-green-600 font-semibold">
                  {formatCurrency(product.revenue, settings)}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(product.averagePrice, settings)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No product data available for this period
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
