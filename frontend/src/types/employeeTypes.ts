export interface EmployeeForm {
  name: string;
  username: string;
  pinCode: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
}

export interface Employee {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
