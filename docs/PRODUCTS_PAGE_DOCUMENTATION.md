# ProductsPage Documentation

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
The ProductsPage is a comprehensive product management interface for a Point of Sale (POS) system. It provides full CRUD operations, bulk import/export capabilities, barcode generation and printing, and real-time inventory tracking.

### Key Features
- ✅ Product CRUD operations (Create, Read, Update, Delete)
- ✅ Image upload and management
- ✅ Barcode generation and printing (18 labels per A4 page)
- ✅ CSV bulk import/export with validation
- ✅ Real-time search and filtering
- ✅ Color-coded stock level indicators
- ✅ Status management (active/inactive)
- ✅ Supplier tracking
- ✅ Category organization

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
ProductsPage (Main Container)
│
├── ProductFilters (Search & Filter UI)
│   ├── Search Input
│   └── Category Dropdown
│
├── ProductActions (Action Buttons)
│   ├── Export CSV Button
│   ├── Import CSV Button
│   └── Add Product Button
│
├── ProductTable (Data Display)
│   ├── Table Header (7 columns)
│   ├── Product Rows
│   │   ├── Product Column (image, name, supplier)
│   │   ├── SKU/Barcode Column
│   │   ├── Category Column
│   │   ├── Price Column (selling + cost)
│   │   ├── Stock Column (color-coded)
│   │   ├── Status Column (active/inactive)
│   │   └── Actions Column (4 buttons)
│   └── Empty/Loading States
│
├── ProductModals (Dialog System)
│   ├── Add Product Modal
│   ├── Edit Product Modal
│   ├── Delete Confirmation Modal
│   ├── Print Barcode Modal
│   └── Import CSV Modal
│
└── Utilities
    └── printBarcodeLabel (Barcode printing function)
```

### File Organization

```
frontend/src/
├── pages/
│   └── ProductsPage.tsx              # Main orchestrator (438 lines)
│
├── components/products/
│   ├── ProductFilters.tsx            # Search and category filter (40 lines)
│   ├── ProductActions.tsx            # Top action buttons (45 lines)
│   ├── ProductTable.tsx              # Table display (280 lines)
│   └── ProductModals.tsx             # All modal dialogs (730 lines)
│
└── utils/
    └── productUtils.ts               # Barcode printing utility (235 lines)
```

---

## Component API Reference

### ProductsPage (Main Component)

**Location:** `frontend/src/pages/ProductsPage.tsx`

**Props:** None (uses React Router for routing)

**Exports:** `default ProductsPage`

**Dependencies:**
```typescript
import { productsAPI, categoriesAPI, suppliersAPI } from "../services/api";
import { Product, Category, Supplier } from "../types";
import { useAuth } from "../context/AuthContext";
import { ProductFilters } from "../components/products/ProductFilters";
import { ProductActions } from "../components/products/ProductActions";
import { ProductTable } from "../components/products/ProductTable";
import { ProductModals } from "../components/products/ProductModals";
import { printBarcodeLabel } from "../utils/productUtils";
```

**Internal State:**
```typescript
// Data states
products: Product[]                    // List of all products
categories: Category[]                 // List of categories
suppliers: Supplier[]                  // List of suppliers

// UI states
isLoading: boolean                     // Loading indicator
isSubmitting: boolean                  // Form submission state
deletingId: number | null              // Product being deleted

// Modal states
showDeleteConfirm: boolean
showAddModal: boolean
showEditModal: boolean
showImportModal: boolean
showPrintModal: boolean

// Form states
printProduct: Product | null
printCopies: number
importFile: File | null
isImporting: boolean
editProduct: Product | null
imageFile: File | null
imagePreview: string
form: {
  name: string
  sku: string
  categoryId: string
  supplierId: string
  purchasePrice: string
  sellingPrice: string
  stockQuantity: string
  lowStockThreshold: string
  isActive: boolean
  isWeighted: boolean
  taxRate: string
  image: string
}

// Filter states
search: string
categoryFilter: string
```

---

### ProductFilters

**Location:** `frontend/src/components/products/ProductFilters.tsx`

**Purpose:** Provides search and category filtering interface

**Props:**
```typescript
interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: Category[];
}
```

**Usage:**
```tsx
<ProductFilters
  search={search}
  setSearch={setSearch}
  categoryFilter={categoryFilter}
  setCategoryFilter={setCategoryFilter}
  categories={categories}
/>
```

**Features:**
- Text search input (searches name and SKU)
- Category dropdown filter
- Responsive layout (stacks on mobile)

---

### ProductActions

**Location:** `frontend/src/components/products/ProductActions.tsx`

**Purpose:** Top-level action buttons with permission control

**Props:**
```typescript
interface ProductActionsProps {
  canWrite: boolean;
  onExport: () => void;
  onImport: () => void;
  onAddNew: () => void;
}
```

**Usage:**
```tsx
<ProductActions
  canWrite={canWrite}
  onExport={handleExportCSV}
  onImport={() => setShowImportModal(true)}
  onAddNew={() => setShowAddModal(true)}
/>
```

**Features:**
- Permission-based rendering (only shows if `canWrite` is true)
- Three action buttons: Export, Import, Add New
- Consistent styling with hover effects
- Accessibility (title attributes for tooltips)

---

### ProductTable

**Location:** `frontend/src/components/products/ProductTable.tsx`

**Purpose:** Displays products in a responsive table format

**Props:**
```typescript
interface ProductTableProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  isLoading: boolean;
  canWrite: boolean;
  deletingId: number | null;
  onPrint: (product: Product) => void;
  onEdit: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}
```

**Usage:**
```tsx
<ProductTable
  products={filteredProducts}
  categories={categories}
  suppliers={suppliers}
  isLoading={isLoading}
  canWrite={canWrite}
  deletingId={deletingId}
  onPrint={handlePrintClick}
  onEdit={handleEditClick}
  onToggleStatus={handleToggleStatus}
  onDelete={handleDeleteProduct}
  onAddNew={() => setShowAddModal(true)}
/>
```

**Table Columns:**
1. **Product** - Image thumbnail, name, supplier
2. **SKU/Barcode** - SKU and barcode number
3. **Category** - Blue badge with category name
4. **Price** - Selling price (bold) and cost (gray)
5. **Stock** - Color-coded badge (red/yellow/green)
6. **Status** - Active/Inactive with dot indicator
7. **Actions** - Print, Edit, Toggle, Delete buttons

**Stock Level Color Coding:**
- 🔴 Red: `stock ≤ lowStockThreshold`
- 🟡 Yellow: `stock ≤ lowStockThreshold × 2`
- 🟢 Green: `stock > lowStockThreshold × 2`

**States:**
- **Loading State:** Animated spinner with message
- **Empty State:** Icon, message, and "Add Product" button
- **Data State:** Full table with all products

---

### ProductModals

**Location:** `frontend/src/components/products/ProductModals.tsx`

**Purpose:** Contains all modal dialogs for product operations

**Props:**
```typescript
interface ProductModalsProps {
  // Add Modal
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  form: any;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddProduct: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  categories: Category[];
  suppliers: Supplier[];
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;

  // Edit Modal
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editProduct: Product | null;
  setEditProduct: (product: Product | null) => void;
  handleUpdateProduct: (e: React.FormEvent) => void;

  // Delete Modal
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  deletingId: number | null;
  setDeletingId: (id: number | null) => void;
  confirmDeleteProduct: () => void;

  // Print Modal
  showPrintModal: boolean;
  setShowPrintModal: (show: boolean) => void;
  printProduct: Product | null;
  setPrintProduct: (product: Product | null) => void;
  printCopies: number;
  setPrintCopies: (copies: number) => void;
  printBarcodeLabel: (product: Product, copies: number) => void;

  // Import Modal
  showImportModal: boolean;
  setShowImportModal: (show: boolean) => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  isImporting: boolean;
  handleImportCSV: () => void;
  handleDownloadTemplate: () => void;
}
```

**Modal Descriptions:**

#### 1. Add Product Modal
- **Trigger:** "Add New Product" button
- **Layout:** 2-column responsive form
- **Fields:**
  - Image upload with preview (5MB max, JPEG/PNG/GIF/WebP)
  - Name* (required)
  - SKU* (required)
  - Category* (required, dropdown)
  - Supplier (optional, dropdown)
  - Purchase Price* (required, decimal)
  - Selling Price* (required, decimal)
  - Stock Quantity* (required, integer)
  - Low Stock Threshold (default: 10)
  - Tax Rate (percentage, default: 0)
  - Is Weighted (checkbox)
  - Is Active (checkbox, default: true)
- **Validation:** Browser-native HTML5 validation + backend validation
- **Submit:** Creates product, uploads image, reloads data

#### 2. Edit Product Modal
- **Trigger:** Edit icon button in table
- **Layout:** Identical to Add Product Modal
- **Behavior:** Pre-fills form with existing product data
- **Image Handling:** Shows existing image, allows upload of new image
- **Submit:** Updates product, uploads new image if selected

#### 3. Delete Confirmation Modal
- **Trigger:** Delete icon button in table
- **Layout:** Simple confirmation dialog
- **Content:** Warning message about irreversible action
- **Actions:** Cancel or Delete
- **Submit:** Deletes product from database

#### 4. Print Barcode Modal
- **Trigger:** Print icon button in table
- **Layout:** Compact modal with quantity controls
- **Features:**
  - Number input (1-500 labels)
  - Quick select buttons (1, 5, 10, 20, 50)
  - Information note about 18 labels per A4 page
- **Submit:** Opens print window with barcode labels

#### 5. Import CSV Modal
- **Trigger:** "Import" button in actions
- **Layout:** File upload interface
- **Features:**
  - Download template button
  - File input (CSV only)
  - Validation notes and requirements
  - Selected file preview
- **Validation Notes:**
  - SKUs must be unique
  - Category IDs must exist
  - Supplier IDs optional but must exist if provided
  - All prices must be positive numbers
- **Submit:** Validates and imports products

---

### printBarcodeLabel Utility

**Location:** `frontend/src/utils/productUtils.ts`

**Purpose:** Generates and prints barcode labels in optimized layout

**Function Signature:**
```typescript
export const printBarcodeLabel = (product: Product, copies: number = 1) => void
```

**Parameters:**
- `product`: Product object containing id, name, sku, sellingPrice, barcode
- `copies`: Number of labels to print (default: 1)

**Label Specifications:**
- **Size:** 60mm × 42mm per label
- **Layout:** 3 columns × 6 rows = 18 labels per A4 page
- **Paper:** A4 with 8mm margins
- **Gaps:** 4mm between labels
- **Format:** CODE128 barcode

**Label Contents:**
```
┌─────────────────────────┐
│    PRODUCT NAME         │ (9pt bold, uppercase)
├─────────────────────────┤
│ SKU: ABC123             │ (8pt)
│ Price: $15.99           │ (9pt bold)
├─────────────────────────┤
│    [BARCODE IMAGE]      │ (auto-scaled)
├─────────────────────────┤
│  ABC123000001           │ (7pt monospace)
└─────────────────────────┘
```

**Behavior:**
1. Opens new window with generated HTML
2. Waits for all barcode images to load
3. Automatically triggers print dialog
4. Closes window after printing

**Usage:**
```typescript
// Print 1 label
printBarcodeLabel(product);

// Print 50 labels
printBarcodeLabel(product, 50);
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
│  • loadData()                   │
│  • loadCategories()             │
│  • loadSuppliers()              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  API Calls                      │
│  • GET /api/products            │
│  • GET /api/categories          │
│  • GET /api/suppliers           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  State Updates                  │
│  • setProducts(data)            │
│  • setCategories(data)          │
│  • setSuppliers(data)           │
│  • setIsLoading(false)          │
└─────────────────────────────────┘
```

### State Update Patterns

#### Creating a Product
```typescript
handleAddProduct()
  ↓
Create product via API (POST /api/products)
  ↓
Upload image if selected (POST /api/products/:id/image)
  ↓
Show success toast
  ↓
Reset form state
  ↓
Close modal
  ↓
Reload all products (loadData())
```

#### Updating a Product
```typescript
handleUpdateProduct()
  ↓
Update product via API (PUT /api/products/:id)
  ↓
Upload new image if selected (POST /api/products/:id/image)
  ↓
Show success toast
  ↓
Clear edit state
  ↓
Close modal
  ↓
Reload all products (loadData())
```

#### Deleting a Product
```typescript
handleDeleteProduct(id)
  ↓
Show confirmation modal
  ↓
User confirms
  ↓
Delete via API (DELETE /api/products/:id)
  ↓
Show success toast
  ↓
Remove from local state (setProducts(prev => prev.filter(...)))
  ↓
Close modal
```

#### Toggling Status
```typescript
handleToggleStatus(product)
  ↓
Update product status via API (PUT /api/products/:id)
  ↓
Show success toast
  ↓
Reload all products (loadData())
```

---

## Data Flow

### User Action Flow

```
User clicks "Add Product"
  ↓
setShowAddModal(true)
  ↓
ProductModals renders Add Modal
  ↓
User fills form and submits
  ↓
handleAddProduct() called
  ↓
API request sent
  ↓
Success response received
  ↓
State updated
  ↓
UI refreshed with new product
```

### Filtering Flow

```
User types in search box
  ↓
setSearch(value) called
  ↓
filteredProducts recomputed
  ↓
ProductTable re-renders with filtered data
```

**Filter Logic:**
```typescript
const filteredProducts = products.filter((p) => {
  const matchesSearch = 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase());
  const matchesCategory = categoryFilter 
    ? p.categoryId === parseInt(categoryFilter) 
    : true;
  return matchesSearch && matchesCategory;
});
```

### Import Flow

```
User clicks "Import"
  ↓
setShowImportModal(true)
  ↓
User downloads template (optional)
  ↓
User selects CSV file
  ↓
setImportFile(file)
  ↓
User clicks "Import Products"
  ↓
handleImportCSV() called
  ↓
API validates CSV and imports
  ↓
Success/Error response
  ↓
Show appropriate toast message
  ↓
Close modal and reload data
```

---

## Features

### 1. Product CRUD Operations

#### Create
- **Endpoint:** `POST /api/products`
- **Form Fields:** All product attributes
- **Image Upload:** Multipart form-data to `POST /api/products/:id/image`
- **Validation:** Required fields enforced, SKU uniqueness checked
- **Auto-generation:** Barcode automatically generated server-side

#### Read
- **Endpoint:** `GET /api/products?page=1&limit=50`
- **Pagination:** Supports page and limit parameters
- **Response:** `{ data: Product[], total: number, page: number, limit: number }`
- **Client-side Filtering:** Search by name/SKU, filter by category

#### Update
- **Endpoint:** `PUT /api/products/:id`
- **Behavior:** Partial updates supported
- **Image Handling:** New image upload replaces existing
- **Validation:** Same as create

#### Delete
- **Endpoint:** `DELETE /api/products/:id`
- **Confirmation:** Required via modal
- **Cascade:** Backend handles related data cleanup

### 2. Image Management

#### Upload Process
```typescript
1. User selects image file
2. Client validates: size ≤ 5MB, format in [JPEG, PNG, GIF, WebP]
3. Create preview using FileReader
4. Display preview in modal
5. On submit, create FormData with image
6. POST to /api/products/:id/image
7. Backend stores in /uploads/products/
8. Response includes image URL
```

#### Display
- **Thumbnail:** 48×48px in table (rounded corners)
- **Fallback:** Gray gradient box with package icon
- **Preview:** 80×80px in modals
- **Storage:** `/uploads/products/` directory

### 3. Barcode System

#### Generation
- **Format:** CODE128
- **Pattern:** `{SKU}{paddedId}` (e.g., "ABC123000042")
- **Generation:** Automatic on product creation
- **Library:** bwip-js (backend)

#### Printing
- **Trigger:** Print icon in table or Print modal
- **Layout:** 18 labels per A4 page (3×6 grid)
- **Label Size:** 60mm × 42mm
- **Contents:**
  - Product name (header)
  - SKU and price (info rows)
  - Barcode image (centered)
  - Barcode text (footer)
- **Print Handling:** Auto-print on window load

### 4. CSV Import/Export

#### Export
- **Endpoint:** `GET /api/products/export`
- **Format:** CSV with all product fields
- **Filename:** `products_export_YYYY-MM-DD.csv`
- **Trigger:** "Export" button
- **Download:** Automatic via blob URL

#### Import
- **Endpoint:** `POST /api/products/import`
- **Template:** Downloadable via `GET /api/products/template`
- **Validation:**
  - SKU uniqueness (no duplicates in file or DB)
  - Category IDs exist in database
  - Supplier IDs exist if provided
  - Numeric fields are valid numbers
  - Required fields present
- **Error Handling:**
  - Returns list of invalid rows
  - Partial import (imports valid rows)
  - Detailed error messages
- **Response:**
```typescript
{
  imported: number;
  skipped: number;
  invalid?: Array<{ row: number; errors: string[] }>;
}
```

### 5. Search and Filtering

#### Search
- **Fields:** Product name, SKU
- **Match:** Case-insensitive, substring match
- **Real-time:** Updates as user types
- **Clear:** Input can be cleared

#### Category Filter
- **Type:** Dropdown select
- **Options:** "All Categories" + list of categories
- **Combination:** Works together with search (AND logic)

### 6. Stock Level Indicators

#### Color Coding
```typescript
if (stockQuantity <= lowStockThreshold) {
  color = "red";      // Critical
} else if (stockQuantity <= lowStockThreshold * 2) {
  color = "yellow";   // Warning
} else {
  color = "green";    // Healthy
}
```

#### Visual Design
- **Badge:** Rounded pill with colored background
- **Text:** `{quantity} units`
- **Contrast:** High contrast text for accessibility

### 7. Permission System

#### Roles
- **ADMIN:** Full access (read + write)
- **MANAGER:** Full access (read + write)
- **CASHIER:** Read-only access

#### Permission Check
```typescript
const canWrite = user?.role === "ADMIN" || user?.role === "MANAGER";
```

#### Conditional Rendering
- Action buttons (Export, Import, Add) hidden if `!canWrite`
- Edit/Delete/Toggle buttons hidden if `!canWrite`
- Print button visible to all roles

---

## Usage Examples

### Basic Usage

```tsx
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Routes>
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}
```

### With Authentication

```tsx
import { ProtectedRoute } from './components/ProtectedRoute';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Routes>
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### Programmatic Navigation

```tsx
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/products')}>
      Manage Products
    </button>
  );
}
```

### Custom Integration

```tsx
// Using individual components
import { ProductTable } from './components/products/ProductTable';
import { ProductFilters } from './components/products/ProductFilters';

function CustomProductView() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  
  return (
    <div>
      <ProductFilters 
        search={search} 
        setSearch={setSearch}
        categoryFilter=""
        setCategoryFilter={() => {}}
        categories={[]}
      />
      <ProductTable
        products={products}
        // ... other props
      />
    </div>
  );
}
```

---

## Customization Guide

### Styling

#### Tailwind Customization

```tsx
// Change button colors
<button className="bg-purple-600 hover:bg-purple-700">
  // Instead of bg-blue-600
</button>

// Adjust spacing
<div className="px-8 py-12">  // Instead of px-4 py-8
```

#### Custom CSS

```css
/* Override table styles */
.products-table tbody tr:hover {
  background-color: #f0f9ff;
}

/* Custom badge colors */
.stock-critical {
  background-color: #fee2e2;
  color: #991b1b;
}
```

### Component Extension

#### Adding Custom Columns

```tsx
// In ProductTable.tsx
<th className="px-6 py-3">Custom Column</th>

// In table body
<td className="px-6 py-4">
  {product.customField}
</td>
```

#### Adding Custom Actions

```tsx
// In ProductsPage.tsx
const handleCustomAction = async (product: Product) => {
  // Custom logic
};

// Pass to ProductTable
<ProductTable
  // ... existing props
  onCustomAction={handleCustomAction}
/>
```

### API Integration

#### Using Different Backend

```typescript
// Update api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const productsAPI = {
  getAll: (params) => axios.get(`${API_BASE_URL}/api/v2/products`, { params }),
  // ... other methods
};
```

#### Adding Custom Endpoints

```typescript
// In services/api.ts
export const productsAPI = {
  // ... existing methods
  
  getBySupplier: (supplierId: number) => 
    axios.get(`/api/products/supplier/${supplierId}`),
    
  getLowStock: () => 
    axios.get(`/api/products/low-stock`),
};
```

### Barcode Customization

#### Label Size

```typescript
// In productUtils.ts
.barcode-label {
  width: 50mm;   // Change from 60mm
  height: 35mm;  // Change from 42mm
}
```

#### Label Layout

```typescript
// Change labels per page
// 4 columns × 7 rows = 28 labels per page
.labels-container {
  gap: 3mm;
}
```

#### Barcode Format

```typescript
// Backend: Switch to EAN-13
const barcodeText = product.ean13;  // Instead of SKU + ID
```

---

## Troubleshooting

### Common Issues

#### 1. Products Not Loading

**Symptoms:** Empty table, no error message

**Possible Causes:**
- API endpoint unreachable
- Authentication token expired
- CORS issues

**Solutions:**
```typescript
// Check API endpoint
console.log('API URL:', process.env.REACT_APP_API_URL);

// Check auth token
console.log('Token:', localStorage.getItem('token'));

// Check CORS settings in backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

#### 2. Image Upload Fails

**Symptoms:** "Image upload failed" toast message

**Possible Causes:**
- File too large (>5MB)
- Unsupported format
- Server storage permission issues

**Solutions:**
```typescript
// Check file size
if (file.size > 5 * 1024 * 1024) {
  toast.error("File too large");
  return;
}

// Check backend upload directory permissions
chmod 755 uploads/products/

// Increase server upload limit
app.use(express.json({ limit: '10mb' }));
```

#### 3. Barcode Printing Issues

**Symptoms:** Print window opens but shows blank page

**Possible Causes:**
- Barcode image not loading
- CORS blocking barcode endpoint
- Network timeout

**Solutions:**
```typescript
// Make barcode endpoint public (no auth)
router.get('/:id/barcode', productController.getBarcode);

// Add error handling
images[i].onerror = function() {
  console.error('Failed to load barcode image');
  loaded++;
};

// Increase timeout
setTimeout(() => window.print(), 500);  // Instead of 250ms
```

#### 4. Import Validation Errors

**Symptoms:** "Invalid category IDs" error

**Possible Causes:**
- CSV has category IDs that don't exist
- Template outdated
- Encoding issues (special characters)

**Solutions:**
```typescript
// Download fresh template
// Verify category IDs exist in database
// Use UTF-8 encoding for CSV

// Backend: Add better error messages
if (invalidCategoryIds.length > 0) {
  return res.status(400).json({
    error: `Invalid category IDs: ${invalidCategoryIds.join(', ')}`,
    validCategories: categories.map(c => ({ id: c.id, name: c.name }))
  });
}
```

#### 5. Search/Filter Not Working

**Symptoms:** Typing in search doesn't filter products

**Possible Causes:**
- State not updating
- Filter logic error
- Component not re-rendering

**Solutions:**
```typescript
// Check state updates
console.log('Search value:', search);
console.log('Filtered products:', filteredProducts);

// Verify filter logic
const matchesSearch = 
  p.name.toLowerCase().includes(search.toLowerCase()) || 
  p.sku.toLowerCase().includes(search.toLowerCase());

// Force re-render with key prop
<ProductTable key={search} products={filteredProducts} />
```

### Performance Issues

#### Slow Rendering with Many Products

**Solution:** Implement virtualization
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={filteredProducts.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      {/* Product row */}
    </div>
  )}
</FixedSizeList>
```

#### Slow Search Performance

**Solution:** Debounce search input
```typescript
import { useMemo } from 'react';
import debounce from 'lodash.debounce';

const debouncedSetSearch = useMemo(
  () => debounce(setSearch, 300),
  []
);
```

---

## Best Practices

### Code Organization

1. **Keep Components Focused**
   - Each component should have a single responsibility
   - Extract complex logic into custom hooks
   - Use utility functions for reusable code

2. **Type Safety**
   ```typescript
   // Always define prop interfaces
   interface Props {
     products: Product[];
     onEdit: (product: Product) => void;
   }
   
   // Use TypeScript strict mode
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

3. **Error Handling**
   ```typescript
   try {
     await productsAPI.create(payload);
     toast.success("Product created");
   } catch (error: any) {
     console.error("Create failed:", error);
     toast.error(error?.response?.data?.error || "Failed to create product");
   }
   ```

### Performance

1. **Memoization**
   ```typescript
   const filteredProducts = useMemo(() => {
     return products.filter(/* filter logic */);
   }, [products, search, categoryFilter]);
   ```

2. **Lazy Loading**
   ```typescript
   const ProductModals = lazy(() => import('./components/products/ProductModals'));
   ```

3. **Pagination**
   ```typescript
   const [page, setPage] = useState(1);
   const [limit] = useState(50);
   
   useEffect(() => {
     loadData({ page, limit });
   }, [page]);
   ```

### Accessibility

1. **Keyboard Navigation**
   ```tsx
   <button
     onClick={handleAction}
     onKeyDown={(e) => e.key === 'Enter' && handleAction()}
     aria-label="Edit product"
   >
   ```

2. **Screen Reader Support**
   ```tsx
   <table role="table" aria-label="Products list">
     <thead>
       <tr role="row">
         <th role="columnheader">Product</th>
       </tr>
     </thead>
   </table>
   ```

3. **Focus Management**
   ```typescript
   useEffect(() => {
     if (showAddModal) {
       // Focus first input when modal opens
       document.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
     }
   }, [showAddModal]);
   ```

### Security

1. **Input Sanitization**
   ```typescript
   const sanitizeSKU = (sku: string) => {
     return sku.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
   };
   ```

2. **Permission Checks**
   ```typescript
   const canWrite = useMemo(() => 
     user?.role === "ADMIN" || user?.role === "MANAGER",
     [user]
   );
   ```

3. **XSS Prevention**
   ```tsx
   {/* React automatically escapes values */}
   <div>{product.name}</div>
   
   {/* For HTML content, use DOMPurify */}
   <div dangerouslySetInnerHTML={{ 
     __html: DOMPurify.sanitize(product.description) 
   }} />
   ```

### Testing

1. **Unit Tests**
   ```typescript
   describe('ProductFilters', () => {
     it('filters products by search term', () => {
       render(<ProductFilters search="test" {...props} />);
       expect(screen.getByDisplayValue('test')).toBeInTheDocument();
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   it('creates a product successfully', async () => {
     render(<ProductsPage />);
     fireEvent.click(screen.getByText('Add New Product'));
     // Fill form and submit
     await waitFor(() => {
       expect(screen.getByText('Product added successfully')).toBeInTheDocument();
     });
   });
   ```

### Documentation

1. **Component Documentation**
   ```typescript
   /**
    * ProductTable Component
    * 
    * Displays products in a tabular format with sorting, filtering, and actions.
    * 
    * @param products - Array of products to display
    * @param onEdit - Callback when edit button is clicked
    * @returns JSX.Element
    * 
    * @example
    * <ProductTable
    *   products={products}
    *   onEdit={(product) => setEditProduct(product)}
    * />
    */
   ```

2. **Function Documentation**
   ```typescript
   /**
    * Prints barcode labels for a product
    * 
    * Opens a new window with formatted barcode labels optimized for A4 paper.
    * Supports printing multiple copies with automatic layout (18 per page).
    * 
    * @param product - Product object with id, name, sku, sellingPrice, barcode
    * @param copies - Number of labels to print (default: 1, max: 500)
    * 
    * @throws Will log error if barcode image fails to load
    */
   export const printBarcodeLabel = (product: Product, copies: number = 1) => {
     // Implementation
   };
   ```

---

## Appendix

### Type Definitions

```typescript
interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  categoryId: number;
  supplierId?: number;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  isWeighted: boolean;
  taxRate: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
}
```

### API Endpoints

```
GET    /api/products              - List all products
GET    /api/products/:id          - Get single product
POST   /api/products              - Create product
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product
GET    /api/products/:id/barcode  - Get barcode image (PNG)
POST   /api/products/:id/image    - Upload product image
POST   /api/products/import       - Import from CSV
GET    /api/products/export       - Export to CSV
GET    /api/products/template     - Download CSV template
GET    /api/categories            - List all categories
GET    /api/suppliers             - List all suppliers
```

### Environment Variables

```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAX_IMAGE_SIZE=5242880  # 5MB in bytes

# Backend (.env)
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
UPLOAD_PATH=./uploads
```

---

**Last Updated:** October 4, 2025  
**Version:** 2.0.0  
**Maintainer:** Development Team
