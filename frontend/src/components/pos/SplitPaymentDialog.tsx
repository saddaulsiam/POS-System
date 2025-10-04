import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { PaymentMethod } from "../../types";
import { Button } from "../common";

interface PaymentSplit {
  method: PaymentMethod;
  amount: number;
}

interface SplitPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirm: (splits: PaymentSplit[]) => void;
}

export const SplitPaymentDialog: React.FC<SplitPaymentDialogProps> = ({ isOpen, onClose, totalAmount, onConfirm }) => {
  const [splits, setSplits] = useState<PaymentSplit[]>([{ method: "CASH", amount: 0 }]);

  useEffect(() => {
    if (isOpen) {
      // Reset with one cash payment
      setSplits([{ method: "CASH", amount: totalAmount }]);
    }
  }, [isOpen, totalAmount]);

  const paymentMethods: PaymentMethod[] = ["CASH", "CARD", "MOBILE_PAYMENT", "STORE_CREDIT"];

  const methodLabels: Record<PaymentMethod, string> = {
    CASH: "Cash",
    CARD: "Card",
    MOBILE_PAYMENT: "Mobile Payment",
    STORE_CREDIT: "Store Credit",
    MIXED: "Mixed",
  };

  const methodIcons: Record<PaymentMethod, string> = {
    CASH: "💵",
    CARD: "💳",
    MOBILE_PAYMENT: "📱",
    STORE_CREDIT: "🎁",
    MIXED: "🔀",
  };

  const handleAddSplit = () => {
    const remaining = getRemainingAmount();
    if (remaining <= 0) {
      toast.error("Total amount already allocated");
      return;
    }
    setSplits([...splits, { method: "CASH", amount: remaining }]);
  };

  const handleRemoveSplit = (index: number) => {
    if (splits.length === 1) {
      toast.error("At least one payment method is required");
      return;
    }
    setSplits(splits.filter((_, i) => i !== index));
  };

  const handleMethodChange = (index: number, method: PaymentMethod) => {
    const newSplits = [...splits];
    newSplits[index].method = method;
    setSplits(newSplits);
  };

  const handleAmountChange = (index: number, amount: string) => {
    const newSplits = [...splits];
    newSplits[index].amount = parseFloat(amount) || 0;
    setSplits(newSplits);
  };

  const getTotalSplitAmount = () => {
    return splits.reduce((sum, split) => sum + split.amount, 0);
  };

  const getRemainingAmount = () => {
    return totalAmount - getTotalSplitAmount();
  };

  const handleConfirm = () => {
    // Validation
    const totalSplit = getTotalSplitAmount();

    if (totalSplit < totalAmount) {
      toast.error(`Insufficient payment: $${(totalAmount - totalSplit).toFixed(2)} remaining`);
      return;
    }

    if (totalSplit > totalAmount) {
      toast.error(`Overpayment: $${(totalSplit - totalAmount).toFixed(2)} excess`);
      return;
    }

    // Check for duplicate payment methods
    const methods = splits.map((s) => s.method);
    const uniqueMethods = new Set(methods);
    if (methods.length !== uniqueMethods.size) {
      toast.error("Duplicate payment methods not allowed");
      return;
    }

    // Check for zero amounts
    if (splits.some((s) => s.amount <= 0)) {
      toast.error("All payment amounts must be greater than zero");
      return;
    }

    onConfirm(splits);
  };

  if (!isOpen) return null;

  const remaining = getRemainingAmount();
  const isBalanced = Math.abs(remaining) < 0.01;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl" onClick={onClose}>
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Split Payment</h2>
        <p className="text-sm text-gray-600 mb-6">Split the total amount across multiple payment methods</p>

        {/* Total Amount Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
            <span className="text-sm text-gray-700">Remaining:</span>
            <span
              className={`text-lg font-semibold ${
                isBalanced ? "text-green-600" : remaining > 0 ? "text-orange-600" : "text-red-600"
              }`}
            >
              ${Math.abs(remaining).toFixed(2)}
              {remaining > 0 && " left"}
              {remaining < 0 && " over"}
            </span>
          </div>
        </div>

        {/* Payment Splits */}
        <div className="space-y-4 mb-6">
          {splits.map((split, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Payment {index + 1}</h3>
                {splits.length > 1 && (
                  <button onClick={() => handleRemoveSplit(index)} className="text-red-600 hover:text-red-800 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={split.method}
                    onChange={(e) => handleMethodChange(index, e.target.value as PaymentMethod)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {methodIcons[method]} {methodLabels[method]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={split.amount || ""}
                      onChange={(e) => handleAmountChange(index, e.target.value)}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Split Button */}
        {splits.length < 4 && (
          <button
            onClick={handleAddSplit}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors mb-6"
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Payment Method
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!isBalanced}>
            Confirm Split Payment
          </Button>
        </div>
      </div>
    </div>
  );
};
