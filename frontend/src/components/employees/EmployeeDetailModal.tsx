import React from "react";
import { Employee, Sale } from "../../types";
import { Modal, Badge, Button } from "../common";
import { salesAPI } from "../../services/api/salesAPI";

interface EmployeeDetailModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onResetPin?: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  employee,
  onClose,
  onEdit,
  onResetPin,
}) => {
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [salesLoading, setSalesLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && employee) {
      setSalesLoading(true);
      salesAPI
        .getAll({ employeeId: employee.id, limit: 5, page: 1 })
        .then((res) => setSales(res.data))
        .catch(() => setSales([]))
        .finally(() => setSalesLoading(false));
    } else {
      setSales([]);
    }
  }, [isOpen, employee]);

  if (!employee) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className="flex items-center gap-2">👤 Employee Details</span>}
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
            <div className="flex gap-2 mt-1">
              <Badge variant={employee.isActive ? "success" : "danger"} size="sm">
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-xs text-gray-500">{employee.role}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 text-xs text-gray-500">Username</div>
            <div className="font-medium text-gray-900">{employee.username}</div>
          </div>
          <div>
            <div className="mb-2 text-xs text-gray-500">Created At</div>
            <div className="font-medium text-gray-900">{new Date(employee.createdAt).toLocaleString()}</div>
          </div>
        </div>

        {/* Sales summary/activity log */}
        <div>
          <div className="mb-2 text-xs text-gray-500 font-semibold">Recent Sales Activity</div>
          {salesLoading ? (
            <div className="text-gray-400 text-sm">Loading sales...</div>
          ) : sales.length === 0 ? (
            <div className="text-gray-400 text-sm">No sales found for this employee.</div>
          ) : (
            <ul className="divide-y divide-gray-100 bg-gray-50 rounded-md">
              {sales.map((sale) => (
                <li key={sale.id} className="px-3 py-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">{sale.receiptId}</span>
                    <span className="ml-2 text-xs text-gray-500">{new Date(sale.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-semibold">${sale.finalAmount.toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-6">
          {onResetPin && (
            <Button variant="secondary" onClick={() => onResetPin(employee)}>
              Reset PIN
            </Button>
          )}
          <Button variant="primary" onClick={() => onEdit(employee)}>
            Edit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
