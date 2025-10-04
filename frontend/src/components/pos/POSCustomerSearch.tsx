import React from "react";
import { Input, Button } from "../common";
import { Customer } from "../../types";

interface POSCustomerSearchProps {
  customerPhone: string;
  customer: Customer | null;
  customerNotFound: boolean;
  onPhoneChange: (value: string) => void;
  onSearch: () => void;
  onCreateCustomer: () => void;
  onClearCustomer: () => void;
}

export const POSCustomerSearch: React.FC<POSCustomerSearchProps> = ({
  customerPhone,
  customer,
  customerNotFound,
  onPhoneChange,
  onSearch,
  onCreateCustomer,
  onClearCustomer,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={`border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white ${customer ? "p-2" : "p-4"}`}>
      {/* Show header and search only when no customer is selected */}
      {!customer && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              Customer Info
            </h3>
            <button
              onClick={onCreateCustomer}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              title="Quick add new customer"
            >
              <span className="text-sm">➕</span>
              New
            </button>
          </div>

          <div className="flex space-x-2 mb-3">
            <div className="flex-1">
              <Input
                type="tel"
                placeholder="Enter phone number..."
                value={customerPhone}
                onChange={(e) => onPhoneChange(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={onSearch} variant="primary" size="sm" className="px-4">
              🔍 Search
            </Button>
          </div>
        </>
      )}

      {/* Customer card - compact view when selected */}
      {customer && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-2.5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-base">👤</span>
                <p className="text-sm font-bold text-green-900 truncate">{customer.name}</p>
                <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                  Member
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-green-700">📞 {customer.phoneNumber || "No phone"}</span>
                <span className="text-green-700">•</span>
                <span className="font-semibold text-green-800">⭐ {customer.loyaltyPoints} pts</span>
                {customer.email && (
                  <>
                    <span className="text-green-700">•</span>
                    <span className="text-green-600 truncate">✉️ {customer.email}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClearCustomer}
              className="text-green-600 hover:text-green-800 transition-colors ml-2 flex-shrink-0 p-1 hover:bg-green-100 rounded"
              title="Change customer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {customerNotFound && !customer && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 mb-1">Customer Not Found</p>
              <p className="text-xs text-amber-700 mb-3">
                No customer registered with phone number <strong>{customerPhone}</strong>
              </p>
              <Button
                onClick={onCreateCustomer}
                variant="primary"
                size="sm"
                fullWidth
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg">➕</span>
                  <span className="font-semibold">Create New Customer</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {!customer && !customerNotFound && customerPhone.trim() === "" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
          <p className="text-xs text-blue-700">
            💡 <strong>Tip:</strong> Search for existing customer or continue as guest
          </p>
        </div>
      )}
    </div>
  );
};
