import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../common";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface CartItem {
  productId: number;
  productVariantId?: number;
  productName: string;
  quantity: number;
  price: number;
}

interface ParkSaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  customerId?: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  onConfirm: (notes: string) => void;
}

export const ParkSaleDialog: React.FC<ParkSaleDialogProps> = ({
  isOpen,
  onClose,
  cartItems,
  // customerId, // Not used in this component
  subtotal,
  taxAmount,
  discountAmount,
  onConfirm,
}) => {
  const [notes, setNotes] = useState("");
  const { settings } = useSettings();

  const handleConfirm = () => {
    if (cartItems.length === 0) {
      toast.error("Cannot park an empty cart");
      return;
    }

    onConfirm(notes);
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  const total = subtotal + taxAmount - discountAmount;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl" onClick={handleClose}>
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Park Sale</h2>
        <p className="text-sm text-gray-600 mb-6">Save this sale to resume later</p>

        {/* Sale Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Items:</span>
            <span className="font-semibold text-gray-900">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item
              {cartItems.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(subtotal, settings)}</span>
          </div>
          {taxAmount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tax:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(taxAmount, settings)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Discount:</span>
              <span className="font-semibold text-red-600">-{formatCurrency(discountAmount, settings)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-300">
            <span className="text-sm font-semibold text-gray-700">Total:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(total, settings)}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Items in Cart:</h3>
          <div className="max-h-40 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × {formatCurrency(item.price, settings)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.quantity * item.price, settings)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this parked sale..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">This sale will be saved and can be resumed anytime</p>
        </div>

        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs text-blue-800">
              <p className="font-semibold mb-1">Parked Sales Expire</p>
              <p>This sale will expire after 7 days. You can resume it anytime before expiration.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={cartItems.length === 0}
            className="flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            Park Sale
          </Button>
        </div>
      </div>
    </div>
  );
};
