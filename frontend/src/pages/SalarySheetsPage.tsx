import React from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Modal } from "../components/common/Modal";
import { employeesAPI } from "../services/api/employeesAPI";
import { SalarySheet, salarySheetsAPI } from "../services/api/salarySheetsAPI";
import { Employee } from "../types/employeeTypes";
import { generateAllSalarySlipsHTML, generateSalarySlipHTML } from "../utils/SalarySlipGenerator";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SalarySheetsPage: React.FC = () => {
  const [salarySheets, setSalarySheets] = React.useState<SalarySheet[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [month, setMonth] = React.useState<number | "">("");
  const [year, setYear] = React.useState<number | "">("");
  const [showModal, setShowModal] = React.useState(false);
  const [editingSheet, setEditingSheet] = React.useState<SalarySheet | null>(null);
  const [form, setForm] = React.useState({
    employeeId: "",
    month: "",
    year: "",
    baseSalary: "",
    bonus: "",
    deduction: "",
  });
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = React.useState(false);
  const [empError, setEmpError] = React.useState<string | null>(null);

  // Fetch employees for dropdown
  React.useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      setEmpError(null);
      try {
        const res = await employeesAPI.getAll({ limit: 1000 });
        setEmployees(res.data);
      } catch (err: any) {
        setEmpError("Failed to load employees");
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "employeeId") {
      const selectedEmp = employees.find((emp) => emp.id === Number(value));
      setForm((prev) => ({
        ...prev,
        employeeId: value,
        baseSalary: selectedEmp && typeof selectedEmp.salary === "number" ? selectedEmp.salary.toString() : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const duplicate = salarySheets.find(
      (sheet) =>
        sheet.employeeId === Number(form.employeeId) &&
        sheet.month === Number(form.month) &&
        sheet.year === Number(form.year) &&
        (!editingSheet || sheet.id !== editingSheet.id)
    );
    if (duplicate) {
      toast.error("A salary sheet for this employee, month, and year already exists.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        employeeId: Number(form.employeeId),
        month: Number(form.month),
        year: Number(form.year),
        baseSalary: Number(form.baseSalary),
        bonus: Number(form.bonus),
        deduction: Number(form.deduction),
      };
      if (editingSheet) {
        await salarySheetsAPI.update(editingSheet.id, payload);
      } else {
        await salarySheetsAPI.create(payload);
      }
      setShowModal(false);
      fetchSalarySheets();
    } catch (err: any) {
      toast.error(err.message || "Failed to save salary sheet");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSheet(null);
    setForm({ employeeId: "", month: "", year: "", baseSalary: "", bonus: "", deduction: "" });
    setShowModal(true);
  };

  const openEditModal = (sheet: SalarySheet) => {
    setEditingSheet(sheet);
    setForm({
      employeeId: sheet.employeeId.toString(),
      month: sheet.month.toString(),
      year: sheet.year.toString(),
      baseSalary: sheet.baseSalary.toString(),
      bonus: sheet.bonus.toString(),
      deduction: sheet.deduction.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this salary sheet?")) return;
    setLoading(true);
    try {
      await salarySheetsAPI.delete(id);
      fetchSalarySheets();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete salary sheet");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSalarySheets();
    // eslint-disable-next-line
  }, [month, year]);

  const fetchSalarySheets = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (month !== "") params.month = month;
      if (year !== "") params.year = year;
      // Remove employeeId if present in any form
      if ("employeeId" in params) {
        delete params.employeeId;
      }
      const res = await salarySheetsAPI.getAll(params);
      setSalarySheets(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch salary sheets");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await salarySheetsAPI.markAsPaid(id);
      fetchSalarySheets();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark as paid");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Salary Sheets</h1>
      <div className="flex gap-4 mb-4 no-print">
        <select
          className="border rounded px-2 py-1"
          value={month}
          onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">All Months</option>
          {months.map((m, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 w-24"
          value={year}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">All Years</option>
          {Array.from({ length: 6 }, (_, i) => {
            const y = new Date().getFullYear() - 5 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={openCreateModal} type="button">
          + Add Salary Sheet
        </button>
        <button
          className="bg-orange-600 text-white px-4 py-1 rounded"
          type="button"
          onClick={async () => {
            if (!month || !year) {
              toast.error("Select month and year to generate and print salary sheets.");
              return;
            }
            setLoading(true);
            let createdCount = 0;
            for (const emp of employees) {
              const exists = salarySheets.some(
                (sheet) => sheet.employeeId === emp.id && sheet.month === month && sheet.year === year
              );
              if (!exists && typeof emp.salary === "number") {
                try {
                  await salarySheetsAPI.create({
                    employeeId: emp.id,
                    month,
                    year,
                    baseSalary: emp.salary,
                    bonus: 0,
                    deduction: 0,
                  });
                  createdCount++;
                } catch (err) {
                  // Optionally handle per-employee error
                }
              }
            }
            await fetchSalarySheets();
            setLoading(false);
            if (createdCount === 0) {
              toast.error(
                "No new salary sheets were created. All employees already have sheets for this period or missing salary."
              );
              return;
            }
          }}
        >
          Generate Salary Sheets
        </button>
        <button
          className="bg-gray-800 text-white px-4 py-1 rounded"
          type="button"
          onClick={() => {
            if (!salarySheets.length) {
              toast.error("No salary sheets to print.");
              return;
            }
            const html = generateAllSalarySlipsHTML(salarySheets, employees);
            const printWindow = window.open("", "", "width=800,height=1000");
            if (printWindow) {
              printWindow.document.write(html);
              printWindow.document.close();
              printWindow.focus();
              setTimeout(() => printWindow.print(), 400);
            }
          }}
        >
          Print All Salary Slips
        </button>
      </div>

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
                      onClick={() => handleMarkAsPaid(sheet.id)}
                    >
                      Mark as Paid
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    onClick={() => openEditModal(sheet)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    onClick={() => handleDelete(sheet.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
                    onClick={() => {
                      let emp = employees.find((e) => e.id === sheet.employeeId);
                      if (!emp) {
                        emp = {
                          id: sheet.employeeId,
                          name: sheet.employee?.name || "Unknown",
                          username: "",
                          role: "STAFF",
                          isActive: true,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                      }
                      const html = generateSalarySlipHTML(sheet, emp);
                      const printWindow = window.open("", "", "width=600,height=800");
                      if (printWindow) {
                        printWindow.document.write(html);
                        printWindow.document.close();
                        printWindow.focus();
                        setTimeout(() => printWindow.print(), 300);
                      }
                    }}
                  >
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

      {/* Modal for create/edit salary sheet */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingSheet ? "Edit Salary Sheet" : "Add Salary Sheet"}
          size="md"
        >
          {empLoading ? (
            <div className="text-gray-500">Loading employees...</div>
          ) : empError ? (
            <div className="text-red-500">{empError}</div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleFormChange}
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
                  <label className="block text-sm font-medium mb-1">Month</label>
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select month</option>
                    {months.map((m, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 6 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Deduction</label>
                  <input
                    type="number"
                    name="deduction"
                    value={form.deduction}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editingSheet ? "Update" : "Create"}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default SalarySheetsPage;
