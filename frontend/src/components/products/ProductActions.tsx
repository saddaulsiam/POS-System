import React from "react";
import { Button } from "../common";

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
      <Button variant="success" onClick={onExport} title="Export products to CSV">
        📥 Export
      </Button>
      <Button variant="warning" onClick={onImport} title="Import products from CSV">
        📤 Import
      </Button>
      <Button variant="primary" onClick={onAddNew}>
        Add New Product
      </Button>
    </div>
  );
};
