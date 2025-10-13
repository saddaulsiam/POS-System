import React from "react";
import { Input } from "../common";
import { Customer, Employee } from "../../types";
interface SalesFiltersProps {
  dateFrom: string;
  dateTo: string;
  selectedCustomer: number | "";
  selectedEmployee: number | "";
  receiptId: string;
  customers: Customer[];
  employees: Employee[];
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onCustomerChange: (value: number | "") => void;
  onEmployeeChange: (value: number | "") => void;
  onReceiptIdChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  dateFrom,
  dateTo,
  selectedCustomer,
  selectedEmployee,
  receiptId,
  customers,
  employees,
  onDateFromChange,
  onDateToChange,
  onCustomerChange,
  onEmployeeChange,
  onReceiptIdChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <Input
            label="Receipt ID"
            type="text"
            value={receiptId}
            // onChange={(e) => onReceiptIdChange(e.target.value)}
            // onBlur={(e) => onReceiptIdChange(e.target.value)}
            onChange={(e) => onReceiptIdChange(e.target.value)}
            placeholder="Enter Receipt ID"
            fullWidth
            className="h-[42px]"
          />
          <Input
            label="Date From"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            fullWidth
            className="h-[42px]"
          />
          <Input
            label="Date To"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            fullWidth
            className="h-[42px]"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => onCustomerChange(e.target.value === "" ? "" : parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
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
        <div className="flex items-center justify-end lg:ml-4">
          <button
            onClick={onClearFilters}
            className="h-[42px] px-3 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-100 text-sm shadow-sm transition flex items-center justify-center"
            style={{ minWidth: 120 }}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
