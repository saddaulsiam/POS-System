import React, { useState, useEffect } from "react";
import { Employee } from "../../types";
import { Button, Input, Modal } from "../common";

interface EmployeeFormData {
  name: string;
  username: string;
  pinCode: string;
  role: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  editingEmployee: Employee | null;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, editingEmployee, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    username: "",
    pinCode: "",
    role: "STAFF",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        username: editingEmployee.username,
        pinCode: "",
        role: editingEmployee.role,
      });
    } else {
      setFormData({
        name: "",
        username: "",
        pinCode: "",
        role: "STAFF",
      });
    }
  }, [editingEmployee, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isNewEmployee = !editingEmployee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isNewEmployee ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            <span className="text-2xl">{isNewEmployee ? "➕" : "✏️"}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isNewEmployee ? "Add New Employee" : "Edit Employee"}</h2>
            <p className="text-xs text-gray-500">
              {isNewEmployee ? "Add employee details for system access" : "Update employee information"}
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Required Field Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-blue-900">📋 Required Information</span>
          </div>
          <Input
            label="Employee Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            fullWidth
            placeholder="Enter full name"
            className="bg-white"
          />
        </div>

        {/* Account Information Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-900">🔐 Account Details</span>
            <span className="text-xs text-gray-500">(Required)</span>
          </div>
          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Unique username"
              className="bg-white"
            />
            <Input
              label={`PIN Code${editingEmployee ? " (leave blank to keep unchanged)" : ""}`}
              type="password"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              minLength={4}
              maxLength={8}
              required={isNewEmployee}
              fullWidth
              placeholder="4-8 digit PIN"
              className="bg-white"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="CASHIER">Cashier</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className={`px-8 ${
              isNewEmployee
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            } shadow-md`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isNewEmployee ? "➕ Add Employee" : "💾 Update Employee"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
