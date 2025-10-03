# Shared Component Library Guide

## Overview

This guide documents the shared component library created to provide consistent, reusable UI components across the POS
System application. These components follow a unified design system with Tailwind CSS and provide a better developer
experience.

**Location:** `frontend/src/components/common/`

---

## Table of Contents

1. [Button Component](#button-component)
2. [Modal Component](#modal-component)
3. [Input Components](#input-components)
4. [SearchBar Component](#searchbar-component)
5. [Badge Component](#badge-component)
6. [Card Components](#card-components)
7. [Usage Examples](#usage-examples)
8. [Migration Guide](#migration-guide)

---

## Button Component

**File:** `Button.tsx`

A versatile button component with multiple variants, sizes, and states.

### Props

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
  // All standard HTML button props (onClick, disabled, type, etc.)
}
```

### Variants

| Variant     | Color       | Use Case                                |
| ----------- | ----------- | --------------------------------------- |
| `primary`   | Blue        | Primary actions (Save, Submit, Confirm) |
| `secondary` | Gray        | Secondary actions (Cancel, Back)        |
| `danger`    | Red         | Destructive actions (Delete, Remove)    |
| `success`   | Green       | Positive actions (Approve, Complete)    |
| `warning`   | Yellow      | Warning actions (Archive, Suspend)      |
| `ghost`     | Transparent | Tertiary actions (Cancel in modals)     |

### Sizes

- `sm` - Small buttons (px-3 py-1, text-xs)
- `md` - Medium buttons (px-4 py-2, text-sm) - **Default**
- `lg` - Large buttons (px-6 py-2, text-lg)

### Features

- ✅ Automatic focus ring styling
- ✅ Disabled state with opacity
- ✅ Hover effects
- ✅ Full-width option
- ✅ TypeScript support
- ✅ Accessible

### Usage Examples

```typescript
import { Button } from "../components/common";

// Primary button
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// Danger button (small)
<Button variant="danger" size="sm" onClick={handleDelete}>
  Delete
</Button>

// Full-width button
<Button variant="success" fullWidth>
  Complete Order
</Button>

// Disabled button
<Button variant="primary" disabled={isLoading}>
  {isLoading ? "Processing..." : "Submit"}
</Button>

// Ghost button (for modals)
<Button variant="ghost" onClick={onClose}>
  Cancel
</Button>
```

### Before & After

**Before (Old Code):**

```tsx
<button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
  Save
</button>
```

**After (Using Button Component):**

```tsx
<Button variant="primary" onClick={handleSave}>
  Save
</Button>
```

---

## Modal Component

**File:** `Modal.tsx`

A flexible modal/dialog component with overlay, header, body, and footer sections.

### Props

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  closeOnOverlayClick?: boolean;
}
```

### Sizes

- `sm` - max-width: 384px (24rem)
- `md` - max-width: 448px (28rem) - **Default**
- `lg` - max-width: 512px (32rem)
- `xl` - max-width: 576px (36rem)
- `2xl` - max-width: 672px (42rem)

### Features

- ✅ Auto-scrollable body (max-height: 90vh)
- ✅ Close on overlay click (configurable)
- ✅ Close button (×) in header
- ✅ Optional footer section
- ✅ Centered on screen
- ✅ Dark overlay backdrop
- ✅ Responsive padding

### Usage Examples

```typescript
import { Modal, Button } from "../components/common";

// Basic modal
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit Customer"
>
  <p>Modal content goes here...</p>
</Modal>

// Modal with footer
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
  size="sm"
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>Are you sure you want to delete this item?</p>
</Modal>

// Large modal without overlay close
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Product Details"
  size="2xl"
  closeOnOverlayClick={false}
>
  <div>Detailed content...</div>
</Modal>
```

### Before & After

**Before (Old Code):**

```tsx
{
  isOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Title</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
```

**After (Using Modal Component):**

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Title">
  {children}
</Modal>
```

---

## Input Components

**File:** `Input.tsx`

Three form input components: `Input`, `TextArea`, and `Select`.

### Input Component

```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  // All standard HTML input props
}
```

### TextArea Component

```typescript
interface TextAreaProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
  // All standard HTML textarea props
}
```

### Select Component

```typescript
interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string | number; label: string }>;
  // All standard HTML select props
}
```

### Features

- ✅ Automatic label generation
- ✅ Required field indicator (red asterisk)
- ✅ Error state with red border
- ✅ Error message display
- ✅ Helper text support
- ✅ Focus ring styling
- ✅ Disabled state
- ✅ Full-width option

### Usage Examples

```typescript
import { Input, TextArea, Select } from "../components/common";

// Text Input
<Input
  label="Product Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter product name"
  required
  fullWidth
/>

// Input with error
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  fullWidth
/>

// Input with helper text
<Input
  label="SKU"
  value={sku}
  onChange={(e) => setSku(e.target.value)}
  helperText="Unique product identifier"
  fullWidth
/>

// TextArea
<TextArea
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  placeholder="Enter product description"
  fullWidth
/>

// Select
<Select
  label="Category"
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
  options={[
    { value: "", label: "Select a category" },
    { value: 1, label: "Electronics" },
    { value: 2, label: "Clothing" },
  ]}
  required
  fullWidth
/>
```

### Before & After

**Before (Old Code):**

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Name <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
    required
  />
</div>
```

**After (Using Input Component):**

```tsx
<Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
```

---

## SearchBar Component

**File:** `SearchBar.tsx`

A reusable search input with search icon and optional clear button.

### Props

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  showClearButton?: boolean;
}
```

### Features

- ✅ Search icon on left
- ✅ Clear button (×) on right (when value exists)
- ✅ Focus ring styling
- ✅ Full-width option
- ✅ Customizable placeholder

### Usage Examples

```typescript
import { SearchBar } from "../components/common";

// Basic search
<SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Search products..."
  fullWidth
/>

// Search without clear button
<SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Search customers..."
  showClearButton={false}
/>
```

### Before & After

**Before (Old Code):**

```tsx
<div className="relative">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search..."
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
  />
  {search && (
    <button onClick={() => setSearch("")} className="absolute right-2 top-2">
      ×
    </button>
  )}
</div>
```

**After (Using SearchBar Component):**

```tsx
<SearchBar value={search} onChange={setSearch} placeholder="Search..." fullWidth />
```

---

## Badge Component

**File:** `Badge.tsx`

A status badge component with multiple color variants and optional dot indicator.

### Props

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "primary" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  rounded?: boolean;
  dot?: boolean;
}
```

### Variants

| Variant   | Color        | Use Case                                      |
| --------- | ------------ | --------------------------------------------- |
| `success` | Green        | Positive status (Active, Completed, In Stock) |
| `warning` | Yellow       | Warning status (Low Stock, Pending)           |
| `danger`  | Red          | Negative status (Inactive, Out of Stock)      |
| `info`    | Blue         | Informational status                          |
| `primary` | Blue (solid) | Primary emphasis                              |
| `default` | Gray         | Neutral status                                |

### Sizes

- `sm` - Small (px-2 py-0.5, text-xs)
- `md` - Medium (px-2.5 py-1, text-sm) - **Default**
- `lg` - Large (px-3 py-1.5, text-base)

### Features

- ✅ Color-coded variants
- ✅ Optional dot indicator
- ✅ Rounded or pill-shaped
- ✅ Multiple sizes

### Usage Examples

```typescript
import { Badge } from "../components/common";

// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="danger">Out of Stock</Badge>

// Badge with dot
<Badge variant="success" dot>
  Online
</Badge>

// Pill-shaped badge
<Badge variant="primary" rounded>
  New
</Badge>

// Small badge
<Badge variant="info" size="sm">
  Draft
</Badge>
```

### Before & After

**Before (Old Code):**

```tsx
<span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Active</span>
```

**After (Using Badge Component):**

```tsx
<Badge variant="success">Active</Badge>
```

---

## Card Components

**File:** `Card.tsx`

A set of card components for creating container layouts with header, body, and footer sections.

### Components

- `Card` - Main container
- `CardHeader` - Header with title and optional actions
- `CardBody` - Main content area
- `CardFooter` - Footer with optional alignment

### Card Props

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}
```

### CardHeader Props

```typescript
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}
```

### CardFooter Props

```typescript
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}
```

### Features

- ✅ Automatic shadow and border radius
- ✅ Optional padding
- ✅ Hover effect (optional)
- ✅ Header with actions slot
- ✅ Footer with alignment options
- ✅ Composable design

### Usage Examples

```typescript
import { Card, CardHeader, CardBody, CardFooter, Button } from "../components/common";

// Simple card
<Card>
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p>Card content goes here...</p>
</Card>

// Card with header and actions
<Card>
  <CardHeader actions={<Button size="sm">Edit</Button>}>
    Customer Details
  </CardHeader>
  <CardBody>
    <p>Customer information...</p>
  </CardBody>
</Card>

// Card with footer
<Card>
  <CardHeader>Order Summary</CardHeader>
  <CardBody>
    <p>Order items...</p>
  </CardBody>
  <CardFooter align="right">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </CardFooter>
</Card>

// Hover effect card
<Card hover>
  <p>This card has a hover effect</p>
</Card>

// Card without padding (for custom layouts)
<Card padding={false}>
  <img src="banner.jpg" alt="Banner" className="w-full" />
  <div className="p-4">
    <p>Content with custom padding</p>
  </div>
</Card>
```

---

## Usage Examples

### Complete Form Example

```typescript
import { Modal, Input, TextArea, Select, Button } from "../components/common";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Product
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          fullWidth
        />

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          fullWidth
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={categories}
          required
          fullWidth
        />

        <Input
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          fullWidth
        />
      </div>
    </Modal>
  );
}
```

### Dashboard Card Example

```typescript
import { Card, CardHeader, CardBody, Badge, Button } from "../components/common";

function StatCard() {
  return (
    <Card hover>
      <CardHeader
        actions={
          <Badge variant="success" size="sm" dot>
            Live
          </Badge>
        }
      >
        Today's Sales
      </CardHeader>
      <CardBody>
        <p className="text-3xl font-bold text-blue-600">$12,453</p>
        <p className="text-sm text-gray-500 mt-1">+15% from yesterday</p>
      </CardBody>
    </Card>
  );
}
```

### Search and Filter Example

```typescript
import { SearchBar, Select, Button } from "../components/common";

function ProductFilters() {
  return (
    <div className="flex gap-4">
      <SearchBar value={search} onChange={setSearch} placeholder="Search products..." className="flex-1" />

      <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} options={categoryOptions} />

      <Button variant="ghost" onClick={handleClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
```

---

## Migration Guide

### Step 1: Import Shared Components

Instead of creating custom buttons/inputs, import from the shared library:

```typescript
// Old way
import React from "react";

// New way
import React from "react";
import { Button, Input, Badge } from "../components/common";
```

### Step 2: Replace Inline Tailwind Classes

**Before:**

```tsx
<button
  onClick={handleSave}
  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
  disabled={isLoading}
>
  Save
</button>
```

**After:**

```tsx
<Button variant="primary" onClick={handleSave} disabled={isLoading}>
  Save
</Button>
```

### Step 3: Simplify Form Inputs

**Before:**

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
    required
  />
  {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
</div>
```

**After:**

```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
  fullWidth
/>
```

### Step 4: Use Modal Component

**Before:**

```tsx
{
  showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Item</h2>
          <button onClick={() => setShowModal(false)}>&times;</button>
        </div>
        <div>{/* Content */}</div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setShowModal(false)}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
```

**After:**

```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Edit Item"
  footer={
    <>
      <Button variant="ghost" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
    </>
  }
>
  {/* Content */}
</Modal>
```

### Step 5: Standardize Status Badges

**Before:**

```tsx
{
  product.stockQuantity > 0 ? (
    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">In Stock</span>
  ) : (
    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Out of Stock</span>
  );
}
```

**After:**

```tsx
{
  product.stockQuantity > 0 ? <Badge variant="success">In Stock</Badge> : <Badge variant="danger">Out of Stock</Badge>;
}
```

---

## Benefits

### 1. **Consistency**

- Unified design language across the entire application
- Same button styles, colors, and sizes everywhere
- Predictable component behavior

### 2. **Developer Experience**

- Less code to write
- Autocomplete with TypeScript
- No need to remember Tailwind classes
- Faster development

### 3. **Maintainability**

- Change design system in one place
- Easy to update colors, sizes, or styles
- Centralized component logic

### 4. **Accessibility**

- Built-in focus states
- Proper ARIA labels
- Keyboard navigation support

### 5. **Code Quality**

- Reduced code duplication
- Smaller component files
- Easier to review code

---

## Component Comparison

### Lines of Code Saved

**Example: A simple form with 3 inputs and 2 buttons**

**Before (Without Shared Components):** ~80 lines

```tsx
// 3 inputs × ~20 lines each = 60 lines
// 2 buttons × ~10 lines each = 20 lines
// Total: ~80 lines
```

**After (With Shared Components):** ~15 lines

```tsx
<Input label="Name" value={name} onChange={setName} fullWidth />
<Input label="Email" type="email" value={email} onChange={setEmail} fullWidth />
<Input label="Phone" value={phone} onChange={setPhone} fullWidth />
<Button variant="ghost" onClick={onCancel}>Cancel</Button>
<Button variant="primary" onClick={onSave}>Save</Button>
// Total: ~15 lines (83% reduction!)
```

---

## Best Practices

### 1. **Always Use Shared Components**

When you need a button, input, modal, etc., always check the shared library first before creating custom components.

### 2. **Use Semantic Variants**

- Use `variant="danger"` for delete actions, not `variant="primary"` with red custom styles
- Use `variant="success"` for approve/complete actions
- Use `variant="ghost"` for cancel buttons in modals

### 3. **Leverage TypeScript**

The components have full TypeScript support. Let the autocomplete guide you!

### 4. **Combine with Tailwind**

You can still add custom classes when needed:

```tsx
<Button variant="primary" className="mt-4 shadow-lg">
  Custom Styled Button
</Button>
```

### 5. **Use fullWidth Appropriately**

- Form inputs: Usually `fullWidth`
- Buttons in modals: Usually NOT `fullWidth`
- Mobile layouts: Consider `fullWidth` for better UX

---

## Component Sizes Summary

| Component | Small       | Medium (Default) | Large               |
| --------- | ----------- | ---------------- | ------------------- |
| Button    | px-3 py-1   | px-4 py-2        | px-6 py-2           |
| Badge     | px-2 py-0.5 | px-2.5 py-1      | px-3 py-1.5         |
| Modal     | max-w-sm    | max-w-md         | max-w-lg / xl / 2xl |

---

## Color System

### Primary Colors

- **Blue** (Primary): Main actions, links, primary buttons
- **Gray** (Secondary): Secondary actions, neutral elements
- **Green** (Success): Positive actions, success states
- **Red** (Danger): Destructive actions, error states
- **Yellow** (Warning): Warning actions, caution states

### Usage in Components

```tsx
// Buttons
<Button variant="primary">  {/* Blue */}
<Button variant="danger">   {/* Red */}
<Button variant="success">  {/* Green */}

// Badges
<Badge variant="success">   {/* Green background */}
<Badge variant="warning">   {/* Yellow background */}
<Badge variant="danger">    {/* Red background */}
```

---

## Conclusion

The shared component library provides a solid foundation for building consistent, maintainable UI across the POS System.
By using these components, you'll:

- ✅ Write less code
- ✅ Maintain consistency
- ✅ Improve accessibility
- ✅ Speed up development
- ✅ Make maintenance easier

**Happy coding! 🎉**

---

## Quick Reference

### Import Statement

```typescript
import {
  Button,
  Modal,
  Input,
  TextArea,
  Select,
  SearchBar,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "../components/common";
```

### Most Common Usage Patterns

```tsx
// Button
<Button variant="primary" onClick={handleClick}>Save</Button>

// Input
<Input label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

// Modal
<Modal isOpen={isOpen} onClose={onClose} title="Title">{children}</Modal>

// Badge
<Badge variant="success">Active</Badge>

// SearchBar
<SearchBar value={search} onChange={setSearch} fullWidth />
```
