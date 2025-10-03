import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import {
  AuthResponse,
  LoginRequest,
  Product,
  Category,
  Customer,
  Sale,
  Employee,
  PaginatedResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateSaleRequest,
  DailySalesReport,
  InventoryReport,
  EmployeePerformanceReport,
  ProductPerformanceReport,
} from "../types";

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log("🔄 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      params: config.params,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token added to request");
    } else {
      console.log("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error Response:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      console.log("🚪 401 Unauthorized - Clearing auth data");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast.error("Session expired. Please log in again.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  updateProfile: async (data: { name?: string; username?: string }) => {
    const response = await api.put("/profile/me", data);
    return response.data;
  },
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log("🔐 Attempting login with credentials:", {
        username: credentials.username,
        pinCodeLength: credentials.pinCode?.length || 0,
      });

      const response = await api.post<AuthResponse>("/auth/login", credentials);

      console.log("✅ Login successful:", {
        status: response.status,
        hasToken: !!response.data.token,
        tokenLength: response.data.token?.length || 0,
        user: response.data.user,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  changePin: async (data: { currentPin: string; newPin: string }) => {
    const response = await api.put("/auth/change-pin", data);
    return response.data;
  },
};

// Export updateProfile and changePin for direct import
export const updateProfile = authAPI.updateProfile;
export const changePin = authAPI.changePin;

export const productsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getByBarcode: async (barcode: string): Promise<Product> => {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductRequest): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get("/products/alerts/low-stock");
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  create: async (data: { name: string }): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  update: async (id: number, data: { name: string }): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Customers API
export const customersAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get("/customers", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  getByPhone: async (phone: string): Promise<Customer> => {
    const response = await api.get(`/customers/phone/${phone}`);
    return response.data;
  },

  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await api.post("/customers", data);
    return response.data;
  },

  update: async (id: number, data: UpdateCustomerRequest): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

// Sales API
export const salesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    employeeId?: number;
    customerId?: number;
  }): Promise<PaginatedResponse<Sale>> => {
    const response = await api.get("/sales", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  getByReceiptId: async (receiptId: string): Promise<Sale> => {
    const response = await api.get(`/sales/receipt/${receiptId}`);
    return response.data;
  },

  create: async (data: CreateSaleRequest): Promise<Sale> => {
    const response = await api.post("/sales", data);
    return response.data;
  },

  processRefund: async (
    id: number,
    data: {
      items: Array<{ saleItemId: number; quantity: number }>;
      reason?: string;
    }
  ): Promise<Sale> => {
    const response = await api.post(`/sales/${id}/refund`, data);
    return response.data;
  },

  void: async (id: number, reason?: string): Promise<void> => {
    await api.post(`/sales/${id}/void`, { reason });
  },
};

// Employees API
export const employeesAPI = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get("/employees");
    return response.data;
  },

  create: async (data: {
    name: string;
    username: string;
    pinCode: string;
    role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  }): Promise<Employee> => {
    const response = await api.post("/employees", data);
    return response.data;
  },

  update: async (
    id: number,
    data: {
      name?: string;
      username?: string;
      pinCode?: string;
      role?: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
      isActive?: boolean;
    }
  ): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};

// Reports API
export const reportsAPI = {
  getDailySales: async (date?: string): Promise<DailySalesReport> => {
    const response = await api.get("/reports/daily-sales", {
      params: { date },
    });
    return response.data;
  },

  getSalesRange: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get("/reports/sales-range", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getInventory: async (): Promise<InventoryReport> => {
    const response = await api.get("/reports/inventory");
    return response.data;
  },

  getEmployeePerformance: async (startDate?: string, endDate?: string): Promise<EmployeePerformanceReport> => {
    const response = await api.get("/reports/employee-performance", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getProductPerformance: async (
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<ProductPerformanceReport> => {
    const response = await api.get("/reports/product-performance", {
      params: { startDate, endDate, limit },
    });
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  updateStock: async (
    productId: number,
    data: {
      quantity: number;
      movementType: "PURCHASE" | "ADJUSTMENT" | "RETURN" | "DAMAGED" | "EXPIRED";
      reason?: string;
      reference?: string;
    }
  ) => {
    const response = await api.post(`/inventory/adjust`, {
      productId,
      ...data,
    });
    return response.data;
  },

  getStockMovements: async (
    productId?: number,
    params?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    }
  ) => {
    const response = await api.get("/inventory/movements", {
      params: { productId, ...params },
    });
    return response.data;
  },
};

export default api;
