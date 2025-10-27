import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/common";
import { EmployeeModal } from "../components/employees/EmployeeModal";
import { EmployeeSearch } from "../components/employees/EmployeeSearch";
import { EmployeesTable } from "../components/employees/EmployeesTable";
import { employeesAPI } from "../services";
import { Employee } from "../types";
import { Pagination } from "../components/sales/Pagination";
import { EmployeeDetailModal } from "../components/employees/EmployeeDetailModal";

interface EmployeeFormData {
  name: string;
  username: string;
  pinCode: string;
  role: string;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line
  }, [searchTerm, currentPage]);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await employeesAPI.getAll({ page: currentPage, limit: 20, search: searchTerm || undefined });
      setEmployees(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
    setShowDetailModal(false);
  };

  const handleSubmit = async (formData: EmployeeFormData) => {
    // Ensure role is correct type
    const safeFormData = {
      ...formData,
      role: formData.role as "ADMIN" | "MANAGER" | "CASHIER" | "STAFF",
    };
    try {
      if (editingEmployee) {
        await employeesAPI.update(editingEmployee.id, safeFormData);
        toast.success("Employee updated successfully");
      } else {
        await employeesAPI.create(safeFormData);
        toast.success("Employee created successfully");
      }
      setShowModal(false);
      loadEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save employee");
      throw error;
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Delete employee "${employee.name}"?`)) return;
    try {
      await employeesAPI.delete(employee.id);
      toast.success("Employee deleted successfully");
      loadEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete employee");
    }
  };

  // View details handler
  const handleViewDetails = (employee: Employee) => {
    setViewingEmployee(employee);
    setShowDetailModal(true);
  };

  // PIN reset handler
  const handleResetPin = async (employee: Employee) => {
    const newPin = prompt("Enter new PIN for this employee (4-8 digits):");
    if (!newPin || newPin.length < 4 || newPin.length > 8) {
      toast.error("PIN must be 4-8 digits");
      return;
    }
    try {
      await employeesAPI.resetPin(employee.id, newPin);
      toast.success("PIN reset successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset PIN");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <Button variant="primary" onClick={handleAdd}>
            Add Employee
          </Button>
        </div>

        <EmployeeSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <EmployeesTable
            employees={employees}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <EmployeeModal
        isOpen={showModal}
        editingEmployee={editingEmployee}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      <EmployeeDetailModal
        isOpen={showDetailModal}
        employee={viewingEmployee}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleEdit}
        onResetPin={handleResetPin}
      />
    </div>
  );
};

export default EmployeesPage;
