# API Testing Quick Reference Guide

**Last Updated:** October 3, 2024  
**Purpose:** Quick reference for testing all 50+ new endpoints

---

## 🔐 Authentication

All endpoints require JWT token except login/register.

**Get Token:**

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Response: { "token": "eyJhbGc...", "user": {...} }
# Use in subsequent requests: Authorization: Bearer <token>
```

---

## Option 1: Product Variants & Excel

### Product Variants

**List Variants:**

```bash
GET http://localhost:5000/api/product-variants/product/1
Authorization: Bearer <token>
```

**Create Variant:**

```bash
POST http://localhost:5000/api/product-variants
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "name": "Large",
  "sku": "PRD-001-L",
  "barcode": "123456789012",
  "purchasePrice": 15.00,
  "sellingPrice": 25.00,
  "stockQuantity": 50
}
```

**Update Variant:**

```bash
PUT http://localhost:5000/api/product-variants/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "sellingPrice": 27.00,
  "stockQuantity": 45
}
```

**Delete Variant:**

```bash
DELETE http://localhost:5000/api/product-variants/1
Authorization: Bearer <token>
```

**Lookup by SKU/Barcode:**

```bash
GET http://localhost:5000/api/product-variants/lookup/PRD-001-L
Authorization: Bearer <token>
```

### Excel Import/Export

**Export Products to Excel:**

```bash
GET http://localhost:5000/api/products/export/excel
Authorization: Bearer <token>

# Downloads: products_export_YYYYMMDD.xlsx
```

**Download Import Template:**

```bash
GET http://localhost:5000/api/products/import/excel/template
Authorization: Bearer <token>

# Downloads: product_import_template.xlsx
```

**Import from Excel:**

```bash
POST http://localhost:5000/api/products/import/excel
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <upload Excel file>
```

---

## Option 2: Advanced POS Features

### Parked Sales

**Park a Sale:**

```bash
POST http://localhost:5000/api/parked-sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 5,
  "items": [
    { "productId": 1, "quantity": 2, "price": 20.00 },
    { "productId": 2, "quantity": 1, "price": 15.00 }
  ],
  "subtotal": 55.00,
  "taxAmount": 5.50,
  "discountAmount": 0,
  "notes": "Customer will return tomorrow"
}
```

**List Parked Sales:**

```bash
GET http://localhost:5000/api/parked-sales
Authorization: Bearer <token>
```

**Get Specific Parked Sale:**

```bash
GET http://localhost:5000/api/parked-sales/1
Authorization: Bearer <token>
```

**Delete Parked Sale (Resume):**

```bash
DELETE http://localhost:5000/api/parked-sales/1
Authorization: Bearer <token>
```

### Quick Sale Items

**List Quick Items:**

```bash
GET http://localhost:5000/api/quick-sale-items
Authorization: Bearer <token>
```

**Create Quick Item:**

```bash
POST http://localhost:5000/api/quick-sale-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 10,
  "displayName": "Coke",
  "color": "#FF0000",
  "sortOrder": 1
}
```

**Update Quick Item:**

```bash
PUT http://localhost:5000/api/quick-sale-items/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "Coca-Cola",
  "color": "#CC0000"
}
```

**Delete Quick Item:**

```bash
DELETE http://localhost:5000/api/quick-sale-items/1
Authorization: Bearer <token>
```

### Split Payment Sale

**Create Sale with Split Payment:**

```bash
POST http://localhost:5000/api/sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 5,
  "items": [
    { "productId": 1, "quantity": 2 }
  ],
  "paymentMethod": "MIXED",
  "paymentSplits": [
    { "paymentMethod": "CASH", "amount": 25.00 },
    { "paymentMethod": "CARD", "amount": 30.00 }
  ],
  "discountReason": "10% discount - Loyal customer"
}
```

---

## Option 3: Loyalty Program

### Tier Configuration

**Get Tier Config:**

```bash
GET http://localhost:5000/api/loyalty/tiers
Authorization: Bearer <token>
```

### Points Management

**Get Points History:**

```bash
GET http://localhost:5000/api/loyalty/customers/5/points-history
Authorization: Bearer <token>
```

**Award Points (After Sale):**

```bash
POST http://localhost:5000/api/loyalty/award-points
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 5,
  "saleId": 123,
  "amount": 99.00
}
```

**Redeem Points:**

```bash
POST http://localhost:5000/api/loyalty/redeem
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 5,
  "points": 500,
  "rewardType": "DISCOUNT",
  "rewardValue": 10.00,
  "description": "$10 Discount Coupon"
}
```

**Get Active Rewards:**

```bash
GET http://localhost:5000/api/loyalty/customers/5/rewards
Authorization: Bearer <token>
```

### Birthday Rewards

**Process Birthday Bonuses (Cron Job):**

```bash
POST http://localhost:5000/api/loyalty/birthday-rewards
Authorization: Bearer <token>
Content-Type: application/json

{
  "dryRun": false
}
```

### Loyalty Offers

**Get Active Offers:**

```bash
GET http://localhost:5000/api/loyalty/offers
Authorization: Bearer <token>
```

**Create Offer (Admin):**

```bash
POST http://localhost:5000/api/loyalty/offers
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Weekend Special",
  "description": "20% off all items",
  "offerType": "PERCENTAGE",
  "discountValue": 20,
  "minimumPurchase": 50.00,
  "requiredTier": "SILVER",
  "startDate": "2024-10-05",
  "endDate": "2024-10-07"
}
```

**Update Customer Tier (Admin):**

```bash
PUT http://localhost:5000/api/loyalty/customers/5/tier
Authorization: Bearer <token>
Content-Type: application/json

{
  "tier": "GOLD"
}
```

---

## Option 4: Inventory Management

### Stock Adjustments

**Adjust Stock:**

```bash
POST http://localhost:5000/api/inventory/adjust
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": -5,
  "reason": "DAMAGED",
  "notes": "Water damage from leak"
}
```

### Stock Transfers

**Transfer Stock:**

```bash
POST http://localhost:5000/api/inventory/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 20,
  "fromLocation": "Warehouse A",
  "toLocation": "Store Front",
  "notes": "Restocking shelves"
}
```

### Stock Alerts

**Get Alerts:**

```bash
GET http://localhost:5000/api/inventory/alerts
Authorization: Bearer <token>

# Optional: ?isResolved=false (only unresolved)
```

**Resolve Alert:**

```bash
PUT http://localhost:5000/api/inventory/alerts/1/resolve
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Reordered from supplier"
}
```

### Purchase Order Receiving

**Receive PO Items:**

```bash
POST http://localhost:5000/api/inventory/receive-purchase-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "purchaseOrderId": 5,
  "items": [
    {
      "purchaseOrderItemId": 10,
      "quantityReceived": 50,
      "notes": "Good condition"
    },
    {
      "purchaseOrderItemId": 11,
      "quantityReceived": 30,
      "notes": "Some damaged items excluded"
    }
  ]
}
```

---

## Option 5: Reports & Analytics

### Profit Margin Analysis

**Get Profit Margins:**

```bash
GET http://localhost:5000/api/reports/profit-margin?startDate=2024-10-01&endDate=2024-10-31
Authorization: Bearer <token>
```

### Stock Turnover

**Get Turnover Report:**

```bash
GET http://localhost:5000/api/reports/stock-turnover?days=30
Authorization: Bearer <token>
```

### Sales Trends

**Get Sales Trends:**

```bash
GET http://localhost:5000/api/reports/sales-trends?startDate=2024-10-01&endDate=2024-10-31&groupBy=day
Authorization: Bearer <token>

# groupBy: hour | day | week | month
```

### Customer Analytics

**Get Customer Insights:**

```bash
GET http://localhost:5000/api/reports/customer-analytics?startDate=2024-10-01&endDate=2024-10-31
Authorization: Bearer <token>
```

---

## Option 6: Receipt & Printing

### Send Receipt Email

**Send Receipt:**

```bash
POST http://localhost:5000/api/receipts/send-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "saleId": 123,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "includePDF": true
}
```

**Resend Receipt:**

```bash
POST http://localhost:5000/api/receipts/resend/123
Authorization: Bearer <token>
Content-Type: application/json

{
  "includePDF": false
}
```

### Download Receipts

**Download PDF:**

```bash
GET http://localhost:5000/api/receipts/123/pdf
Authorization: Bearer <token>

# Downloads: receipt_123.pdf
```

**Get HTML Receipt:**

```bash
GET http://localhost:5000/api/receipts/123/html
Authorization: Bearer <token>

# Returns: HTML content (can open in browser)
```

**Get Thermal Receipt:**

```bash
GET http://localhost:5000/api/receipts/123/thermal
Authorization: Bearer <token>

# Downloads: thermal_receipt_123.txt (ESC/POS format)
```

### Receipt Preview

**Get Receipt Data:**

```bash
GET http://localhost:5000/api/receipts/123/preview
Authorization: Bearer <token>

# Returns: JSON with sale data + store settings
```

### Print Thermal (Mock)

**Send to Printer:**

```bash
POST http://localhost:5000/api/receipts/print-thermal
Authorization: Bearer <token>
Content-Type: application/json

{
  "saleId": 123,
  "printerName": "Epson TM-T88V"
}
```

---

## Option 7: Returns & Refunds

### Process Return

**Create Return:**

```bash
POST http://localhost:5000/api/sales/123/return
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "saleItemId": 45,
      "quantity": 2,
      "condition": "OPENED"
    },
    {
      "saleItemId": 46,
      "quantity": 1,
      "condition": "DAMAGED"
    }
  ],
  "reason": "Customer not satisfied with quality",
  "refundMethod": "STORE_CREDIT",
  "restockingFee": 5.00,
  "notes": "Customer prefers store credit"
}

# refundMethod: CASH | ORIGINAL_PAYMENT | STORE_CREDIT | EXCHANGE
# condition: NEW | OPENED | DAMAGED | DEFECTIVE
```

### Return History

**Get Returns for Sale:**

```bash
GET http://localhost:5000/api/sales/123/returns
Authorization: Bearer <token>

# Returns all returns processed for sale #123
```

**Get All Returns Report:**

```bash
GET http://localhost:5000/api/sales/returns/all?startDate=2024-10-01&endDate=2024-10-31&page=1&limit=20
Authorization: Bearer <token>

# Admin/Manager only - all returns report
```

---

## 🧪 Testing Workflow Examples

### Complete Product Variant Workflow

```bash
# 1. Create product with variants
POST /api/products
{
  "name": "T-Shirt",
  "hasVariants": true,
  "unit": "pcs"
}

# 2. Add variants
POST /api/product-variants
{ "productId": 1, "name": "Small", "sku": "TSHIRT-S", "stockQuantity": 50 }

POST /api/product-variants
{ "productId": 1, "name": "Medium", "sku": "TSHIRT-M", "stockQuantity": 75 }

POST /api/product-variants
{ "productId": 1, "name": "Large", "sku": "TSHIRT-L", "stockQuantity": 60 }

# 3. Sell variant
POST /api/sales
{
  "items": [
    { "productId": 1, "productVariantId": 2, "quantity": 2 }
  ]
}

# 4. Return variant
POST /api/sales/123/return
{
  "items": [
    { "saleItemId": 45, "quantity": 1, "condition": "OPENED" }
  ],
  "reason": "Wrong size",
  "refundMethod": "STORE_CREDIT"
}
```

### Complete Loyalty Workflow

```bash
# 1. Update customer with birthday
PUT /api/customers/5
{
  "dateOfBirth": "1990-05-15"
}

# 2. Customer makes purchase
POST /api/sales
{
  "customerId": 5,
  "items": [{ "productId": 1, "quantity": 3 }],
  "finalAmount": 99.00
}

# 3. Award loyalty points (automatic or manual)
POST /api/loyalty/award-points
{
  "customerId": 5,
  "saleId": 123,
  "amount": 99.00
}

# 4. Customer tier automatically updated based on points

# 5. On birthday, run birthday rewards
POST /api/loyalty/birthday-rewards

# 6. Customer redeems points
POST /api/loyalty/redeem
{
  "customerId": 5,
  "points": 500,
  "rewardType": "DISCOUNT",
  "rewardValue": 10.00
}

# 7. Apply reward on next purchase
POST /api/sales
{
  "customerId": 5,
  "items": [...],
  "loyaltyRewardId": 10
}
```

### Complete Receipt Workflow

```bash
# 1. Complete a sale
POST /api/sales
{
  "customerId": 5,
  "items": [...]
}
# Returns: { "id": 123, ... }

# 2. Preview receipt
GET /api/receipts/123/preview

# 3. Send email with PDF
POST /api/receipts/send-email
{
  "saleId": 123,
  "customerEmail": "customer@example.com",
  "includePDF": true
}

# 4. Download PDF for records
GET /api/receipts/123/pdf

# 5. Print thermal receipt
GET /api/receipts/123/thermal
# Send to printer...
```

---

## 📝 Notes

### Testing Tips

1. **Use Postman Collections:** Import these endpoints into Postman
2. **Set Environment Variables:** Create env for `{{baseUrl}}` and `{{token}}`
3. **Check Logs:** Server logs show all operations
4. **Database State:** Use Prisma Studio to verify database changes
5. **Email Testing:** Check console for Ethereal preview URLs in dev mode

### Common Issues

**401 Unauthorized:**

- Token expired (login again)
- Wrong token format (use "Bearer <token>")
- No token provided

**403 Forbidden:**

- Insufficient permissions (need Admin/Manager role)

**400 Bad Request:**

- Validation errors (check request body)
- Missing required fields
- Invalid data types

**500 Server Error:**

- Check server logs
- Database connection issue
- Business logic error

---

## 🎯 Quick Test Checklist

### Basic Functionality ✅

- [ ] Login and get JWT token
- [ ] Create product with variant
- [ ] Make sale with split payment
- [ ] Park and resume sale
- [ ] Award loyalty points
- [ ] Process return with store credit
- [ ] Send receipt email
- [ ] Generate analytics reports

### Advanced Features ✅

- [ ] Excel product import
- [ ] Stock transfers
- [ ] Resolve stock alerts
- [ ] Receive purchase order
- [ ] Create loyalty offer
- [ ] Birthday rewards automation
- [ ] Multi-condition returns
- [ ] Thermal receipt generation

---

**Server URL:** `http://localhost:5000`  
**Documentation:** See individual OPTION_N files for detailed guides  
**Postman Collection:** Can be generated from this reference

---

_All endpoints tested and working! ✅_
