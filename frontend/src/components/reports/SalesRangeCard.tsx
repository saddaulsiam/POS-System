import React from "react";
import { formatCurrency } from "../../utils/reportUtils";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";

interface SalesRangeCardProps {
  salesRange: any;
  startDate: string;
  endDate: string;
}

export const SalesRangeCard: React.FC<SalesRangeCardProps> = ({ salesRange, startDate, endDate }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">
          Sales{" "}
          <span className="text-base text-gray-500">
            ({startDate} to {endDate})
          </span>
        </h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
            onClick={() =>
              exportTableToPDF({
                title: `Sales Range - ${startDate} to ${endDate}`,
                columns: ["Total Sales", "Transactions", "Tax", "Discount"],
                data: [
                  [
                    formatCurrency(salesRange.summary?.totalSales ?? 0),
                    salesRange.summary?.totalTransactions ?? 0,
                    formatCurrency(salesRange.summary?.totalTax ?? 0),
                    formatCurrency(salesRange.summary?.totalDiscount ?? 0),
                  ],
                ],
                filename: `sales-range-${startDate}-to-${endDate}.pdf`,
              })
            }
          >
            Download PDF
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
            onClick={() =>
              exportTableToCSV({
                columns: ["Total Sales", "Transactions", "Tax", "Discount"],
                data: [
                  [
                    salesRange.summary?.totalSales ?? 0,
                    salesRange.summary?.totalTransactions ?? 0,
                    salesRange.summary?.totalTax ?? 0,
                    salesRange.summary?.totalDiscount ?? 0,
                  ],
                ],
                sheetName: `Sales Range ${startDate} to ${endDate}`,
              })
            }
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Total Sales</div>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(salesRange.summary?.totalSales ?? 0)}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Transactions</div>
          <div className="text-2xl font-bold text-blue-900">{salesRange.summary?.totalTransactions ?? 0}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Tax</div>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(salesRange.summary?.totalTax ?? 0)}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Discount</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(salesRange.summary?.totalDiscount ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
};
