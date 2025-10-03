import React from "react";
import { Category } from "../../types";

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: Category[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categories,
}) => {
  return (
    <div className="flex gap-2 w-full md:w-auto">
      <input
        type="text"
        placeholder="Search by name or SKU..."
        className="border rounded px-3 py-2 w-full md:w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="border rounded px-3 py-2"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};
