import React from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Modal } from "../components/common/Modal";
import SalarySheetForm from "../components/salarySheet/SalarySheetForm";
import SalarySheetsTable from "../components/salarySheet/SalarySheetsTable";
import { useSalarySheets } from "../hooks/useSalarySheets";
import { salarySheetsAPI } from "../services/api/salarySheetsAPI";
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
  const now = new Date();
  const [month, setMonth] = React.useState<number | "">(now.getMonth() + 1);
  const [year, setYear] = React.useState<number | "">(now.getFullYear());
  const [showModal, setShowModal] = React.useState(false);
  const [editingSheet, setEditingSheet] = React.useState<any>(null);
  const [form, setForm] = React.useState({
    employeeId: "",
    month: "",
    year: "",
    baseSalary: "",
    bonus: "",
    deduction: "",
  });
  const { salarySheets, loading, employees, empLoading, empError, fetchSalarySheets } = useSalarySheets();

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
      fetchSalarySheets(month, year);
    } catch (err: any) {
      toast.error(err.message || "Failed to save salary sheet");
    }
  };

  const openCreateModal = () => {
    setEditingSheet(null);
    setForm({ employeeId: "", month: "", year: "", baseSalary: "", bonus: "", deduction: "" });
    setShowModal(true);
  };

  const openEditModal = (sheet: any) => {
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
    try {
      await salarySheetsAPI.delete(id);
      fetchSalarySheets(month, year);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete salary sheet");
    }
  };

  React.useEffect(() => {
    fetchSalarySheets(month, year);
    // eslint-disable-next-line
  }, [month, year, fetchSalarySheets]);

  const handleMarkAsPaid = async (id: number) => {
    try {
      await salarySheetsAPI.markAsPaid(id);
      fetchSalarySheets(month, year);
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

        <button
          className="bg-green-600 text-white px-4 py-1 rounded flex items-center"
          onClick={openCreateModal}
          type="button"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Salary Sheet
        </button>
        <button
          className="flex items-center bg-orange-600 text-white px-4 py-1 rounded"
          type="button"
          onClick={async () => {
            if (!month || !year) {
              toast.error("Select month and year to generate and print salary sheets.");
              return;
            }
            try {
              await salarySheetsAPI.bulkGenerate({ month: Number(month), year: Number(year) });
              await fetchSalarySheets(month, year);
              toast.success("Salary sheets generated successfully.");
            } catch (err: any) {
              let backendMsg = undefined;
              if (err?.response?.data?.error) backendMsg = err.response.data.error;
              else if (err?.response?.data?.message) backendMsg = err.response.data.message;
              if (backendMsg) {
                toast.dismiss();
                toast.error(backendMsg, { id: "salary-bulk-generate-error" });
              } else if (err.message && !err.message.startsWith("Request failed with status code")) {
                toast.error(err.message, { id: "salary-bulk-generate-error" });
              }
            }
          }}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Salary Sheets
        </button>
        <button
          className="flex items-center bg-gray-800 text-white px-4 py-1 rounded"
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
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print All Salary Slips
        </button>
      </div>

      <SalarySheetsTable
        salarySheets={salarySheets}
        months={months}
        loading={loading}
        onMarkAsPaid={handleMarkAsPaid}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onPrint={(sheet) => {
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
      />

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
            <SalarySheetForm
              form={form}
              employees={employees}
              months={months}
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowModal(false)}
              editingSheet={!!editingSheet}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default SalarySheetsPage;
