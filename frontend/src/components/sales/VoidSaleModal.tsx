import React, { useState } from "react";
import { Sale } from "../../types";

interface VoidSaleModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, password: string, restoreStock: boolean) => void;
  requirePassword: boolean;
  isLoading: boolean;
}

export const VoidSaleModal: React.FC<VoidSaleModalProps> = ({
  sale,
  isOpen,
  onClose,
  onConfirm,
  requirePassword,
  isLoading,
}) => {
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [restoreStock, setRestoreStock] = useState(true);

  if (!isOpen || !sale) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }
    if (requirePassword && !password.trim()) {
      return;
    }
    onConfirm(reason, password, restoreStock);
  };

  const handleClose = () => {
    setReason("");
    setPassword("");
    setRestoreStock(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Void Sale</h3>
          <p className="text-sm text-gray-500 mt-1">
            Sale #{sale.receiptId} - ${sale.finalAmount.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm font-medium">⚠️ Warning</p>
            <p className="text-red-700 text-sm mt-1">
              This action cannot be undone. The sale will be marked as voided and removed from reports.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Void <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Enter the reason for voiding this sale..."
                required
                disabled={isLoading}
              />
            </div>

            {requirePassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin/Manager Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="restoreStock"
                checked={restoreStock}
                onChange={(e) => setRestoreStock(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="restoreStock" className="ml-2 block text-sm text-gray-700">
                Restore stock quantities
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !reason.trim() || (requirePassword && !password.trim())}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Voiding..." : "Void Sale"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
