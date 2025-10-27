import React from "react";
import { Employee } from "../../types";
import { Badge, Button } from "../common";

interface EmployeesTableProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onViewDetails?: (employee: Employee) => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.photo ? (
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      {employee.name?.charAt(0) || "?"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <div>{employee.email || <span className="text-gray-400">N/A</span>}</div>
                  <div className="text-xs text-gray-500">
                    {employee.phone || <span className="text-gray-300">N/A</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {employee.joinedDate ? (
                    new Date(employee.joinedDate).toLocaleDateString()
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {employee.salary !== undefined && employee.salary !== null ? (
                    `$${employee.salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{employee.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{employee.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.isActive ? (
                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm">
                      Inactive
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  {onViewDetails && (
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(employee)}>
                      View
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(employee)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
