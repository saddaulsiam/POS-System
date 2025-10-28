import React from "react";
import { Employee } from "../../types/employeeTypes";

interface SalarySheetFormProps {
  form: {
    employeeId: string;
    month: string;
    year: string;
    baseSalary: string;
    bonus: string;
    deduction: string;
  };
  employees: Employee[];
  months: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingSheet: boolean;
}

const SalarySheetForm: React.FC<SalarySheetFormProps> = ({
  form,
  employees,
  months,
  onChange,
  onSubmit,
  onCancel,
  editingSheet,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Employee</label>
        <select
          name="employeeId"
          value={form.employeeId}
          onChange={onChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            name="year"
            value={form.year}
            onChange={onChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select year</option>
            {Array.from({ length: 6 }, (_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              const now = new Date();
              const currentMonth = now.getMonth() + 1;
              const currentYear = now.getFullYear();
              let prevMonth = currentMonth - 1;
              let prevYear = currentYear;
              if (prevMonth === 0) {
                prevMonth = 12;
                prevYear = currentYear - 1;
              }
              let nextMonth = currentMonth + 1;
              let nextYear = currentYear;
              if (nextMonth === 13) {
                nextMonth = 1;
                nextYear = currentYear + 1;
              }
              const enableYear = year === currentYear || year === prevYear || year === nextYear;
              return (
                <option key={year} value={year} disabled={!enableYear}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Month</label>
          <select
            name="month"
            value={form.month}
            onChange={onChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select month</option>
            {(() => {
              const now = new Date();
              const currentMonth = now.getMonth() + 1;
              const currentYear = now.getFullYear();
              let prevMonth = currentMonth - 1;
              let prevYear = currentYear;
              if (prevMonth === 0) {
                prevMonth = 12;
                prevYear = currentYear - 1;
              }
              let nextMonth = currentMonth + 1;
              let nextYear = currentYear;
              if (nextMonth === 13) {
                nextMonth = 1;
                nextYear = currentYear + 1;
              }
              return months.map((m, idx) => {
                const mNum = idx + 1;
                let isDisabled = true;
                if (
                  (Number(form.year) === currentYear && mNum === currentMonth) ||
                  (Number(form.year) === prevYear && mNum === prevMonth) ||
                  (Number(form.year) === nextYear && mNum === nextMonth)
                ) {
                  isDisabled = false;
                }
                return (
                  <option key={mNum} value={mNum} disabled={isDisabled}>
                    {m}
                  </option>
                );
              });
            })()}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Base Salary</label>
          <input
            type="number"
            name="baseSalary"
            value={form.baseSalary}
            onChange={onChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Bonus</label>
          <input
            type="number"
            name="bonus"
            value={form.bonus}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Deduction</label>
          <input
            type="number"
            name="deduction"
            value={form.deduction}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingSheet ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default SalarySheetForm;
