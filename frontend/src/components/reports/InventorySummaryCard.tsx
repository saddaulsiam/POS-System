import React from "react";
import { InventoryReport } from "../../types";
import { formatCurrency } from "../../utils/reportUtils";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";

interface InventorySummaryCardProps {
  inventory: InventoryReport;
}

export const InventorySummaryCard: React.FC<InventorySummaryCardProps> = ({
  inventory,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Inventory Summary</h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
            onClick={() =>
              exportTableToPDF({
                title: `Inventory Summary`,
                columns: [
                  "Total Products",
                  "Low Stock",
                  "Out of Stock",
                  "Inventory Value",
                ],
                data: [
                  [
                    inventory.totalProducts,
                    inventory.lowStockCount,
                    inventory.outOfStockCount,
                    formatCurrency(inventory.totalInventoryValue),
                  ],
                ],
                filename: `inventory-summary.pdf`,
              })
            }
          >
            Download PDF
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
            onClick={() =>
              exportTableToCSV({
                columns: [
                  "Total Products",
                  "Low Stock",
                  "Out of Stock",
                  "Inventory Value",
                ],
                data: [
                  [
                    inventory.totalProducts,
                    inventory.lowStockCount,
                    inventory.outOfStockCount,
                    inventory.totalInventoryValue,
                  ],
                ],
                sheetName: `Inventory Summary`,
              })
            }
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Total Products</div>
          <div className="text-2xl font-bold text-blue-900">
            {inventory.totalProducts}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Low Stock</div>
          <div className="text-2xl font-bold text-blue-900">
            {inventory.lowStockCount}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Out of Stock</div>
          <div className="text-2xl font-bold text-blue-900">
            {inventory.outOfStockCount}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Inventory Value</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(inventory.totalInventoryValue)}
          </div>
        </div>
      </div>
    </div>
  );
};
