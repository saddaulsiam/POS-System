import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import {
  AuthResponse,
  LoginRequest,
  Product,
  Category,
  Customer,
  Supplier,
  Sale,
  Employee,
  PaginatedResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateSupplierRequest,
  UpdateSupplierRequest,
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

  uploadImage: async (id: number, formData: FormData): Promise<Product> => {
    const response = await api.post(`/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteImage: async (id: number): Promise<Product> => {
    const response = await api.delete(`/products/${id}/image`);
    return response.data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get("/products/alerts/low-stock");
    return response.data;
  },

  exportCSV: async (): Promise<Blob> => {
    const response = await api.get("/products/export", {
      responseType: "blob",
    });
    return response.data;
  },

  exportExcel: async (): Promise<Blob> => {
    const response = await api.get("/products/export/excel", {
      responseType: "blob",
    });
    return response.data;
  },

  downloadTemplate: async (): Promise<Blob> => {
    const response = await api.get("/products/import/template", {
      responseType: "blob",
    });
    return response.data;
  },

  downloadExcelTemplate: async (): Promise<Blob> => {
    const response = await api.get("/products/import/excel/template", {
      responseType: "blob",
    });
    return response.data;
  },

  importCSV: async (
    file: File
  ): Promise<{
    message: string;
    imported: number;
    skipped: number;
    invalid?: Array<{ row: number; data: any; errors: string[] }>;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/products/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  importExcel: async (
    file: File
  ): Promise<{
    message: string;
    imported: number;
    duplicates: number;
    invalid: number;
    invalidDetails?: Array<{ row: number; data: any; errors: string[] }>;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/products/import/excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getBarcodeImage: (id: number): string => {
    return `/api/products/${id}/barcode`;
  },

  regenerateBarcode: async (id: number): Promise<Product> => {
    const response = await api.post(`/products/${id}/barcode/regenerate`);
    return response.data;
  },
};

// Product Variants API
export const productVariantsAPI = {
  getByProduct: async (productId: number) => {
    const response = await api.get(`/product-variants/product/${productId}`);
    return response.data;
  },

  create: async (data: {
    productId: number;
    name: string;
    sku: string;
    barcode?: string;
    purchasePrice: number;
    sellingPrice: number;
    stockQuantity?: number;
    isActive?: boolean;
  }) => {
    const response = await api.post("/product-variants", data);
    return response.data;
  },

  update: async (
    id: number,
    data: {
      name?: string;
      sku?: string;
      barcode?: string;
      purchasePrice?: number;
      sellingPrice?: number;
      stockQuantity?: number;
      isActive?: boolean;
    }
  ) => {
    const response = await api.put(`/product-variants/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/product-variants/${id}`);
  },

  lookup: async (identifier: string) => {
    const response = await api.get(`/product-variants/lookup/${identifier}`);
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

// Suppliers API
export const suppliersAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Supplier>> => {
    const response = await api.get("/suppliers", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Supplier> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  create: async (data: CreateSupplierRequest): Promise<Supplier> => {
    const response = await api.post("/suppliers", data);
    return response.data;
  },

  update: async (id: number, data: UpdateSupplierRequest): Promise<Supplier> => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};

// Customers API
export const customersAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Customer>> => {
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

  // OPTION 4: Inventory Management
  adjustStock: async (data: {
    productId: number;
    productVariantId?: number;
    quantity: number;
    reason: "DAMAGED" | "EXPIRED" | "LOST" | "FOUND" | "COUNT_ADJUSTMENT";
    notes?: string;
  }) => {
    const response = await api.post("/inventory/adjust", data);
    return response.data;
  },

  transferStock: async (data: {
    productId: number;
    productVariantId?: number;
    quantity: number;
    fromLocation: string;
    toLocation: string;
    notes?: string;
  }) => {
    const response = await api.post("/inventory/transfer", data);
    return response.data;
  },

  getAlerts: async (params?: {
    alertType?: "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRING_SOON" | "DAMAGED";
    isResolved?: boolean;
  }) => {
    const response = await api.get("/inventory/alerts", { params });
    return response.data;
  },

  resolveAlert: async (alertId: number) => {
    const response = await api.put(`/inventory/alerts/${alertId}/resolve`);
    return response.data;
  },

  receivePurchaseOrder: async (data: {
    purchaseOrderId: number;
    items: Array<{
      purchaseOrderItemId: number;
      quantityReceived: number;
      notes?: string;
    }>;
  }) => {
    const response = await api.post("/inventory/receive-po", data);
    return response.data;
  },
};

// OPTION 2: Parked Sales API
export const parkedSalesAPI = {
  getAll: async () => {
    const response = await api.get("/parked-sales");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/parked-sales/${id}`);
    return response.data;
  },

  create: async (data: {
    customerId?: number;
    items: Array<{
      productId: number;
      productVariantId?: number;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    notes?: string;
  }) => {
    const response = await api.post("/parked-sales", data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/parked-sales/${id}`);
  },
};

// OPTION 2: Quick Sale Items API
export const quickSaleItemsAPI = {
  getAll: async () => {
    const response = await api.get("/quick-sale-items");
    return response.data;
  },

  create: async (data: { productId: number; displayName: string; color: string; sortOrder: number }) => {
    const response = await api.post("/quick-sale-items", data);
    return response.data;
  },

  update: async (
    id: number,
    data: {
      displayName?: string;
      color?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) => {
    const response = await api.put(`/quick-sale-items/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/quick-sale-items/${id}`);
  },
};

// OPTION 3: Loyalty Program API
export const loyaltyAPI = {
  // Customer Loyalty
  getCustomerLoyalty: async (customerId: number) => {
    const response = await api.get(`/loyalty/customers/${customerId}/loyalty-status`);
    return response.data;
  },

  awardPoints: async (data: { customerId: number; saleId: number; amount: number }) => {
    const response = await api.post("/loyalty/award-points", data);
    return response.data;
  },

  redeemPoints: async (data: {
    customerId: number;
    points: number;
    rewardType: "DISCOUNT" | "FREE_PRODUCT" | "STORE_CREDIT" | "SPECIAL_OFFER";
    rewardValue: number;
    description?: string;
  }) => {
    const response = await api.post("/loyalty/redeem-points", data);
    return response.data;
  },

  getTransactions: async (customerId: number) => {
    const response = await api.get(`/loyalty/customers/${customerId}/points-history`);
    return response.data;
  },

  getRewards: async (customerId: number) => {
    const response = await api.get(`/loyalty/customers/${customerId}/rewards`);
    return response.data;
  },

  useReward: async (rewardId: number) => {
    const response = await api.put(`/loyalty/rewards/${rewardId}/use`);
    return response.data;
  },

  // Loyalty Offers
  getAllOffers: async () => {
    const response = await api.get("/loyalty/offers");
    return response.data;
  },

  createOffer: async (data: {
    title: string;
    description?: string;
    offerType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_ITEM";
    discountValue: number;
    minimumPurchase?: number;
    requiredTier?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    startDate: string;
    endDate: string;
  }) => {
    const response = await api.post("/loyalty/offers", data);
    return response.data;
  },

  updateOffer: async (id: number, data: any) => {
    const response = await api.put(`/loyalty/offers/${id}`, data);
    return response.data;
  },

  deleteOffer: async (id: number) => {
    await api.delete(`/loyalty/offers/${id}`);
  },

  // Tier Configuration
  getTierConfig: async () => {
    const response = await api.get("/loyalty/tiers");
    return response.data;
  },

  updateTierConfig: async (data: {
    tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    minimumPoints: number;
    pointsMultiplier: number;
    discountPercentage: number;
    birthdayBonus: number;
    description?: string;
  }) => {
    const response = await api.post("/loyalty/tiers/config", data);
    return response.data;
  },

  // Customer Loyalty Status
  getLoyaltyStatus: async (customerId: number) => {
    const response = await api.get(`/loyalty/customers/${customerId}/loyalty-status`);
    return response.data;
  },

  // Statistics (Admin)
  getStatistics: async () => {
    const response = await api.get("/loyalty/statistics");
    return response.data;
  },
};

// OPTION 5: Advanced Reports & Analytics API
export const analyticsAPI = {
  getProfitMargin: async (params?: { startDate?: string; endDate?: string; categoryId?: number }) => {
    const response = await api.get("/reports/profit-margin", { params });
    return response.data;
  },

  getStockTurnover: async (params?: { days?: number; categoryId?: number }) => {
    const response = await api.get("/reports/stock-turnover", { params });
    return response.data;
  },

  getSalesTrends: async (params?: {
    period?: "daily" | "weekly" | "monthly";
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/reports/sales-trends", { params });
    return response.data;
  },

  getCustomerAnalytics: async (params?: { startDate?: string; endDate?: string; limit?: number }) => {
    const response = await api.get("/reports/customer-analytics", { params });
    return response.data;
  },
};

// OPTION 6: Receipt & Printing API
export const receiptsAPI = {
  generate: async (saleId: number, format: "PDF" | "HTML" | "THERMAL" = "PDF"): Promise<Blob> => {
    const response = await api.get(`/receipts/${saleId}/generate`, {
      params: { format },
      responseType: format === "HTML" ? "text" : "blob",
    });
    return response.data;
  },

  preview: async (saleId: number) => {
    const response = await api.get(`/receipts/${saleId}/preview`);
    return response.data;
  },

  send: async (data: { saleId: number; customerEmail: string; customerName?: string; includePDF?: boolean }) => {
    const response = await api.post("/receipts/send", data);
    return response.data;
  },

  print: async (saleId: number, printerName?: string) => {
    const response = await api.post("/receipts/print", {
      saleId,
      printerName,
    });
    return response.data;
  },

  bulkSend: async (data: { saleIds: number[]; customerEmail: string; customerName?: string }) => {
    const response = await api.post("/receipts/bulk-send", data);
    return response.data;
  },

  getStoreSettings: async () => {
    const response = await api.get("/receipts/store-settings");
    return response.data;
  },

  updateStoreSettings: async (data: {
    storeName?: string;
    storeAddress?: string;
    storePhone?: string;
    storeEmail?: string;
    taxId?: string;
    returnPolicy?: string;
  }) => {
    const response = await api.put("/receipts/store-settings", data);
    return response.data;
  },
};

// OPTION 7: Enhanced Returns & Refunds API
export const returnsAPI = {
  processReturn: async (
    saleId: number,
    data: {
      items: Array<{
        saleItemId: number;
        quantity: number;
        condition: "NEW" | "OPENED" | "DAMAGED" | "DEFECTIVE";
      }>;
      reason: string;
      refundMethod: "CASH" | "ORIGINAL_PAYMENT" | "STORE_CREDIT" | "EXCHANGE";
      restockingFee?: number;
      exchangeProductId?: number;
      notes?: string;
    }
  ) => {
    const response = await api.post(`/sales/${saleId}/return`, data);
    return response.data;
  },

  getReturnHistory: async (params?: { customerId?: number; startDate?: string; endDate?: string }) => {
    const response = await api.get("/sales/returns", { params });
    return response.data;
  },

  getReturnById: async (saleId: number) => {
    const response = await api.get(`/sales/${saleId}/return`);
    return response.data;
  },
};

// POS Settings API
export const posSettingsAPI = {
  get: async () => {
    const response = await api.get("/pos-settings");
    return response.data;
  },

  update: async (settings: {
    enableQuickSale?: boolean;
    enableSplitPayment?: boolean;
    enableParkSale?: boolean;
    enableCustomerSearch?: boolean;
    enableBarcodeScanner?: boolean;
    enableLoyaltyPoints?: boolean;
    taxRate?: number;
    receiptFooterText?: string;
  }) => {
    const response = await api.put("/pos-settings", settings);
    return response.data;
  },
};

export default api;
