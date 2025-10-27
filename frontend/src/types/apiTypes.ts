
export interface LoginRequest {
  username: string;
  pinCode: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  };
}


