# Comprehensive POS Settings Guide

## Overview

The POS Settings page provides complete control over all system features, store information, and operational
preferences. This guide explains each setting category and how to use them effectively.

---

## Settings Categories

### 1. 🎯 Feature Controls (POS Features)

Core POS functionality toggles with detailed information modals.

#### ⚡ Quick Sale Buttons

- **What**: Customizable buttons for frequently sold products
- **When to Enable**: High-volume repeat products
- **When to Disable**: Training periods or frequently changing inventory
- **Impact**: Shows/hides Quick Sale buttons in POS

#### 💳 Split Payment

- **What**: Allow multiple payment methods per transaction
- **When to Enable**: Customers commonly split payments
- **When to Disable**: Single payment method policy
- **Impact**: Shows/hides Split Payment button in cart

#### 📦 Park Sale

- **What**: Temporarily save incomplete transactions
- **When to Enable**: High-traffic stores with waiting customers
- **When to Disable**: All transactions complete immediately
- **Impact**: Shows/hides Park Sale and Parked buttons

#### 👤 Customer Search

- **What**: Link customers to transactions for loyalty
- **When to Enable**: Loyalty program active
- **When to Disable**: Anonymous-only sales
- **Impact**: Shows/hides customer search section

#### 📷 Barcode Scanner

- **What**: Physical scanner or manual barcode entry
- **When to Enable**: Using barcode scanners
- **When to Disable**: No barcodes or prevent accidental scans
- **Impact**: Shows/hides barcode input field

#### 🎁 Loyalty Points

- **What**: Customer rewards and points system
- **When to Enable**: Active loyalty program
- **When to Disable**: No loyalty program or maintenance
- **Impact**: Shows/hides loyalty redemption features

---

### 2. 🏪 Store Information

Business details displayed on receipts and reports.

**Fields:**

- **Store Name**: Business name (shown on receipts)
- **Store Address**: Physical location (multi-line)
- **Phone Number**: Contact number
- **Email Address**: Store email
- **Tax ID**: Optional tax identification number

**Usage:**

- Appears on all printed receipts
- Used in reports and customer communications
- Required for professional receipts

---

### 3. 🧾 Receipt Settings

Configure receipt printing and email options.

#### Auto-Print Receipt

- Automatically print after each sale
- **Enable**: For traditional POS with receipt printer
- **Disable**: Digital-only or manual print confirmation

#### Auto-Email Receipt

- Automatically email receipt to customer
- **Enable**: If customer email is collected
- **Disable**: Manual email or no email receipts

#### Receipt Footer Text

- Custom message at bottom of receipt
- Example: "Thank you for shopping with us!"
- Good for: Return policy summary, social media, website

#### Return Policy Text

- Detailed return policy on receipt
- Example: "Returns accepted within 30 days with receipt"
- Helps reduce return disputes

---

### 4. 💰 Tax & Currency

Configure pricing and tax settings.

**Default Tax Rate (%)**

- Applied to all products unless overridden
- Product-specific tax rates take precedence
- Range: 0-100%

**Currency Symbol**

- Display symbol for prices
- Examples: $, €, £, ¥
- Appears throughout system

**Currency Position**

- **Before**: $100.00
- **After**: 100.00$
- Affects all price displays

---

### 5. 🔔 Alerts & Notifications

Manage inventory alerts and notifications.

#### Low Stock Alerts

- **Enable**: Get notified when products are low
- Threshold: Set minimum quantity (see below)
- Helps prevent stockouts

#### Email Notifications

- **Enable**: Send email alerts to admin
- Requires: Admin Alert Email (see below)
- Notifications for: Low stock, system errors

**Low Stock Threshold**

- Quantity that triggers alert
- Range: 1-1000 units
- Example: Set to 10 = alert when ≤10 units

**Admin Alert Email**

- Email address for system notifications
- Only shown if Email Notifications enabled
- Receives: Stock alerts, system notifications

---

### 6. ⚙️ System Settings

Security and system preferences.

#### Require Password on Void

- **Enable**: Admin password required to void transactions
- **Disable**: Any user can void (not recommended)
- Security: Prevents unauthorized voids

#### Enable Audit Log

- **Enable**: Track all system actions
- **Disable**: No action tracking (not recommended)
- Tracks: Who did what and when

#### Show Product Images

- **Enable**: Display product images in POS
- **Disable**: Text-only faster loading
- Impact: POS interface visual appearance

**Auto Logout (Minutes)**

- Logout after inactivity
- Range: 5-240 minutes
- Security: Prevents unauthorized access
- Recommendation: 15-30 minutes

**Products Per Page**

- Pagination for product lists
- Range: 10-100 products
- Lower = faster loading
- Higher = less clicking

**Default Product View**

- **Grid View**: Visual cards with images
- **List View**: Compact table format
- Default for product management pages

---

## Best Practices

### Security Settings

✅ **Enable**:

- Require Password on Void
- Enable Audit Log
- Auto Logout (15-30 minutes)

❌ **Disable During**:

- Training sessions (temporarily)
- System maintenance

### Receipt Settings

✅ **Recommended**:

- Auto-Print if using receipt printer
- Clear receipt footer with store info
- Return policy text to reduce disputes

### Alerts

✅ **Configure**:

- Low Stock Threshold: 1-2 weeks of inventory
- Admin Email: Monitor regularly
- Enable for critical products only

### Performance

✅ **For Speed**:

- Disable product images if loading slow
- Reduce products per page
- Use list view for faster rendering

---

## Quick Access

- **Info Icons**: Click ℹ️ next to any feature toggle for detailed explanation
- **Last Updated**: Shown in header with employee name
- **Changes**: Take effect immediately (no page refresh needed)

---

## Common Scenarios

### Scenario 1: High-Traffic Retail Store

```
✅ Enable: Quick Sale, Customer Search, Barcode Scanner, Loyalty Points
✅ Enable: Auto-Print Receipt, Low Stock Alerts
✅ Set: Low Stock Threshold = 20, Auto Logout = 15 minutes
```

### Scenario 2: Small Boutique

```
✅ Enable: Customer Search, Loyalty Points
❌ Disable: Quick Sale, Split Payment, Barcode Scanner
✅ Set: Auto Logout = 60 minutes, Show Product Images
```

### Scenario 3: Restaurant/Cafe

```
✅ Enable: Quick Sale (for common items), Park Sale
❌ Disable: Customer Search, Loyalty Points, Barcode Scanner
✅ Set: Products Per Page = 50, Grid View
```

### Scenario 4: Anonymous Sales Only

```
❌ Disable: Customer Search, Loyalty Points
✅ Enable: Quick Sale, Split Payment
✅ Set: Audit Log = Enabled for security
```

---

## Technical Details

### Database

- Settings stored in `POSSettings` table
- Single row (ID=1) for entire system
- All changes tracked with timestamps

### API Endpoints

- **GET** `/api/pos-settings` - Read settings (all users)
- **PUT** `/api/pos-settings` - Update settings (ADMIN only)

### Frontend

- **Settings Page**: `/settings` (ADMIN/MANAGER only)
- **Settings Context**: Global state management
- **Real-time Updates**: No page refresh required

### Backend Validation

- Boolean fields: true/false only
- Tax Rate: 0-100%
- Low Stock Threshold: 1-1000
- Auto Logout: 5-240 minutes
- Products Per Page: 10-100
- Currency Position: "before" or "after"
- Default View: "grid" or "list"

---

## Troubleshooting

### Settings Not Saving

1. Check you're logged in as ADMIN
2. Check console for validation errors
3. Verify network connection

### Features Not Hiding

1. Refresh the browser
2. Clear browser cache
3. Check Settings Context is loaded

### Email Notifications Not Working

1. Verify admin email is valid
2. Check email server configuration
3. Enable Email Notifications toggle

---

## Support

For additional help:

- Check individual feature info modals (ℹ️ icons)
- Review audit logs for changes
- Contact system administrator

**Last Updated**: 2025-01-04  
**Version**: 2.0 - Comprehensive Settings
