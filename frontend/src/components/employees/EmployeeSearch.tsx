import React from "react";
import { SearchBar } from "../common";

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search employees by name or username..."
        showClearButton={true}
        fullWidth={true}
      />
    </div>
  );
};
