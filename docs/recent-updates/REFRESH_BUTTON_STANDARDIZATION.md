# Refresh Button Standardization

## 🎯 Overview

All refresh buttons across the application have been standardized to use a single, reusable `RefreshButton` component
for consistency and maintainability.

## 📁 Component Location

**File:** `frontend/src/components/common/RefreshButton.tsx`

## 🎨 Component Features

### Props

```typescript
interface RefreshButtonProps {
  onClick: () => void; // Function to call when clicked
  loading?: boolean; // Shows loading spinner when true
  disabled?: boolean; // Disables button when true
  variant?: "default" | "icon-only"; // Button style variant
  className?: string; // Additional CSS classes
}
```

### Variants

#### 1. **Default Variant** (with text)

- Shows refresh icon + "Refresh" text
- White background with shadow
- Suitable for main sections

```tsx
<RefreshButton onClick={handleRefresh} loading={isLoading} />
```

**Visual:**

```
┌─────────────┐
│ 🔄 Refresh  │
└─────────────┘
```

#### 2. **Icon-Only Variant**

- Shows only the refresh icon
- Blue background
- Compact design for toolbars

```tsx
<RefreshButton onClick={handleRefresh} loading={isLoading} variant="icon-only" />
```

**Visual:**

```
┌─────┐
│ 🔄  │
└─────┘
```

## 📊 Updated Pages

### 1. **Admin Dashboard** (`AdminDashboard.tsx`)

**Location:** Key Metrics section header

**Before:**

```tsx
<button onClick={loadDashboardData} className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md...">
  <svg className="w-5 h-5">...</svg>
  Refresh
</button>
```

**After:**

```tsx
<RefreshButton onClick={loadDashboardData} loading={isLoading} />
```

---

### 2. **Analytics Page** (`AnalyticsPage.tsx`)

**Location:** Page header toolbar

**Before:**

```tsx
<button onClick={fetchAnalytics} disabled={refreshing} className="p-2 bg-blue-500 text-white rounded-lg...">
  <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
</button>
```

**After:**

```tsx
<RefreshButton onClick={fetchAnalytics} loading={refreshing} variant="icon-only" />
```

---

### 3. **Loyalty Dashboard** (`LoyaltyDashboard.tsx`)

**Location:** Component header

**Before:**

```tsx
<button
  onClick={() => {
    fetchLoyaltyData();
    onRefresh?.();
  }}
  className="px-3 py-1 text-sm bg-white text-blue-600 border..."
>
  Refresh
</button>
```

**After:**

```tsx
<RefreshButton
  onClick={() => {
    fetchLoyaltyData();
    onRefresh?.();
  }}
  loading={loading}
/>
```

---

## 🎨 Styling Details

### Default Variant Styles

```css
✓ White background (bg-white)
✓ Rounded corners (rounded-lg)
✓ Shadow on hover (shadow-sm → shadow-md)
✓ Gray text (text-gray-700)
✓ Medium font weight
✓ Smooth transitions (200ms)
✓ Disabled state (50% opacity)
✓ Gap between icon and text (gap-2)
```

### Icon-Only Variant Styles

```css
✓ Blue background (bg-blue-500)
✓ White icon (text-white)
✓ Hover effect (hover:bg-blue-600)
✓ Padding: 8px (p-2)
✓ Disabled state (50% opacity)
✓ Smooth transitions (200ms)
```

### Loading State

```css
✓ Icon spins (animate-spin)
✓ Button disabled automatically
✓ Cursor changes to not-allowed
```

---

## 🔧 Usage Examples

### Basic Usage

```tsx
import { RefreshButton } from "../components/common";

function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  return <RefreshButton onClick={handleRefresh} loading={loading} />;
}
```

### With Custom Classes

```tsx
<RefreshButton onClick={handleRefresh} loading={loading} className="mt-4" />
```

### Disabled State

```tsx
<RefreshButton onClick={handleRefresh} disabled={!hasData} />
```

### Icon-Only for Toolbars

```tsx
<div className="flex items-center gap-2">
  <RefreshButton onClick={handleRefresh} loading={loading} variant="icon-only" />
  <OtherToolbarButtons />
</div>
```

---

## 📋 Component Export

The component is exported from the common components barrel file:

**File:** `frontend/src/components/common/index.ts`

```typescript
export { RefreshButton } from "./RefreshButton";
```

This allows easy importing:

```typescript
import { RefreshButton } from "../components/common";
```

---

## ✅ Benefits

### 1. **Consistency**

- All refresh buttons look and behave the same
- Unified user experience across the app
- Predictable interaction patterns

### 2. **Maintainability**

- Single source of truth for refresh button styling
- Easy to update globally
- Reduced code duplication

### 3. **Accessibility**

- Built-in `title` attribute for tooltips
- Proper `disabled` state handling
- Keyboard accessible (button element)

### 4. **Developer Experience**

- Simple API with sensible defaults
- TypeScript support with full type safety
- Reusable across all pages and components

---

## 🎯 Visual Comparison

### Before (Inconsistent)

**Admin Dashboard:**

```
┌─────────────────┐
│ 🔄  Refresh     │  ← Custom SVG icon, unique styling
└─────────────────┘
```

**Analytics Page:**

```
┌─────┐
│ 🔄  │  ← Lucide icon, blue background
└─────┘
```

**Loyalty Dashboard:**

```
┌─────────────┐
│  Refresh    │  ← No icon, border style
└─────────────┘
```

### After (Consistent)

**All Pages:**

```
Default Variant:
┌─────────────────┐
│ 🔄  Refresh     │  ← Same icon, same style
└─────────────────┘

Icon-Only Variant:
┌─────┐
│ 🔄  │  ← Same icon, same style
└─────┐
```

---

## 🔄 Animation Behavior

### Idle State

```
Icon is static
Button is clickable
Cursor: pointer
```

### Loading State

```
Icon rotates continuously (animate-spin)
Button is disabled
Cursor: not-allowed
Opacity: 50%
```

### Hover State (when not loading)

```
Shadow increases (shadow-sm → shadow-md)
Background changes slightly
Smooth transition (200ms)
```

---

## 📝 Implementation Checklist

- ✅ Created `RefreshButton.tsx` component
- ✅ Added to common components exports
- ✅ Updated AdminDashboard.tsx
- ✅ Updated AnalyticsPage.tsx
- ✅ Updated LoyaltyDashboard.tsx
- ✅ Verified no TypeScript errors
- ✅ Tested both variants
- ✅ Documented usage

---

## 🚀 Future Enhancements

Potential improvements for the RefreshButton component:

1. **Color Variants**

   ```typescript
   variant?: "default" | "icon-only"
   color?: "blue" | "green" | "gray"
   ```

2. **Size Options**

   ```typescript
   size?: "sm" | "md" | "lg"
   ```

3. **Custom Icons**

   ```typescript
   icon?: ReactNode
   ```

4. **Tooltip Customization**
   ```typescript
   tooltip?: string
   ```

---

## 📚 Related Components

- `BackButton` - Standardized back navigation
- `Button` - General purpose button component
- `Badge` - Status indicators
- `Card` - Content containers

---

**Status:** ✅ Complete  
**Date:** October 5, 2025  
**Impact:** 3 pages updated, 1 new component created  
**Breaking Changes:** None (backwards compatible)
