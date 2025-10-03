import React from "react";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customers by name, phone, or email..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onClear}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
