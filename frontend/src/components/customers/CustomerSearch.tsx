import React from "react";
import { SearchBar } from "../common";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search customers by name, phone, or email..."
        showClearButton={true}
        fullWidth={true}
      />
    </div>
  );
};
