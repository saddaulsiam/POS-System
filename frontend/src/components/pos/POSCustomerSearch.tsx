import React from "react";
import { Customer } from "../../types";

interface POSCustomerSearchProps {
  customerPhone: string;
  customer: Customer | null;
  onPhoneChange: (value: string) => void;
  onSearch: () => void;
}

export const POSCustomerSearch: React.FC<POSCustomerSearchProps> = ({
  customerPhone,
  customer,
  onPhoneChange,
  onSearch,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Customer</h3>
      <div className="flex space-x-2 mb-2">
        <input
          type="tel"
          placeholder="Phone number (optional)"
          value={customerPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={onSearch} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
          Search
        </button>
      </div>
      {customer && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2">
          <p className="text-sm font-medium text-green-800">{customer.name}</p>
          <p className="text-xs text-green-600">Points: {customer.loyaltyPoints}</p>
        </div>
      )}
    </div>
  );
};
