import React from "react";
import { DailySalesReport } from "../../types";
import { formatCurrency } from "../../utils/reportUtils";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";

interface DailySalesCardProps {
  daily: DailySalesReport;
}

export const DailySalesCard: React.FC<DailySalesCardProps> = ({ daily }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">
          Today's Sales <span className="text-base text-gray-500">({daily.date})</span>
        </h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
            onClick={() =>
              exportTableToPDF({
                title: `Daily Sales - ${daily.date}`,
                columns: ["Product", "Sold"],
                data: daily.topProducts
                  .slice(0, 5)
                  .map((p) => [
                    p.product?.name || `#${p.productId}`,
                    p._sum.quantity,
                  ]),
                filename: `daily-sales-${daily.date}.pdf`,
              })
            }
          >
            Download PDF
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
            onClick={() =>
              exportTableToCSV({
                columns: ["Product", "Sold"],
                data: daily.topProducts
                  .slice(0, 5)
                  .map((p) => [
                    p.product?.name || `#${p.productId}`,
                    p._sum.quantity,
                  ]),
                sheetName: `Daily Sales ${daily.date}`,
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
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(daily.summary.totalSales)}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Transactions</div>
          <div className="text-2xl font-bold text-blue-900">
            {daily.summary.totalTransactions}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Tax</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(daily.summary.totalTax)}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-gray-500 text-xs">Discount</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(daily.summary.totalDiscount)}
          </div>
        </div>
      </div>

      {/* Top Products and Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2 text-blue-700">Top Products</h3>
          <ul className="divide-y">
            {daily.topProducts.slice(0, 5).map((p) => (
              <li key={p.productId} className="py-1 flex justify-between">
                <span>{p.product?.name || `#${p.productId}`}</span>
                <span className="text-gray-700">{p._sum.quantity} sold</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-blue-700">
            Sales by Payment Method
          </h3>
          <ul className="divide-y">
            {daily.salesByPaymentMethod.map((pm) => (
              <li key={pm.paymentMethod} className="py-1 flex justify-between">
                <span>{pm.paymentMethod}</span>
                <span className="text-gray-700">
                  {formatCurrency(pm._sum.finalAmount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
