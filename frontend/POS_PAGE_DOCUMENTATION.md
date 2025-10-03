# POSPage Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component API Reference](#component-api-reference)
4. [State Management](#state-management)
5. [Data Flow](#data-flow)
6. [Features](#features)
7. [Usage Examples](#usage-examples)
8. [Customization Guide](#customization-guide)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Overview

### Purpose

The POSPage is a complete Point of Sale (POS) system interface for processing retail transactions. It provides barcode
scanning, product selection, customer management, cart operations, and payment processing in a streamlined,
cashier-friendly interface.

### Key Features

- ✅ Barcode scanning and product search
- ✅ Category-based product browsing
- ✅ Shopping cart management with real-time calculations
- ✅ Customer lookup and loyalty tracking
- ✅ Multiple payment methods (CASH/CARD)
- ✅ Automatic change calculation
- ✅ Stock availability validation
- ✅ Tax calculation per item
- ✅ Receipt generation
- ✅ Real-time inventory updates

### Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (useState, useEffect)
- **API Communication:** Axios
- **Notifications:** react-hot-toast
- **Authentication:** Context-based auth system

---

## Architecture

### Component Structure

```
POSPage (Main Container)
│
├── Header (Store branding & user info)
│   ├── Store Logo & Name
│   ├── User Role Badge
│   ├── Admin Panel Link (role-based)
│   └── Logout Button
│
├── Left Panel
│   ├── POSBarcodeScanner
│   │   ├── Barcode Input Field
│   │   └── Add Button
│   │
│   └── POSProductGrid
│       ├── Category Buttons
│       │   ├── All Products (default)
│       │   └── Category Cards (from database)
│       │
│       └── Product Cards
│           ├── Product Name
│           ├── SKU
│           ├── Price
│           └── Stock Level
│
└── Right Panel (Shopping Cart)
    ├── POSCustomerSearch
    │   ├── Phone Input
    │   ├── Search Button
    │   └── Customer Info Display
    │
    ├── POSCart
    │   ├── Cart Items List
    │   │   ├── Product Info
    │   │   ├── Quantity Input
    │   │   ├── Subtotal
    │   │   └── Remove Button
    │   │
    │   ├── Summary Section
    │   │   ├── Subtotal
    │   │   ├── Tax
    │   │   └── Total
    │   │
    │   └── Action Buttons
    │       ├── Process Payment
    │       └── Clear Cart
    │
    └── POSPaymentModal
        ├── Transaction Summary
        ├── Payment Method Selector
        ├── Cash Input (if CASH)
        ├── Change Display
        └── Confirm/Cancel Buttons
```

### File Organization

```
frontend/src/
├── pages/
│   └── POSPage.tsx                      # Main orchestrator (290 lines)
│
├── components/pos/
│   ├── POSBarcodeScanner.tsx            # Barcode input (32 lines)
│   ├── POSProductGrid.tsx               # Categories & products (105 lines)
│   ├── POSCustomerSearch.tsx            # Customer lookup (44 lines)
│   ├── POSCart.tsx                      # Cart display (140 lines)
│   └── POSPaymentModal.tsx              # Payment processing (138 lines)
│
└── utils/
    └── posUtils.ts                      # Calculation utilities (47 lines)
```

### Size Comparison

**Before Refactoring:**

- POSPage.tsx: 610 lines (monolithic)

**After Refactoring:**

- POSPage.tsx: 290 lines (orchestrator)
- 5 Components: 459 lines total
- 1 Utility: 47 lines
- **Total: 796 lines** (30% increase for better organization)

---

## Component API Reference

### POSPage (Main Component)

**Location:** `frontend/src/pages/POSPage.tsx`

**Props:** None (uses React Router for routing)

**Internal State:**

```typescript
// Cart state
cart: CartItem[]                       // Shopping cart items

// Barcode state
barcode: string                        // Current barcode input

// Customer state
customerPhone: string                  // Customer phone input
customer: Customer | null              // Found customer data

// Products and categories
categories: Category[]                 // List of categories
products: Product[]                    // Filtered products
selectedCategory: number | null        // Active category filter

// Payment state
isProcessingPayment: boolean           // Payment in progress
showPaymentModal: boolean              // Modal visibility
paymentMethod: "CASH" | "CARD"         // Selected payment method
cashReceived: string                   // Cash amount input
```

**Key Functions:**

```typescript
loadCategories()                       // Fetch all categories
loadProducts(categoryId?)              // Fetch products (filtered)
handleCategoryClick(categoryId)        // Filter by category
handleBarcodeSubmit(e)                 // Process barcode scan
addToCart(product)                     // Add product to cart
updateCartItemQuantity(id, qty)        // Update item quantity
removeFromCart(productId)              // Remove item from cart
searchCustomer()                       // Search customer by phone
handlePayment()                        // Open payment modal
handleClearCart()                      // Clear entire cart
processPayment()                       // Complete transaction
```

---

### POSBarcodeScanner

**Location:** `frontend/src/components/pos/POSBarcodeScanner.tsx`

**Purpose:** Barcode scanning and product search input

**Props:**

```typescript
interface POSBarcodeScannerProps {
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}
```

**Usage:**

```tsx
<POSBarcodeScanner barcode={barcode} onBarcodeChange={setBarcode} onSubmit={handleBarcodeSubmit} />
```

**Features:**

- Auto-focus for immediate scanning
- Supports both barcode numbers and product name search
- Enter key submits form
- Clears input after successful add

---

### POSProductGrid

**Location:** `frontend/src/components/pos/POSProductGrid.tsx`

**Purpose:** Category selection and product browsing

**Props:**

```typescript
interface POSProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
  onProductClick: (product: Product) => void;
}
```

**Usage:**

```tsx
<POSProductGrid
  products={products}
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryClick={handleCategoryClick}
  onProductClick={addToCart}
/>
```

**Features:**

- Grid layout (2-4 columns responsive)
- Visual active category indicator
- Product cards with name, SKU, price, stock
- Disabled state for out-of-stock products
- Icon display for categories

---

### POSCustomerSearch

**Location:** `frontend/src/components/pos/POSCustomerSearch.tsx`

**Purpose:** Customer lookup by phone number

**Props:**

```typescript
interface POSCustomerSearchProps {
  customerPhone: string;
  customer: Customer | null;
  onPhoneChange: (value: string) => void;
  onSearch: () => void;
}
```

**Usage:**

```tsx
<POSCustomerSearch
  customerPhone={customerPhone}
  customer={customer}
  onPhoneChange={setCustomerPhone}
  onSearch={searchCustomer}
/>
```

**Features:**

- Phone number input field
- Search button
- Customer info display (name, loyalty points)
- Optional (can process without customer)
- Visual feedback for found customer

---

### POSCart

**Location:** `frontend/src/components/pos/POSCart.tsx`

**Purpose:** Shopping cart display and management

**Props:**

```typescript
interface POSCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onProcessPayment: () => void;
  subtotal: number;
  tax: number;
  total: number;
}
```

**Usage:**

```tsx
<POSCart
  cart={cart}
  onUpdateQuantity={updateCartItemQuantity}
  onRemoveItem={removeFromCart}
  onClearCart={handleClearCart}
  onProcessPayment={handlePayment}
  subtotal={subtotal}
  tax={tax}
  total={total}
/>
```

**Features:**

- Scrollable cart items list
- Quantity input with stock validation
- Real-time subtotal per item
- Remove item button
- Empty cart state with icon
- Summary section (subtotal, tax, total)
- Process Payment button (disabled if empty)
- Clear Cart button with confirmation

---

### POSPaymentModal

**Location:** `frontend/src/components/pos/POSPaymentModal.tsx`

**Purpose:** Payment method selection and transaction completion

**Props:**

```typescript
interface POSPaymentModalProps {
  isOpen: boolean;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "CASH" | "CARD";
  cashReceived: string;
  changeAmount: number;
  isProcessing: boolean;
  onClose: () => void;
  onPaymentMethodChange: (method: "CASH" | "CARD") => void;
  onCashReceivedChange: (value: string) => void;
  onConfirm: () => void;
}
```

**Usage:**

```tsx
<POSPaymentModal
  isOpen={showPaymentModal}
  subtotal={subtotal}
  tax={tax}
  total={total}
  paymentMethod={paymentMethod}
  cashReceived={cashReceived}
  changeAmount={changeAmount}
  isProcessing={isProcessingPayment}
  onClose={() => setShowPaymentModal(false)}
  onPaymentMethodChange={setPaymentMethod}
  onCashReceivedChange={setCashReceived}
  onConfirm={processPayment}
/>
```

**Features:**

- Modal overlay with backdrop
- Transaction summary display
- Payment method toggle (CASH/CARD)
- Cash input field (CASH only)
- Automatic change calculation
- Validation (cash >= total)
- Loading state during processing
- Cancel and Confirm buttons

---

### posUtils (Utility Functions)

**Location:** `frontend/src/utils/posUtils.ts`

**Functions:**

#### calculateSubtotal

```typescript
calculateSubtotal(cart: CartItem[]): number
```

Returns the sum of all item subtotals in the cart.

#### calculateTax

```typescript
calculateTax(cart: CartItem[]): number
```

Returns the sum of tax for all items based on their individual tax rates.

#### calculateTotal

```typescript
calculateTotal(cart: CartItem[]): number
```

Returns the grand total (subtotal + tax).

#### calculateChange

```typescript
calculateChange(cashReceived: number, total: number): number
```

Returns the change amount (0 if cash < total).

**Usage:**

```typescript
import { calculateSubtotal, calculateTax, calculateTotal, calculateChange } from "../utils/posUtils";

const subtotal = calculateSubtotal(cart);
const tax = calculateTax(cart);
const total = calculateTotal(cart);
const change = calculateChange(100, total);
```

---

## State Management

### Lifecycle

```
┌─────────────────┐
│  Component      │
│  Mount          │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  useEffect (on mount)           │
│  • loadCategories()             │
│  • loadProducts()               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  API Calls                      │
│  • GET /api/categories          │
│  • GET /api/products?isActive=1 │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  State Updates                  │
│  • setCategories(data)          │
│  • setProducts(data)            │
└─────────────────────────────────┘
```

### State Update Patterns

#### Adding Product to Cart

```typescript
handleBarcodeSubmit() / addToCart()
  ↓
Check stock availability
  ↓
Check if product already in cart
  ↓
  ├─ Yes: Increment quantity
  │   ↓
  │   Validate against stock
  │   ↓
  │   Update cart item
  │
  └─ No: Create new cart item
      ↓
      Add to cart array
  ↓
Show success toast
```

#### Processing Payment

```typescript
handlePayment()
  ↓
Validate cart not empty
  ↓
Open payment modal
  ↓
User selects payment method
  ↓
User enters cash (if CASH)
  ↓
User clicks "Complete Sale"
  ↓
processPayment()
  ↓
Validate payment amount
  ↓
Create sale via API (POST /api/sales)
  ↓
Success response
  ↓
Clear cart and reset all states
  ↓
Show success toast with receipt ID
  ↓
Reload products (update stock)
```

#### Customer Search

```typescript
User enters phone number
  ↓
searchCustomer()
  ↓
API call (GET /api/customers/phone/:phone)
  ↓
  ├─ Found: Set customer data
  │   ↓
  │   Display customer info
  │   ↓
  │   Show success toast
  │
  └─ Not Found: Clear customer
      ↓
      Show error toast
```

---

## Data Flow

### Barcode Scan Flow

```
User scans barcode / types product name
  ↓
handleBarcodeSubmit() called
  ↓
Check if input is numeric (barcode)
  ↓
  ├─ Yes: Try getByBarcode API
  │   ↓
  │   ├─ Found: Product retrieved
  │   └─ Not Found: Search by name
  │
  └─ No: Search by name
      ↓
      getAll API with search parameter
  ↓
Product found?
  ↓
  ├─ Yes: addToCart(product)
  │   ↓
  │   Cart updated
  │   ↓
  │   Input cleared
  │
  └─ No: Show "Product not found" error
```

### Category Filter Flow

```
User clicks category button
  ↓
handleCategoryClick(categoryId)
  ↓
setSelectedCategory(categoryId)
  ↓
loadProducts(categoryId)
  ↓
API call with categoryId filter
  ↓
setProducts(filtered data)
  ↓
POSProductGrid re-renders with new products
```

### Payment Flow

```
User clicks "Process Payment"
  ↓
Validate cart not empty
  ↓
setShowPaymentModal(true)
  ↓
POSPaymentModal renders
  ↓
User selects payment method
  ↓
  ├─ CASH: Show cash input
  │   ↓
  │   User enters amount
  │   ↓
  │   Calculate change (real-time)
  │
  └─ CARD: Hide cash input
  ↓
User clicks "Complete Sale"
  ↓
Validate payment amount
  ↓
processPayment() creates sale
  ↓
  ├─ Success: Clear cart, show success
  │   ↓
  │   Reload products (stock updated)
  │
  └─ Error: Show error toast
```

---

## Features

### 1. Barcode Scanning

#### Supported Formats

- **Numeric barcodes** (e.g., "1234567890")
- **Product names** (text search)

#### Behavior

1. Auto-focuses on page load for immediate scanning
2. Searches by barcode first (exact match)
3. Falls back to name search if barcode not found
4. Clears input after successful add
5. Shows appropriate error messages

#### API Endpoints

```
GET /api/products/barcode/:barcode  - Find by barcode
GET /api/products?search=...        - Search by name
```

---

### 2. Category Browsing

#### Features

- **All Products** button (clears category filter)
- **Category cards** with icons and names
- **Visual feedback** for selected category
- **Responsive grid** (2-4 columns)

#### Category Display

```tsx
<CategoryCard>Icon (emoji or custom) Category Name</CategoryCard>
```

---

### 3. Shopping Cart

#### Cart Item Structure

```typescript
interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  discount?: number;
}
```

#### Operations

- **Add:** Product click or barcode scan
- **Update Quantity:** Number input (validates against stock)
- **Remove:** Click ✕ button
- **Clear All:** Confirmation dialog

#### Validations

- Stock availability check on add
- Maximum quantity = available stock
- Minimum quantity = 1 (auto-removes if 0)
- Duplicate detection (increments existing)

---

### 4. Customer Management

#### Lookup

- Search by phone number
- Optional (can checkout without customer)
- Displays customer name and loyalty points

#### Benefits

- **Future feature:** Apply loyalty discounts
- **Future feature:** Earn points on purchase
- **Tracking:** Associate sales with customers

---

### 5. Payment Processing

#### Payment Methods

**CASH**

- Requires cash amount input
- Validates: cash >= total
- Calculates and displays change
- Stores cash amount in sale record

**CARD**

- No additional input required
- Assumes exact amount
- Change = 0

#### Sale Creation

```typescript
POST /api/sales
{
  customerId?: number,
  items: [
    {
      productId: number,
      quantity: number,
      price: number,
      discount: number
    }
  ],
  paymentMethod: "CASH" | "CARD",
  cashReceived?: number
}
```

#### Post-Payment

1. Success toast with receipt ID
2. Cart cleared
3. Customer cleared
4. Payment modal closed
5. Products reloaded (stock updated)

---

### 6. Tax Calculation

#### Per-Item Tax

Each product has its own `taxRate` (percentage).

```typescript
itemTax = (itemSubtotal × taxRate) / 100
totalTax = sum of all itemTax
```

#### Example

```
Product A: $10 × 2 = $20, tax 5% → $1.00 tax
Product B: $5 × 3 = $15, tax 10% → $1.50 tax
Total Tax: $2.50
```

---

### 7. Stock Validation

#### Real-time Checks

- Before adding to cart
- Before incrementing quantity
- Visual disabled state for out-of-stock

#### Stock Display

```
Product Card: "Stock: 15"
Cart Item: "Stock: 15" (shows available, not in cart)
```

---

## Usage Examples

### Basic Usage

```tsx
import POSPage from "./pages/POSPage";

function App() {
  return (
    <Routes>
      <Route path="/pos" element={<POSPage />} />
    </Routes>
  );
}
```

### With Authentication

```tsx
import { ProtectedRoute } from "./components/ProtectedRoute";
import POSPage from "./pages/POSPage";

function App() {
  return (
    <Routes>
      <Route
        path="/pos"
        element={
          <ProtectedRoute allowedRoles={["CASHIER", "ADMIN", "MANAGER"]}>
            <POSPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Programmatic Navigation

```tsx
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return <button onClick={() => navigate("/pos")}>Open POS</button>;
}
```

---

## Customization Guide

### Styling

#### Change Store Branding

```tsx
// In POSPage.tsx header section
<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
  <span className="text-2xl">🛒</span> {/* Change emoji */}
</div>
<span className="text-xl font-bold text-gray-900 tracking-tight">
  Fresh Mart {/* Change store name */}
</span>
```

#### Customize Colors

```tsx
// Primary color (buttons, highlights)
className = "bg-blue-600 hover:bg-blue-700";
// Change to:
className = "bg-purple-600 hover:bg-purple-700";

// Success color (payment button)
className = "bg-green-600 hover:bg-green-700";
// Keep or customize
```

#### Grid Layout

```tsx
// In POSProductGrid.tsx
// Current: 2-4 columns responsive
className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

// Customize:
className = "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3";
```

---

### Adding Features

#### Add Discount Field

```tsx
// 1. Add state in POSPage.tsx
const [discount, setDiscount] = useState(0);

// 2. Add input in POSCart.tsx
<input
  type="number"
  placeholder="Discount %"
  value={discount}
  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
/>;

// 3. Update calculations
const discountAmount = (subtotal * discount) / 100;
const total = subtotal + tax - discountAmount;
```

#### Add Print Receipt

```tsx
// 1. Create function
const printReceipt = (sale: Sale) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head><title>Receipt ${sale.receiptId}</title></head>
      <body>
        <h1>Receipt ${sale.receiptId}</h1>
        <!-- Receipt content -->
      </body>
    </html>
  `);
  printWindow.print();
};

// 2. Call after payment success
const sale = await salesAPI.create(saleData);
printReceipt(sale);
```

---

## Troubleshooting

### Common Issues

#### 1. Barcode Scanner Not Working

**Symptoms:** Scanning doesn't add products

**Possible Causes:**

- Input not focused
- Wrong barcode format
- Product not found in database

**Solutions:**

```tsx
// Ensure auto-focus
<input autoFocus />;

// Check barcode format
console.log("Scanned:", barcode);

// Verify product exists
await productsAPI.getByBarcode(barcode);
```

---

#### 2. Products Not Loading

**Symptoms:** Empty product grid

**Possible Causes:**

- API endpoint unreachable
- No active products in database
- Category filter too restrictive

**Solutions:**

```tsx
// Check API response
const data = await productsAPI.getAll({ isActive: true });
console.log("Products:", data);

// Verify category filter
console.log("Selected Category:", selectedCategory);

// Clear filter
setSelectedCategory(null);
loadProducts();
```

---

#### 3. Payment Fails

**Symptoms:** "Failed to process payment" error

**Possible Causes:**

- Insufficient stock
- Invalid sale data
- Backend validation error

**Solutions:**

```tsx
// Check stock before payment
cart.forEach(item => {
  if (item.quantity > item.product.stockQuantity) {
    console.error('Insufficient stock for:', item.product.name);
  }
});

// Validate sale data
console.log('Sale data:', saleData);

// Check backend response
catch (error) {
  console.error('Payment error:', error.response?.data);
}
```

---

#### 4. Cart Not Updating

**Symptoms:** Products don't add to cart

**Possible Causes:**

- Out of stock
- State update issue
- Duplicate detection problem

**Solutions:**

```tsx
// Log cart state
console.log("Current cart:", cart);

// Check stock
if (product.stockQuantity <= 0) {
  console.log("Out of stock:", product.name);
}

// Verify state update
setCart((prev) => {
  console.log("Previous cart:", prev);
  const updated = [...prev, newItem];
  console.log("Updated cart:", updated);
  return updated;
});
```

---

## Best Practices

### Performance

#### 1. Lazy Load Categories

```tsx
const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  const loadCategories = async () => {
    const data = await categoriesAPI.getAll();
    setCategories(data);
  };
  loadCategories();
}, []); // Only on mount
```

#### 2. Debounce Barcode Input

```tsx
import { useMemo } from "react";
import debounce from "lodash.debounce";

const debouncedSearch = useMemo(() => debounce(handleBarcodeSubmit, 300), []);
```

#### 3. Memoize Calculations

```tsx
import { useMemo } from "react";

const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);
const tax = useMemo(() => calculateTax(cart), [cart]);
const total = useMemo(() => calculateTotal(cart), [cart]);
```

---

### User Experience

#### 1. Keyboard Shortcuts

```tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "F9") handlePayment();
    if (e.key === "F10") handleClearCart();
  };
  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, []);
```

#### 2. Focus Management

```tsx
// Return focus to barcode input after actions
const handleBarcodeSubmit = async (e) => {
  // ... submit logic
  document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
};
```

#### 3. Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

const loadProducts = async () => {
  setIsLoading(true);
  try {
    const data = await productsAPI.getAll();
    setProducts(data.data || []);
  } finally {
    setIsLoading(false);
  }
};
```

---

### Security

#### 1. Input Validation

```tsx
// Validate cash amount
const cashAmount = parseFloat(cashReceived);
if (isNaN(cashAmount) || cashAmount < total) {
  toast.error("Invalid cash amount");
  return;
}
```

#### 2. Stock Verification

```tsx
// Always verify stock on server
// Backend should re-check stock before creating sale
```

#### 3. Role-based Access

```tsx
// Only show POS to authorized roles
{
  user?.role !== "ADMIN" && <Navigate to="/unauthorized" />;
}
```

---

## Appendix

### Type Definitions

```typescript
interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  discount?: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  sellingPrice: number;
  stockQuantity: number;
  taxRate: number;
  isActive: boolean;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
}

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface Sale {
  id: number;
  receiptId: string;
  customerId?: number;
  total: number;
  tax: number;
  paymentMethod: "CASH" | "CARD";
  cashReceived?: number;
  change?: number;
  createdAt: string;
}
```

### API Endpoints

```
GET    /api/products                   - List products (with filters)
GET    /api/products/barcode/:barcode  - Find by barcode
GET    /api/categories                 - List categories
GET    /api/customers/phone/:phone     - Find customer by phone
POST   /api/sales                      - Create sale
```

### Keyboard Shortcuts (Future)

```
F1  - Focus barcode input
F2  - Search customer
F9  - Process payment
F10 - Clear cart
ESC - Close modals
```

---

**Last Updated:** October 4, 2025  
**Version:** 1.0.0  
**Maintainer:** Development Team
