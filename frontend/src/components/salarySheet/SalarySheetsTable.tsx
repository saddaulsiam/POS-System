import React from "react";
import { SalarySheet } from "../../services/api/salarySheetsAPI";

interface SalarySheetsTableProps {
  salarySheets: SalarySheet[];
  months: string[];
  loading: boolean;
  onMarkAsPaid: (id: number) => void;
  onEdit: (sheet: SalarySheet) => void;
  onDelete: (id: number) => void;
  onPrint: (sheet: SalarySheet) => void;
}

const SalarySheetsTable: React.FC<SalarySheetsTableProps> = ({
  salarySheets,
  months,
  loading,
  onMarkAsPaid,
  onEdit,
  onDelete,
  onPrint,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Employee</th>
            <th className="px-4 py-2 border">Month</th>
            <th className="px-4 py-2 border">Year</th>
            <th className="px-4 py-2 border">Base Salary</th>
            <th className="px-4 py-2 border">Bonus</th>
            <th className="px-4 py-2 border">Deduction</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {salarySheets.map((sheet) => (
            <tr key={sheet.id} className="text-center">
              <td className="px-4 py-2 border flex items-center gap-2">
                {sheet.employee.photoUrl && (
                  <img src={sheet.employee.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                )}
                <span>{sheet.employee.name}</span>
              </td>
              <td className="px-4 py-2 border">{months[sheet.month - 1]}</td>
              <td className="px-4 py-2 border">{sheet.year}</td>
              <td className="px-4 py-2 border">${sheet.baseSalary.toLocaleString()}</td>
              <td className="px-4 py-2 border">${sheet.bonus.toLocaleString()}</td>
              <td className="px-4 py-2 border">${sheet.deduction.toLocaleString()}</td>
              <td className="px-4 py-2 border font-semibold">
                ${(sheet.baseSalary + sheet.bonus - sheet.deduction).toLocaleString()}
              </td>
              <td className="px-4 py-2 border">
                {sheet.paid ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">Unpaid</span>
                )}
              </td>
              <td className="px-4 py-2 border flex gap-2 justify-center">
                {!sheet.paid && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                    onClick={() => onMarkAsPaid(sheet.id)}
                  >
                    Mark as Paid
                  </button>
                )}
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onEdit(sheet)}
                  disabled={sheet.paid}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onDelete(sheet.id)}
                  disabled={sheet.paid}
                >
                  Delete
                </button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded text-xs" onClick={() => onPrint(sheet)}>
                  Print
                </button>
              </td>
            </tr>
          ))}
          {salarySheets.length === 0 && !loading && (
            <tr>
              <td colSpan={9} className="text-center py-8 text-gray-500">
                No salary sheets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalarySheetsTable;
