import React from "react";
import { Sale } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";
import { Badge } from "../common";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onViewDetails: (sale: Sale) => void;
  onRefund: (sale: Sale) => void;
  getCustomerName: (customerId?: number) => string;
  getEmployeeName: (employeeId: number) => string;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  isLoading,
  onViewDetails,
  onRefund,
  getCustomerName,
  getEmployeeName,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Receipt ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No sales found
              </td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{sale.receiptId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(sale.createdAt).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">{new Date(sale.createdAt).toLocaleTimeString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getCustomerName(sale.customerId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getEmployeeName(sale.employeeId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${sale.finalAmount.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Tax: ${sale.taxAmount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sale.paymentMethod}</div>
                  {sale.cashReceived && (
                    <div className="text-sm text-gray-500">Cash: ${sale.cashReceived.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      sale.paymentStatus === "COMPLETED"
                        ? "success"
                        : sale.paymentStatus === "REFUNDED"
                        ? "danger"
                        : "warning"
                    }
                    rounded
                  >
                    {sale.paymentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onViewDetails(sale)} className="text-blue-600 hover:text-blue-900 mr-4">
                    View
                  </button>
                  {sale.paymentStatus === "COMPLETED" && (
                    <button onClick={() => onRefund(sale)} className="text-red-600 hover:text-red-900">
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
