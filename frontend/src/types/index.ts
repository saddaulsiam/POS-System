export interface User {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
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
  unit?: string;
  hasVariants?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  supplier?: Supplier;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku: string;
  barcode?: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface Customer {
  id: number;
  name: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
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
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
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

export interface CreateSupplierRequest {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

export interface CreateCustomerRequest {
  name: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
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

// ============================================
// OPTION 2: Advanced POS Features
// ============================================

export interface PaymentSplit {
  id: number;
  saleId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  createdAt: string;
}

export interface ParkedSale {
  id: number;
  employeeId: number;
  customerId?: number;
  items: any[]; // JSON field
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  notes?: string;
  parkedAt: string;
  expiresAt: string;
  employee?: Employee;
  customer?: Customer;
}

export interface QuickSaleItem {
  id: number;
  productId: number;
  displayName: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  product?: Product;
}

export interface CreateParkedSaleRequest {
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
}

export interface CreateQuickSaleItemRequest {
  productId: number;
  displayName: string;
  color: string;
  sortOrder: number;
}

// ============================================
// OPTION 3: Loyalty Program
// ============================================

export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
export type PointsTransactionType = "EARNED" | "REDEEMED" | "EXPIRED" | "ADJUSTED" | "BIRTHDAY_BONUS";
export type RewardType = "DISCOUNT" | "FREE_PRODUCT" | "STORE_CREDIT" | "SPECIAL_OFFER";

export interface PointsTransaction {
  id: number;
  customerId: number;
  saleId?: number;
  type: PointsTransactionType;
  points: number;
  description?: string;
  createdAt: string;
  customer?: Customer;
  sale?: Sale;
}

export interface LoyaltyReward {
  id: number;
  customerId: number;
  rewardType: RewardType;
  rewardValue: number;
  pointsCost: number;
  description?: string;
  expiresAt?: string;
  redeemedAt?: string;
  createdAt: string;
  customer?: Customer;
}

export interface LoyaltyOffer {
  id: number;
  title: string;
  description?: string;
  offerType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_ITEM";
  discountValue: number;
  minimumPurchase?: number;
  requiredTier?: LoyaltyTier;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoyaltyTierConfig {
  id: number;
  tier: LoyaltyTier;
  minimumPoints: number;
  pointsMultiplier: number;
  discountPercentage: number;
  birthdayBonus: number;
}

export interface RedeemPointsRequest {
  customerId: number;
  points: number;
  rewardType: RewardType;
  rewardValue: number;
  description?: string;
}

export interface AwardPointsRequest {
  customerId: number;
  saleId: number;
  amount: number;
}

// ============================================
// OPTION 4: Inventory Features
// ============================================

export type AlertType = "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRING_SOON" | "DAMAGED";

export interface StockAlert {
  id: number;
  productId: number;
  alertType: AlertType;
  message: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: number;
  createdAt: string;
  product?: Product;
  resolver?: Employee;
}

export interface StockAdjustmentRequest {
  productId: number;
  productVariantId?: number;
  quantity: number;
  reason: "DAMAGED" | "EXPIRED" | "LOST" | "FOUND" | "COUNT_ADJUSTMENT";
  notes?: string;
}

export interface StockTransferRequest {
  productId: number;
  productVariantId?: number;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  notes?: string;
}

export interface ReceivePurchaseOrderRequest {
  purchaseOrderId: number;
  items: Array<{
    purchaseOrderItemId: number;
    quantityReceived: number;
    notes?: string;
  }>;
}

// ============================================
// OPTION 5: Reports & Analytics
// ============================================

export interface ProfitMarginReport {
  overall: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
  };
  byCategory: Array<{
    categoryId: number;
    categoryName: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
}

export interface StockTurnoverReport {
  summary: {
    totalProducts: number;
    averageTurnover: number;
    fastMoving: number;
    slowMoving: number;
  };
  products: Array<{
    productId: number;
    productName: string;
    stockQuantity: number;
    soldQuantity: number;
    turnoverRate: number;
    daysToSellOut: number;
    status: "FAST_MOVING" | "MODERATE" | "SLOW_MOVING" | "STAGNANT";
  }>;
}

export interface SalesTrendsReport {
  period: string;
  trends: Array<{
    period: string;
    transactionCount: number;
    totalRevenue: number;
    averageTransaction: number;
  }>;
}

export interface CustomerAnalyticsReport {
  totalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
  topCustomers: Array<{
    customerId: number;
    customerName: string;
    totalSpent: number;
    orderCount: number;
    averageOrder: number;
    loyaltyTier?: LoyaltyTier;
    lastPurchase: string;
  }>;
}

// ============================================
// OPTION 6: Receipt & Printing
// ============================================

export interface ReceiptPreview {
  sale: Sale;
  settings: StoreSettings;
}

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  taxId?: string;
  returnPolicy?: string;
}

export interface SendReceiptRequest {
  saleId: number;
  customerEmail: string;
  customerName?: string;
  includePDF?: boolean;
}

export interface PrintReceiptRequest {
  saleId: number;
  printerName?: string;
}

// ============================================
// OPTION 7: Returns & Refunds
// ============================================

export type ItemCondition = "NEW" | "OPENED" | "DAMAGED" | "DEFECTIVE";
export type RefundMethod = "CASH" | "ORIGINAL_PAYMENT" | "STORE_CREDIT" | "EXCHANGE";

export interface ReturnRequest {
  items: Array<{
    saleItemId: number;
    quantity: number;
    condition: ItemCondition;
  }>;
  reason: string;
  refundMethod: RefundMethod;
  restockingFee?: number;
  exchangeProductId?: number;
  notes?: string;
}

export interface ReturnSale extends Sale {
  returnItems?: ReturnItem[];
}

export interface ReturnItem {
  id: number;
  saleItemId: number;
  quantity: number;
  condition: ItemCondition;
  refundAmount: number;
}

export interface ReturnHistory {
  totalReturns: number;
  totalRefunded: number;
  returns: Sale[];
}

// ============================================
// Extended Types with New Options
// ============================================

export interface ExtendedCustomer extends Customer {
  loyaltyTier?: LoyaltyTier;
  dateOfBirth?: string;
  pointsTransactions?: PointsTransaction[];
  rewards?: LoyaltyReward[];
}

export interface ExtendedSale extends Sale {
  discountReason?: string;
  pointsEarned?: number;
  paymentSplits?: PaymentSplit[];
}

export interface ExtendedSaleItem extends SaleItem {
  productVariantId?: number;
  unitPrice?: number;
  total?: number;
  productVariant?: ProductVariant;
}

export interface ExtendedStockMovement extends StockMovement {
  productVariantId?: number;
  fromLocation?: string;
  toLocation?: string;
}
