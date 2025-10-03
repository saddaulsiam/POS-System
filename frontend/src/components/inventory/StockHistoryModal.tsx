import React from "react";
import { Product, StockMovement } from "../../types";

interface StockHistoryModalProps {
  isOpen: boolean;
  product: Product | null;
  history: StockMovement[];
  onClose: () => void;
}

export const StockHistoryModal: React.FC<StockHistoryModalProps> = ({ isOpen, product, history, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[80vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Stock History for {product.name}</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No stock movements found.</p>
        ) : (
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2 text-gray-900">{new Date(m.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-700">{m.movementType}</td>
                    <td className="px-4 py-2 text-gray-900">{m.quantity}</td>
                    <td className="px-4 py-2 text-gray-600">{m.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
