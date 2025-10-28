import React, { useEffect, useState } from "react";
import { salarySheetsAPI, SalarySheet } from "../services/api/salarySheetsAPI";

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
  const [salarySheets, setSalarySheets] = useState<SalarySheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalarySheets();
  }, [month, year]);

  const fetchSalarySheets = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (month !== "") params.month = month;
      if (year !== "") params.year = year;
      // Remove employeeId if present in any form
      if ("employeeId" in params) {
        delete params.employeeId;
      }
      console.log("[SalarySheetsPage] Fetching salary sheets with params:", params);
      const res = await salarySheetsAPI.getAll(params);
      setSalarySheets(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch salary sheets");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await salarySheetsAPI.markAsPaid(id);
      fetchSalarySheets();
    } catch (err: any) {
      setError(err.message || "Failed to mark as paid");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Salary Sheets</h1>
      <div className="flex gap-4 mb-4">
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
        <input
          className="border rounded px-2 py-1 w-24"
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={fetchSalarySheets} disabled={loading}>
          Filter
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
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
                <td className="px-4 py-2 border">
                  {!sheet.paid && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleMarkAsPaid(sheet.id)}
                    >
                      Mark as Paid
                    </button>
                  )}
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
      {loading && <div className="mt-4 text-gray-500">Loading...</div>}
    </div>
  );
};

export default SalarySheetsPage;
