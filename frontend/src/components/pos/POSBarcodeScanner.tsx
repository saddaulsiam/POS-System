import React from "react";
import { SearchBar, Button } from "../common";

interface POSBarcodeScannerProps {
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const POSBarcodeScanner: React.FC<POSBarcodeScannerProps> = ({ barcode, onBarcodeChange, onSubmit }) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <SearchBar
          value={barcode}
          onChange={onBarcodeChange}
          placeholder="Scan barcode or search product..."
          fullWidth={true}
          showClearButton={false}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </div>
  );
};
