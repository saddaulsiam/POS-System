import React from "react";
import { Button, BackButton } from "../common";

interface EmployeeDetailsViewProps {
  employee: any;
  onBack: () => void;
  onEdit: (employee: any) => void;
  onResetPin: (employee: any) => void;
}

const EmployeeDetailsView: React.FC<EmployeeDetailsViewProps> = ({ employee, onBack, onEdit, onResetPin }) => {
  if (!employee) return null;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <BackButton onClick={onBack} label="Back to Employees" className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl">
              {employee.photo ? (
                <img src={employee.photo} alt="Employee" className="w-full h-full object-cover rounded-full" />
              ) : (
                employee.name?.charAt(0)
              )}
            </span>
            {employee.name}
          </h1>
          <p className="text-gray-600 mt-1">{employee.email || employee.phone || employee.role}</p>
        </div>

        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-500">Phone</dt>
                  <dd className="text-sm font-medium text-gray-900">{employee.phone || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Email</dt>
                  <dd className="text-sm font-medium text-gray-900">{employee.email || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Role</dt>
                  <dd className="text-sm font-medium text-gray-900">{employee.role || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Status</dt>
                  <dd className="text-sm font-medium">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        employee.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.isActive ? "Active" : "Inactive"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Employment Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-500">Employee ID</dt>
                  <dd className="text-sm font-medium text-gray-900">#{employee.id}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Salary</dt>
                  <dd className="text-lg font-medium text-blue-600">
                    {employee.salary !== undefined && employee.salary !== null && !isNaN(Number(employee.salary)) ? (
                      `$${Number(employee.salary).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Joined</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {employee.joinedDate ? (
                      new Date(employee.joinedDate).toLocaleDateString()
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Timeline/Notes Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Contract</h3>
              <p className="text-md text-gray-700">
                {employee.contractDetails || <span className="text-gray-400">N/A</span>}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
              <p className="text-md text-gray-700 whitespace-pre-line">
                {employee.notes || <span className="text-gray-400">N/A</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="primary" onClick={() => onEdit(employee)}>
            Edit Employee
          </Button>
          <Button variant="secondary" onClick={() => onResetPin(employee)}>
            Reset PIN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsView;
