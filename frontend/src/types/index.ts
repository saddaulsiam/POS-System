export interface User {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "CASHIER";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  pinCode: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId: number;
  supplierId?: number;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isWeighted: boolean;
  isActive: boolean;
  taxRate: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  supplier?: Supplier;
}

export interface Customer {
  id: number;
  name: string;
  phoneNumber?: string;
  email?: string;
  loyaltyPoints: number;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "CASHIER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  discount?: number;
}

export interface Sale {
  id: number;
  receiptId: string;
  employeeId: number;
  customerId?: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cashReceived?: number;
  changeGiven?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
  customer?: Customer;
  saleItems?: SaleItem[];
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  priceAtSale: number;
  discount: number;
  subtotal: number;
  product?: Product;
}

export interface StockMovement {
  id: number;
  productId: number;
  movementType: StockMovementType;
  quantity: number;
  reason?: string;
  reference?: string;
  createdBy?: number;
  createdAt: string;
  product?: Product;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  productId: number;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity: number;
  product?: Product;
}

export interface CashDrawer {
  id: number;
  employeeId: number;
  openingBalance: number;
  closingBalance?: number;
  expectedBalance?: number;
  difference?: number;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt?: string;
  employee?: Employee;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
}

export interface DailySalesReport {
  date: string;
  summary: {
    totalSales: number;
    totalTax: number;
    totalDiscount: number;
    totalTransactions: number;
  };
  salesByPaymentMethod: Array<{
    paymentMethod: PaymentMethod;
    _sum: { finalAmount: number };
    _count: { id: number };
  }>;
  topProducts: Array<{
    productId: number;
    _sum: { quantity: number; subtotal: number };
    product?: Product;
  }>;
}

export interface InventoryReport {
  totalProducts: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  products: Product[];
  lowStockItems: Product[];
  outOfStockItems: Product[];
}

export interface EmployeePerformanceReport {
  startDate: string;
  endDate: string;
  performance: Array<{
    employee: Employee;
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
  }>;
}

export interface ProductPerformanceReport {
  startDate: string;
  endDate: string;
  products: Array<{
    product: Product;
    totalQuantitySold: number;
    totalRevenue: number;
    totalTransactions: number;
    estimatedProfit: number;
  }>;
}

export type PaymentMethod = "CASH" | "CARD" | "MOBILE_PAYMENT" | "STORE_CREDIT" | "MIXED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type StockMovementType = "SALE" | "PURCHASE" | "ADJUSTMENT" | "RETURN" | "DAMAGED" | "EXPIRED";
export type PurchaseOrderStatus = "PENDING" | "ORDERED" | "PARTIALLY_RECEIVED" | "RECEIVED" | "CANCELLED";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId: number;
  supplierId?: number;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isWeighted: boolean;
  taxRate: number;
  image?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
}

export interface CreateCustomerRequest {
  name: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  loyaltyPoints?: number;
  isActive?: boolean;
}

export interface CreateSaleRequest {
  customerId?: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    discount?: number;
  }>;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  notes?: string;
  discountAmount?: number;
}

export interface ProcessPaymentRequest {
  saleId: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
}

export interface WeighingScaleReading {
  weight: number;
  unit: "kg" | "lb";
  stable: boolean;
}

export interface BarcodeScanResult {
  barcode: string;
  product?: Product;
}
