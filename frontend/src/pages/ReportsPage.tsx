import React, { useEffect, useState } from "react";
import { reportsAPI } from "../services/api";
import { DailySalesReport, EmployeePerformanceReport, ProductPerformanceReport, InventoryReport } from "../types";
import { exportTableToPDF, exportTableToCSV } from "../utils/exportUtils";

const formatCurrency = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const ReportsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daily, setDaily] = useState<DailySalesReport | null>(null);
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    end: formatDate(new Date()),
  });
  const [salesRange, setSalesRange] = useState<any>(null);
  const [employeePerf, setEmployeePerf] = useState<EmployeePerformanceReport | null>(null);
  const [productPerf, setProductPerf] = useState<ProductPerformanceReport | null>(null);
  const [inventory, setInventory] = useState<InventoryReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [d, r, emp, prod, inv] = await Promise.all([
          reportsAPI.getDailySales(range.end),
          reportsAPI.getSalesRange(range.start, range.end),
          reportsAPI.getEmployeePerformance(range.start, range.end),
          reportsAPI.getProductPerformance(range.start, range.end, 5),
          reportsAPI.getInventory(),
        ]);
        setDaily(d);
        setSalesRange(r);
        setEmployeePerf(emp);
        setProductPerf(prod);
        setInventory(inv);
      } catch (e: any) {
        setError(e?.message || "Failed to load reports");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
    // eslint-disable-next-line
  }, [range.start, range.end]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">📊 Reports & Analytics</h1>
          <a
            href="/admin"
            className="inline-block px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition-all shadow-sm"
          >
            ← Back to Dashboard
          </a>
        </div>
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:space-x-6 space-y-2 md:space-y-0">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Start Date</label>
            <input
              type="date"
              className="mt-1 block w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={range.start}
              onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
              max={range.end}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">End Date</label>
            <input
              type="date"
              className="mt-1 block w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={range.end}
              onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              min={range.start}
              max={formatDate(new Date())}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
        ) : (
          <>
            {/* Daily Sales Summary */}
            {daily && (
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
                            .map((p) => [p.product?.name || `#${p.productId}`, p._sum.quantity]),
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
                            .map((p) => [p.product?.name || `#${p.productId}`, p._sum.quantity]),
                          sheetName: `Daily Sales ${daily.date}`,
                        })
                      }
                    >
                      Download CSV
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Total Sales</div>
                    <div className="text-2xl font-bold text-blue-900">{formatCurrency(daily.summary.totalSales)}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Transactions</div>
                    <div className="text-2xl font-bold text-blue-900">{daily.summary.totalTransactions}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Tax</div>
                    <div className="text-2xl font-bold text-blue-900">{formatCurrency(daily.summary.totalTax)}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Discount</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(daily.summary.totalDiscount)}
                    </div>
                  </div>
                </div>
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
                    <h3 className="font-semibold mb-2 text-blue-700">Sales by Payment Method</h3>
                    <ul className="divide-y">
                      {daily.salesByPaymentMethod.map((pm) => (
                        <li key={pm.paymentMethod} className="py-1 flex justify-between">
                          <span>{pm.paymentMethod}</span>
                          <span className="text-gray-700">{formatCurrency(pm._sum.finalAmount)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Range Summary */}
            {salesRange && (
              <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-800">
                    Sales{" "}
                    <span className="text-base text-gray-500">
                      ({range.start} to {range.end})
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
                      onClick={() =>
                        exportTableToPDF({
                          title: `Sales Range - ${range.start} to ${range.end}`,
                          columns: ["Total Sales", "Transactions", "Tax", "Discount"],
                          data: [
                            [
                              formatCurrency(salesRange.summary?.totalSales ?? 0),
                              salesRange.summary?.totalTransactions ?? 0,
                              formatCurrency(salesRange.summary?.totalTax ?? 0),
                              formatCurrency(salesRange.summary?.totalDiscount ?? 0),
                            ],
                          ],
                          filename: `sales-range-${range.start}-to-${range.end}.pdf`,
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
                          sheetName: `Sales Range ${range.start} to ${range.end}`,
                        })
                      }
                    >
                      Download CSV
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Total Sales</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(salesRange.summary?.totalSales ?? 0)}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Transactions</div>
                    <div className="text-2xl font-bold text-blue-900">{salesRange.summary?.totalTransactions ?? 0}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Tax</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(salesRange.summary?.totalTax ?? 0)}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Discount</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(salesRange.summary?.totalDiscount ?? 0)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Employee Performance */}
            {employeePerf && (
              <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-800">Top Employees</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
                      onClick={() =>
                        exportTableToPDF({
                          title: `Top Employees - ${range.start} to ${range.end}`,
                          columns: ["Name", "Total Sales", "Transactions", "Avg Transaction"],
                          data: employeePerf.performance
                            .slice(0, 5)
                            .map((emp) => [
                              emp.employee.name,
                              formatCurrency(emp.totalSales),
                              emp.totalTransactions,
                              formatCurrency(emp.averageTransaction),
                            ]),
                          filename: `top-employees-${range.start}-to-${range.end}.pdf`,
                        })
                      }
                    >
                      Download PDF
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
                      onClick={() =>
                        exportTableToCSV({
                          columns: ["Name", "Total Sales", "Transactions", "Avg Transaction"],
                          data: employeePerf.performance
                            .slice(0, 5)
                            .map((emp) => [
                              emp.employee.name,
                              emp.totalSales,
                              emp.totalTransactions,
                              emp.averageTransaction,
                            ]),
                          sheetName: `Top Employees ${range.start} to ${range.end}`,
                        })
                      }
                    >
                      Download CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-blue-100">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left font-semibold text-blue-800">Name</th>
                        <th className="px-4 py-2 text-right font-semibold text-blue-800">Total Sales</th>
                        <th className="px-4 py-2 text-right font-semibold text-blue-800">Transactions</th>
                        <th className="px-4 py-2 text-right font-semibold text-blue-800">Avg Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeePerf.performance.slice(0, 5).map((emp) => (
                        <tr key={emp.employee.id} className="border-b">
                          <td className="px-4 py-2">{emp.employee.name}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(emp.totalSales)}</td>
                          <td className="px-4 py-2 text-right">{emp.totalTransactions}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(emp.averageTransaction)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Product Performance */}
            {productPerf && (
              <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-800">
                    Top Products{" "}
                    <span className="text-base text-gray-500">
                      ({range.start} to {range.end})
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
                      onClick={() =>
                        exportTableToPDF({
                          title: `Top Products - ${range.start} to ${range.end}`,
                          columns: ["Product", "Sold", "Revenue", "Transactions", "Est. Profit"],
                          data: productPerf.products
                            .slice(0, 5)
                            .map((prod) => [
                              prod.product.name,
                              prod.totalQuantitySold,
                              formatCurrency(prod.totalRevenue),
                              prod.totalTransactions,
                              formatCurrency(prod.estimatedProfit),
                            ]),
                          filename: `top-products-${range.start}-to-${range.end}.pdf`,
                        })
                      }
                    >
                      Download PDF
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
                      onClick={() =>
                        exportTableToCSV({
                          columns: ["Product", "Sold", "Revenue", "Transactions", "Est. Profit"],
                          data: productPerf.products
                            .slice(0, 5)
                            .map((prod) => [
                              prod.product.name,
                              prod.totalQuantitySold,
                              prod.totalRevenue,
                              prod.totalTransactions,
                              prod.estimatedProfit,
                            ]),
                          sheetName: `Top Products ${range.start} to ${range.end}`,
                        })
                      }
                    >
                      Download CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-blue-100">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left font-semibold text-blue-800">Product</th>
                        <th className="px-4 py-2 text-right font-semibold text-blue-800">Sold</th>
                        <th className="px-4 py-2 text-right font-semibold text-blue-800">Revenue</th>
                        <th className="px-4 py-2 text-right font-semibold text-blue-800">Transactions</th>
                        <th className="px-4 py-2 text-right font-semibold text-blue-800">Est. Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPerf.products.slice(0, 5).map((prod) => (
                        <tr key={prod.product.id} className="border-b">
                          <td className="px-4 py-2">{prod.product.name}</td>
                          <td className="px-4 py-2 text-right">{prod.totalQuantitySold}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(prod.totalRevenue)}</td>
                          <td className="px-4 py-2 text-right">{prod.totalTransactions}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(prod.estimatedProfit)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Inventory Summary */}
            {inventory && (
              <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-800">Inventory Summary</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
                      onClick={() =>
                        exportTableToPDF({
                          title: `Inventory Summary`,
                          columns: ["Total Products", "Low Stock", "Out of Stock", "Inventory Value"],
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
                          columns: ["Total Products", "Low Stock", "Out of Stock", "Inventory Value"],
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
                    <div className="text-2xl font-bold text-blue-900">{inventory.totalProducts}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Low Stock</div>
                    <div className="text-2xl font-bold text-blue-900">{inventory.lowStockCount}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Out of Stock</div>
                    <div className="text-2xl font-bold text-blue-900">{inventory.outOfStockCount}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs">Inventory Value</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(inventory.totalInventoryValue)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Dashboard link moved to top right */}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
