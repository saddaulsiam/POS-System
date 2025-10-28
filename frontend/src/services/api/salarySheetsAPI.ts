import api from "../api";

export interface SalarySheet {
  id: number;
  employeeId: number;
  employee: {
    id: number;
    name: string;
    photoUrl?: string;
    email?: string;
    phone?: string;
  };
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  paid: boolean;
  paidAt?: string;
  createdAt: string;
}

export const salarySheetsAPI = {
  getAll: async (params?: { month?: number; year?: number }) => {
    const response = await api.get("/employees/salary-sheets", { params });
    return response.data;
  },
  markAsPaid: async (id: number) => {
    const response = await api.post(`/employees/salary-sheets/${id}/pay`);
    return response.data;
  },
  // Add more methods as needed (create, update, delete)
};
