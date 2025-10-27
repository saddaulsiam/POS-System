// Employee-related types

export interface Employee {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
