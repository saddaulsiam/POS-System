import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";
import { Input } from "../common";

interface POSPaymentModalProps {
  isOpen: boolean;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "CASH" | "CARD";
  cashReceived: string;
  changeAmount: number;
  isProcessing: boolean;
  onClose: () => void;
  onPaymentMethodChange: (method: "CASH" | "CARD") => void;
  onCashReceivedChange: (value: string) => void;
  onConfirm: () => void;
  loyaltyDiscount?: number;
}

export const POSPaymentModal: React.FC<POSPaymentModalProps> = ({
  isOpen,
  subtotal,
  tax,
  total,
  paymentMethod,
  cashReceived,
  changeAmount,
  isProcessing,
  onClose,
  onPaymentMethodChange,
  onCashReceivedChange,
  onConfirm,
  loyaltyDiscount, // <-- Add this line
}) => {
  const { settings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Process Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg text-base">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal, settings)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(tax, settings)}</span>
            </div>
            {/* Loyalty Discount row (if present) */}
            {loyaltyDiscount && loyaltyDiscount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Loyalty Discount:</span>
                <span>-{formatCurrency(loyaltyDiscount, settings)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2 mt-2">
              <span>Total:</span>
              <span>{formatCurrency(total, settings)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="flex space-x-2">
              <button
                onClick={() => onPaymentMethodChange("CASH")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  paymentMethod === "CASH" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cash
              </button>
              <button
                onClick={() => onPaymentMethodChange("CARD")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  paymentMethod === "CARD" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Card
              </button>
            </div>
          </div>

          {paymentMethod === "CASH" && (
            <Input
              label="Cash Received"
              type="number"
              step="0.01"
              value={cashReceived}
              onChange={(e) => onCashReceivedChange(e.target.value)}
              placeholder="0.00"
              min={total}
              fullWidth
            />
          )}
          {cashReceived && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Change: </span>
              <span className="font-medium">{formatCurrency(changeAmount, settings)}</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing || (paymentMethod === "CASH" && parseFloat(cashReceived) < total)}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Complete Sale"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
