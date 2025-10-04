import React, { useState } from "react";
import { Button } from "../common";

interface ProductActionsProps {
  canWrite: boolean;
  onExport: () => void;
  onExportExcel: () => void;
  onImport: () => void;
  onImportExcel: () => void;
  onAddNew: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  canWrite,
  onExport,
  onExportExcel,
  onImport,
  onImportExcel,
  onAddNew,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);

  if (!canWrite) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {/* Export Dropdown */}
      <div className="relative">
        <Button
          variant="success"
          onClick={() => setShowExportMenu(!showExportMenu)}
          title="Export products"
        >
          📥 Export
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button
              onClick={() => {
                onExport();
                setShowExportMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
            >
              📄 Export as CSV
            </button>
            <button
              onClick={() => {
                onExportExcel();
                setShowExportMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
            >
              � Export as Excel
            </button>
          </div>
        )}
      </div>

      {/* Import Dropdown */}
      <div className="relative">
        <Button
          variant="warning"
          onClick={() => setShowImportMenu(!showImportMenu)}
          title="Import products"
        >
          📤 Import
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        {showImportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button
              onClick={() => {
                onImport();
                setShowImportMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
            >
              📄 Import from CSV
            </button>
            <button
              onClick={() => {
                onImportExcel();
                setShowImportMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
            >
              � Import from Excel
            </button>
          </div>
        )}
      </div>

      <Button variant="primary" onClick={onAddNew}>
        Add New Product
      </Button>
    </div>
  );
};
