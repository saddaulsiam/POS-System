# Quick Sale Settings Fix

## Issue

The "Add to Quick Sale" button was still showing on the Products page even when the Quick Sale feature was disabled in
Settings (`enableQuickSale = false`).

## Root Cause

The `ProductsPage` component was always passing the `onQuickSale` handler to the `ProductTable` component, regardless of
the `enableQuickSale` setting. The `ProductTable` component shows the "Add to Quick Sale" button whenever the
`onQuickSale` prop is provided.

## Solution

Updated `ProductsPage.tsx` to conditionally pass the `onQuickSale` prop based on the `enableQuickSale` setting:

### Changes Made

1. **Added Settings Context Import** (`frontend/src/pages/ProductsPage.tsx`):

   ```tsx
   import { useSettings } from "../context/SettingsContext";
   ```

2. **Added Settings Hook** (line 17):

   ```tsx
   const { settings } = useSettings();
   ```

3. **Conditional onQuickSale Prop** (line 427):

   ```tsx
   // Before:
   onQuickSale={handleQuickSale}

   // After:
   onQuickSale={settings?.enableQuickSale ? handleQuickSale : undefined}
   ```

## How It Works

### When Quick Sale is Enabled (`enableQuickSale = true`):

- ✅ `onQuickSale` prop is passed with the `handleQuickSale` function
- ✅ "Add to Quick Sale" button appears in the Actions column
- ✅ Users can add products to Quick Sale

### When Quick Sale is Disabled (`enableQuickSale = false`):

- ❌ `onQuickSale` prop is `undefined`
- ❌ "Add to Quick Sale" button is hidden
- ❌ Quick Sale functionality is not available

## Testing Steps

1. **Disable Quick Sale**:

   - Go to Settings → Features & Options
   - Turn OFF "Enable Quick Sale" toggle
   - Save settings

2. **Check Products Page**:

   - Navigate to Products page
   - Verify "Add to Quick Sale" button is NOT visible in the Actions column
   - Only Edit, Delete, and Print buttons should appear

3. **Enable Quick Sale**:

   - Go to Settings → Features & Options
   - Turn ON "Enable Quick Sale" toggle
   - Save settings

4. **Check Products Page Again**:
   - Navigate to Products page
   - Verify "Add to Quick Sale" ⚡ button IS visible in the Actions column
   - Click it to confirm it opens the Quick Sale configuration modal

## Related Files

- `frontend/src/pages/ProductsPage.tsx` - Main products page
- `frontend/src/components/products/ProductTable.tsx` - Table component with button rendering
- `frontend/src/context/SettingsContext.tsx` - Settings context with enableQuickSale field
- `backend/prisma/schema.prisma` - Database schema with enableQuickSale field

## Database Field

```prisma
model POSSettings {
  // ...
  enableQuickSale          Boolean   @default(true)
  // ...
}
```

## Status

✅ **FIXED** - The "Add to Quick Sale" button now respects the `enableQuickSale` setting and only appears when the
feature is enabled.

---

**Date**: October 5, 2025  
**Issue**: Quick Sale button showing when feature disabled  
**Fix**: Conditional prop passing based on settings
