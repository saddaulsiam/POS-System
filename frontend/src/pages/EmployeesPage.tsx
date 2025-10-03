import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { employeesAPI } from "../services/api";
import { Employee } from "../types";

type EmployeeForm = {
  name: string;
  username: string;
  pinCode: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
};

const defaultForm: EmployeeForm = {
  name: "",
  username: "",
  pinCode: "",
  role: "STAFF",
};

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState<EmployeeForm>({ ...defaultForm });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeesAPI.getAll();
      setEmployees(data);
    } catch (e) {
      toast.error("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await employeesAPI.create(form);
      toast.success("Employee added");
      setShowAddModal(false);
      setForm({ ...defaultForm });
      loadEmployees();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to add employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditId(employee.id);
    setForm({
      name: employee.name,
      username: employee.username,
      pinCode: "",
      role: employee.role,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setIsSubmitting(true);
    try {
      await employeesAPI.update(editId, form);
      toast.success("Employee updated");
      setShowEditModal(false);
      setEditId(null);
      setForm({ ...defaultForm });
      loadEmployees();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to update employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this employee?")) return;
    setDeletingId(id);
    try {
      await employeesAPI.delete(id);
      toast.success("Employee deleted");
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to delete employee");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Management</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Employees ({employees.length})</span>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
              onClick={() => {
                setShowAddModal(true);
                setForm({ ...defaultForm });
              }}
            >
              Add Employee
            </button>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : employees.length === 0 ? (
            <div className="text-gray-500 py-8 text-center">No employees found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="px-4 py-2 font-medium text-gray-900">{emp.name}</td>
                      <td className="px-4 py-2 text-gray-700">{emp.username}</td>
                      <td className="px-4 py-2 text-gray-700">{emp.role}</td>
                      <td className="px-4 py-2">
                        {emp.isActive ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEdit(emp)}>
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() => handleDelete(emp.id)}
                          disabled={deletingId === emp.id}
                        >
                          {deletingId === emp.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700">Add Employee</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PIN Code</label>
                  <input
                    name="pinCode"
                    type="password"
                    value={form.pinCode}
                    onChange={handleFormChange}
                    required
                    minLength={4}
                    maxLength={8}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold"
                >
                  {isSubmitting ? "Adding..." : "Add Employee"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700">Edit Employee</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PIN Code (leave blank to keep unchanged)</label>
                  <input
                    name="pinCode"
                    type="password"
                    value={form.pinCode}
                    onChange={handleFormChange}
                    minLength={4}
                    maxLength={8}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
