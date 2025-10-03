import React from "react";
import { SearchBar } from "../common";

interface SupplierSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SupplierSearch: React.FC<SupplierSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search suppliers by name, contact, phone, or email..."
        showClearButton={true}
        fullWidth={true}
      />
    </div>
  );
};
