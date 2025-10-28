import { SalarySheet } from "../services/api/salarySheetsAPI";
import { Employee } from "../types/employeeTypes";

export function generateAllSalarySlipsHTML(sheets: SalarySheet[], employees: Employee[]) {
  const store = {
    name: "POS System",
    address: "123 Main St, City, Country",
    phone: "(123) 456-7890",
  };
  const currency = "$";
  // Build table rows
  const rows = sheets
    .map((sheet) => {
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
      const joinDate = emp.joinedDate || emp.createdAt;
      const joinDateStr = joinDate ? new Date(joinDate).toLocaleDateString() : "N/A";
      return `<tr>
      <td>${emp.name}</td>
      <td>${emp.id}</td>
      <td>${joinDateStr}</td>
      <td>${sheet.month}</td>
      <td>${sheet.year}</td>
      <td>${currency}${sheet.baseSalary.toLocaleString()}</td>
      <td>${currency}${sheet.bonus.toLocaleString()}</td>
      <td>${currency}${sheet.deduction.toLocaleString()}</td>
      <td>${currency}${(sheet.baseSalary + sheet.bonus - sheet.deduction).toLocaleString()}</td>
      <td>${sheet.paid ? "Paid" : "Unpaid"}</td>
    </tr>`;
    })
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>All Salary Slips</title>
    <style>
      body { font-family: Arial, sans-serif; background: #eee; }
      .receipt-table-container { max-width: 1100px; margin: 32px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px; }
      .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
      .store-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
      .store-info { font-size: 13px; color: #555; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 15px; }
      th { background: #f5f5f5; font-weight: bold; }
      .footer { text-align: center; font-size: 13px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; }
    </style>
    </head><body>
      <div class="receipt-table-container">
        <div class="header">
          <div class="store-name">${store.name}</div>
          <div class="store-info">${store.address}<br>Phone: ${store.phone}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Join Date</th>
              <th>Month</th>
              <th>Year</th>
              <th>Base Salary</th>
              <th>Bonus</th>
              <th>Deduction</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="footer">Thank you for your service!</div>
      </div>
    </body></html>`;
}

export function generateSalarySlipHTML(sheet: SalarySheet, employee: Employee) {
  const store = {
    name: "POS System",
    address: "123 Main St, City, Country",
    phone: "(123) 456-7890",
  };
  const currency = "$";
  const joinDate = employee.joinedDate || employee.createdAt;
  const joinDateStr = joinDate ? new Date(joinDate).toLocaleDateString() : "N/A";
  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><title>Salary Slip</title>
    <style>
      body { font-family: Arial, sans-serif; background: #eee; }
      .receipt-card { max-width:480px; margin:24px auto; padding:24px; background:#fff; border-radius:8px; box-shadow:0 2px 8px #0001; }
      .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
      .store-name { font-size: 22px; font-weight: bold; }
      .store-info { font-size: 13px; color: #555; }
      .title { text-align:center; font-size:18px; font-weight:bold; margin-bottom:10px; }
      .info, .totals { margin-bottom: 16px; font-size: 15px; }
      .totals { border-top: 1px solid #ccc; padding-top: 10px; }
      .label { font-weight: bold; }
      .footer { text-align: center; font-size: 13px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; }
    </style></head><body>
      <div class="receipt-card">
        <div class="header">
          <div class="store-name">${store.name}</div>
          <div class="store-info">${store.address}<br>Phone: ${store.phone}</div>
        </div>
        <div class="title">Salary Slip</div>
        <div class="info">
          <div><span class="label">Employee:</span> ${employee.name}</div>
          <div><span class="label">Employee ID:</span> ${employee.id}</div>
          <div><span class="label">Join Date:</span> ${joinDateStr}</div>
          <div><span class="label">Month:</span> ${sheet.month} / <span class="label">Year:</span> ${sheet.year}</div>
        </div>
        <div class="totals">
          <div><span class="label">Base Salary:</span> ${currency}${sheet.baseSalary.toLocaleString()}</div>
          <div><span class="label">Bonus:</span> ${currency}${sheet.bonus.toLocaleString()}</div>
          <div><span class="label">Deduction:</span> ${currency}${sheet.deduction.toLocaleString()}</div>
          <div style="font-size:17px;margin-top:10px;"><span class="label">Total:</span> ${currency}${(
    sheet.baseSalary +
    sheet.bonus -
    sheet.deduction
  ).toLocaleString()}</div>
          <div><span class="label">Status:</span> ${sheet.paid ? "Paid" : "Unpaid"}</div>
        </div>
        <div class="footer">Thank you for your service!</div>
      </div>
    </body></html>
  `;
}
