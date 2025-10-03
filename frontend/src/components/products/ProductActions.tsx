import React from "react";

interface ProductActionsProps {
  canWrite: boolean;
  onExport: () => void;
  onImport: () => void;
  onAddNew: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ canWrite, onExport, onImport, onAddNew }) => {
  if (!canWrite) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-150 hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
        onClick={onExport}
        title="Export products to CSV"
      >
        📥 Export
      </button>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-150 hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 font-semibold"
        onClick={onImport}
        title="Import products from CSV"
      >
        📤 Import
      </button>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-all duration-150 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold tracking-wide"
        onClick={onAddNew}
      >
        Add New Product
      </button>
    </div>
  );
};
