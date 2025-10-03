import React from "react";

interface POSBarcodeScannerProps {
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const POSBarcodeScanner: React.FC<POSBarcodeScannerProps> = ({ barcode, onBarcodeChange, onSubmit }) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Scan barcode or search product..."
          value={barcode}
          onChange={(e) => onBarcodeChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>
    </div>
  );
};
