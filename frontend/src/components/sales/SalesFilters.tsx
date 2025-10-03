import React from "react";
import { Input } from "../common";
import { Customer, Employee } from "../../types";

interface SalesFiltersProps {
  dateFrom: string;
  dateTo: string;
  selectedCustomer: number | "";
  selectedEmployee: number | "";
  customers: Customer[];
  employees: Employee[];
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onCustomerChange: (value: number | "") => void;
  onEmployeeChange: (value: number | "") => void;
  onClearFilters: () => void;
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  dateFrom,
  dateTo,
  selectedCustomer,
  selectedEmployee,
  customers,
  employees,
  onDateFromChange,
  onDateToChange,
  onCustomerChange,
  onEmployeeChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Date From"
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          fullWidth
        />
        <Input label="Date To" type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} fullWidth />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => onCustomerChange(e.target.value === "" ? "" : parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => onEmployeeChange(e.target.value === "" ? "" : parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
