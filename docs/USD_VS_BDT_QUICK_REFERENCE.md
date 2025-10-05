# 🌍 USD vs BDT Currency System - Quick Reference

## Currency Comparison

### 🇺🇸 USD (US Dollar)

```
Symbol: $
Position: Before amount
Decimals: 2
Thousand Separator: ,
Decimal Separator: .
Locale: en-US

Examples:
$10.00
$100.50
$1,234.56
$10,000.00
$1,000,000.00
```

### 🇧🇩 BDT (Bangladeshi Taka)

```
Symbol: ৳
Position: Before amount
Decimals: 2
Thousand Separator: ,
Decimal Separator: .
Locale: bn-BD

Examples:
৳10.00
৳100.50
৳1,234.56
৳10,000.00
৳1,000,000.00
```

---

## How to Switch Currencies

### Step 1: Go to Settings

Navigate to: **Settings → POS Settings**

### Step 2: Select Currency

Find the **Currency** dropdown and select:

- **US Dollar ($)** for USD
- **Bangladeshi Taka (৳)** for BDT

### Step 3: Save

Click the **Save Settings** button

### Step 4: Verify

Check any page with prices:

- **POS Page** - Product prices, cart totals
- **Products Page** - Product listings
- **Sales Page** - Transaction amounts
- **Reports Page** - Sales figures
- **Dashboard** - All metrics

---

## Currency Settings in Database

### Current Setting (After Migration)

```javascript
{
  currencyCode: "BDT",      // ← Main currency selector
  currencySymbol: "৳",      // ← Synced automatically
  currencyPosition: "before" // ← Synced automatically
}
```

When you select a currency:

1. `currencyCode` is set (e.g., "USD" or "BDT")
2. `currencySymbol` is automatically updated from currency config
3. `currencyPosition` is automatically updated from currency config
4. All 29 components automatically use the new formatting

---

## Formatting Examples by Module

### POS System

```
Cart Item Price (USD): $12.50
Cart Item Price (BDT): ৳12.50

Cart Total (USD): $156.75
Cart Total (BDT): ৳156.75

Change Amount (USD): $43.25
Change Amount (BDT): ৳43.25
```

### Products

```
Selling Price (USD): $25.99
Selling Price (BDT): ৳25.99

Purchase Price (USD): $15.00
Purchase Price (BDT): ৳15.00
```

### Sales & Reports

```
Total Sales (USD): $10,250.50
Total Sales (BDT): ৳10,250.50

Average Order (USD): $45.75
Average Order (BDT): ৳45.75

Daily Revenue (USD): $1,234.56
Daily Revenue (BDT): ৳1,234.56
```

### Loyalty Program

```
Discount Value (USD): $10.00
Discount Value (BDT): ৳10.00

Store Credit (USD): $25.00
Store Credit (BDT): ৳25.00

Minimum Purchase (USD): $50.00
Minimum Purchase (BDT): ৳50.00
```

---

## Additional Currencies Available

### 🇪🇺 EUR (Euro)

```
Symbol: €
Examples: €1,234.56
```

### 🇬🇧 GBP (British Pound)

```
Symbol: £
Examples: £1,234.56
```

### 🇮🇳 INR (Indian Rupee)

```
Symbol: ₹
Examples: ₹1,234.56
```

### 🇯🇵 JPY (Japanese Yen)

```
Symbol: ¥
Examples: ¥1,235 (no decimals)
```

---

## Technical Details

### Currency Configuration Object

```typescript
// USD Configuration
{
  code: "USD",
  name: "US Dollar",
  symbol: "$",
  symbolPosition: "before",
  decimals: 2,
  thousandSeparator: ",",
  decimalSeparator: ".",
  locale: "en-US"
}

// BDT Configuration
{
  code: "BDT",
  name: "Bangladeshi Taka",
  symbol: "৳",
  symbolPosition: "before",
  decimals: 2,
  thousandSeparator: ",",
  decimalSeparator: ".",
  locale: "bn-BD"
}
```

### Usage in Code

```typescript
import { formatCurrency } from "../utils/currencyUtils";
import { useSettings } from "../context/SettingsContext";

const MyComponent = () => {
  const { settings } = useSettings();

  // Automatically uses USD or BDT based on settings
  return (
    <div>
      <span>{formatCurrency(1234.56, settings)}</span>
      {/* Shows "$1,234.56" or "৳1,234.56" */}
    </div>
  );
};
```

---

## Migration Status

### ✅ Your Current Status

```
Original Currency Symbol: ৳ (Bangladeshi Taka)
Migrated to Currency Code: BDT
Status: ✅ Migration Complete

All prices in your system are now showing as: ৳1,234.56
```

### What Happened

1. System detected your existing `currencySymbol: "৳"`
2. Automatically mapped it to `currencyCode: "BDT"`
3. Updated database record
4. All components now use proper BDT formatting

---

## Quick Checklist

### To Use USD

- [ ] Go to Settings → POS Settings
- [ ] Select "US Dollar ($)" from Currency dropdown
- [ ] Click Save
- [ ] All prices now show with $ symbol

### To Use BDT (Current)

- [x] Go to Settings → POS Settings
- [x] Select "Bangladeshi Taka (৳)" from Currency dropdown
- [x] Click Save
- [x] All prices now show with ৳ symbol ✅

### Verify Currency is Working

- [ ] Check POS Page - prices show correct symbol
- [ ] Check Products Page - selling prices formatted correctly
- [ ] Check Sales Page - transaction amounts correct
- [ ] Check Dashboard - metrics show proper currency
- [ ] Check Reports - all figures formatted properly

---

## Support for More Currencies

### Easy to Add New Currencies

Just edit `frontend/src/config/currencyConfig.ts`:

```typescript
export const CURRENCIES = {
  // ... existing currencies

  YOUR_CURRENCY: {
    code: "CODE",
    name: "Currency Name",
    symbol: "X",
    symbolPosition: "before",
    decimals: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    locale: "locale-CODE",
  },
};
```

### Popular Currencies to Add

- PKR - Pakistani Rupee (₨)
- THB - Thai Baht (฿)
- MYR - Malaysian Ringgit (RM)
- PHP - Philippine Peso (₱)
- SGD - Singapore Dollar (S$)
- CNY - Chinese Yuan (¥)

---

## Summary

✅ **You now have a complete currency system** ✅ **USD and BDT fully supported** ✅ **Easy to switch between
currencies** ✅ **Proper locale formatting** ✅ **Works across all 29 components** ✅ **Migration completed
automatically**

**Current Setting**: 🇧🇩 **BDT (Bangladeshi Taka)** ৳

Switch to USD anytime from Settings!
