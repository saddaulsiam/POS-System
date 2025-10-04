import React from "react";
import { Customer } from "../../types";
import { Badge } from "../common";

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onViewDetails?: (customer: Customer) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  // Helper function to check if today is the customer's birthday
  const isBirthday = (dateOfBirth?: string): boolean => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
  };

  // Helper function to calculate age
  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loyalty Points
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No customers found
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                      {isBirthday(customer.dateOfBirth) && (
                        <span className="ml-2" title="Happy Birthday! 🎉">
                          🎂
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.address}
                      {customer.dateOfBirth && !isBirthday(customer.dateOfBirth) && (
                        <span className="ml-2 text-xs">(Age: {calculateAge(customer.dateOfBirth)})</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.phoneNumber || "No phone"}</div>
                  <div className="text-sm text-gray-500">{customer.email || "No email"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.loyaltyPoints}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(customer.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={customer.isActive ? "success" : "danger"} rounded size="sm">
                    {customer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onViewDetails && (
                    <button onClick={() => onViewDetails(customer)} className="text-blue-600 hover:text-blue-900 mr-4">
                      👁️ View
                    </button>
                  )}
                  <button onClick={() => onEdit(customer)} className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>
                  <button onClick={() => onDelete(customer)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
