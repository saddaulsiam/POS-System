# Integration Testing Guide - Options 1 & 2

**Date:** October 4, 2025  
**Status:** ✅ Ready for Testing  
**Features:** Product Variants + Advanced POS Features

---

## 🚀 **Setup & Prerequisites**

### **1. Servers Running**

- ✅ Backend: `http://localhost:5000` (Already running)
- ✅ Frontend: `http://localhost:3001` (Already running)

### **2. Login Credentials**

```
Username: admin
PIN Code: 1234
```

---

## 📦 **Option 1: Product Variants & Excel Import/Export**

### **Test 1: View Product Details Page**

**Steps:**

1. Navigate to **Products** page from sidebar
2. Find any product in the table
3. Click the **👁️ View** button (first action button)
4. ✅ **Expected:** Product detail page opens showing:
   - Product basic info (name, SKU, category, supplier)
   - Pricing section (purchase price, selling price, profit margin)
   - Inventory section (stock, threshold, type)
   - **Product Variants** section (empty or with existing variants)

**Verification Points:**

- [ ] URL changes to `/products/{id}`
- [ ] "Back to Products" button works
- [ ] All product information displays correctly
- [ ] Product status badge shows (Active/Inactive)

---

### **Test 2: Create Product Variant**

**Steps:**

1. From product detail page, click **Add Variant** button
2. Fill in the form:
   - **Variant Name:** "Small" or "Large" or "Red"
   - **SKU:** "PROD-001-SM" (unique)
   - **Barcode:** "1234567890" (optional)
   - **Purchase Price:** 10.00
   - **Selling Price:** 15.00
   - **Stock Quantity:** 50
   - ✅ Keep "Active" checked
3. ✅ **Observe:** Profit margin calculation appears (33.33% = $5.00)
4. Click **Create Variant**

**Expected Results:**

- [ ] Success toast: "Variant created successfully"
- [ ] Modal closes
- [ ] New variant appears in the variants table
- [ ] Variant shows: Name, SKU, Barcode, Prices, Stock, Status
- [ ] Summary shows: "1 variant • 1 active"
- [ ] Total Stock displays correctly

**Error Cases to Test:**

- [ ] Empty variant name → "Variant name is required"
- [ ] Empty SKU → "SKU is required"
- [ ] Invalid price → "Valid selling price is required"

---

### **Test 3: Edit Product Variant**

**Steps:**

1. Click **Edit** button on an existing variant
2. Change values:
   - Variant Name: "Small Updated"
   - Selling Price: 18.00
3. Click **Update Variant**

**Expected Results:**

- [ ] Success toast: "Variant updated successfully"
- [ ] Variant row updates with new values
- [ ] Profit margin recalculates automatically

---

### **Test 4: Delete Product Variant**

**Steps:**

1. Click **Delete** button on a variant
2. Confirm deletion

**Expected Results:**

- [ ] Success toast: "Variant deleted successfully"
- [ ] Variant removed from table
- [ ] Variant count updates
- [ ] Total stock recalculates

---

### **Test 5: Excel Export**

**Steps:**

1. Go to **Products** page
2. Click **Export** dropdown button
3. Select **📊 Export as Excel**

**Expected Results:**

- [ ] Success toast: "Products exported to Excel successfully"
- [ ] File downloads: `products_export_YYYY-MM-DD.xlsx`
- [ ] Open file in Excel:
  - [ ] Headers: Name, SKU, Barcode, Category, Supplier, etc.
  - [ ] All products listed with correct data
  - [ ] Pricing and stock information accurate

---

### **Test 6: Excel Import Template Download**

**Steps:**

1. Click **Import** dropdown
2. Select **📊 Import from Excel**
3. In the dialog, click **Download Excel Template**

**Expected Results:**

- [ ] Success toast: "Template downloaded successfully"
- [ ] File downloads: `product_import_template.xlsx`
- [ ] Template has:
  - [ ] Column headers with proper names
  - [ ] Sample data row (optional)
  - [ ] Instructions/notes

---

### **Test 7: Excel Import - Valid Data**

**Steps:**

1. Open the template in Excel
2. Add test products:
   ```
   Name: Test Product 1
   SKU: TEST-001
   Barcode: 9999999999
   CategoryId: 1
   SupplierId: 1
   PurchasePrice: 10
   SellingPrice: 15
   StockQuantity: 100
   LowStockThreshold: 10
   IsActive: TRUE
   ```
3. Save the file
4. In import dialog, select the file
5. Click **Import Products**

**Expected Results:**

- [ ] Import results show:
  - [ ] "Successfully imported 1 product(s)"
  - [ ] Imported: 1
  - [ ] Duplicates: 0
  - [ ] Invalid: 0
- [ ] Products page refreshes
- [ ] New product appears in the table

---

### **Test 8: Excel Import - Error Handling**

**Steps:**

1. Create Excel file with invalid data:
   - Missing required fields (Name, SKU)
   - Invalid CategoryId (9999)
   - Negative prices
   - Duplicate SKU
2. Import the file

**Expected Results:**

- [ ] Import results show error counts
- [ ] Click "Show error details"
- [ ] See specific errors for each row:
  - [ ] "Row 2: Name is required"
  - [ ] "Row 3: Invalid CategoryId"
  - [ ] "Row 4: Selling price must be positive"
  - [ ] "Row 5: SKU already exists"
- [ ] No invalid products imported
- [ ] Valid products (if any) imported successfully

---

## 🛒 **Option 2: Advanced POS Features**

### **Test 9: Quick Sale Buttons**

**Steps:**

1. Navigate to **POS** page
2. ✅ **Observe:** Quick Sale buttons appear above product grid
3. Click any quick sale button

**Expected Results:**

- [ ] Quick sale buttons display in colored grid (2-4 columns)
- [ ] Each button shows product name and price
- [ ] Clicking button adds product to cart
- [ ] Success toast: "Added [Product Name] to cart"
- [ ] Cart updates with quantity 1

**Edge Cases:**

- [ ] If no quick items configured → Shows "No quick sale items configured"
- [ ] Inactive buttons don't appear

---

### **Test 10: Park Sale**

**Steps:**

1. Add 2-3 items to cart (use barcode scanner or product grid)
2. Select a customer (optional)
3. Click **🅿️ Park Sale** button
4. In dialog:
   - Review items list
   - Review totals (Subtotal, Tax, Total)
   - Add notes: "Customer will return in 30 mins"
5. Click **Park Sale**

**Expected Results:**

- [ ] Success toast: "Sale parked successfully"
- [ ] Dialog closes
- [ ] Cart clears
- [ ] Customer info clears
- [ ] Sale saved to database

**Verification:**

- [ ] Dialog shows correct item count
- [ ] Totals calculate correctly
- [ ] Notes field accepts text
- [ ] Expiry notice shows "7 days"

---

### **Test 11: View Parked Sales List**

**Steps:**

1. With some parked sales, click **📋 Parked** button
2. ✅ **Observe:** Parked Sales List modal opens

**Expected Results:**

- [ ] Modal shows title "Parked Sales"
- [ ] List displays all parked sales with:
  - [ ] Sale ID
  - [ ] Customer name (if set)
  - [ ] Item count
  - [ ] Total amount
  - [ ] Parked date/time
  - [ ] Expiry countdown (e.g., "6d 23h")
- [ ] Each sale has **Resume** and **Delete** buttons
- [ ] Empty state shows if no parked sales

**Status Indicators:**

- [ ] Active sales: White background, blue total
- [ ] Expired sales: Red background, "Expired" badge

---

### **Test 12: Resume Parked Sale**

**Steps:**

1. Open parked sales list
2. Click **Resume** on any active parked sale
3. ✅ **Observe:** Dialog closes

**Expected Results:**

- [ ] Success toast: "Parked sale resumed"
- [ ] Cart populates with all items from parked sale
- [ ] Quantities match
- [ ] Prices match
- [ ] Customer info restores (if was set)
- [ ] Can continue shopping or checkout

---

### **Test 13: Delete Parked Sale**

**Steps:**

1. Open parked sales list
2. Click **Delete** on a parked sale
3. Confirm deletion

**Expected Results:**

- [ ] Confirmation prompt appears
- [ ] After confirming: "Parked sale deleted"
- [ ] Sale removed from list
- [ ] List updates immediately

---

### **Test 14: Split Payment - Basic**

**Steps:**

1. Add items to cart (Total: $50.00)
2. Click **🔀 Split Payment** button
3. In dialog:
   - Payment 1: Cash - $30.00
   - Click **Add Another Payment Method**
   - Payment 2: Card - $20.00
4. ✅ **Observe:** Remaining amount shows $0.00 (green)
5. Click **Confirm Split Payment**

**Expected Results:**

- [ ] Dialog shows total amount prominently
- [ ] Can add up to 4 payment splits
- [ ] Each split has method dropdown and amount input
- [ ] Remaining amount updates in real-time:
  - [ ] Positive (orange) = "left"
  - [ ] Zero (green) = balanced
  - [ ] Negative (red) = "over"
- [ ] Confirm button only enabled when balanced
- [ ] Success toast: "Sale completed! Receipt ID: XXX"
- [ ] Cart clears after successful payment

---

### **Test 15: Split Payment - Validation**

**Test Case A: Insufficient Payment**

1. Total: $50.00
2. Add only Cash: $30.00
3. Try to confirm

**Expected:**

- [ ] Error toast: "Insufficient payment: $20.00 remaining"
- [ ] Confirm button disabled

**Test Case B: Overpayment**

1. Total: $50.00
2. Add Cash: $30.00 + Card: $25.00
3. Try to confirm

**Expected:**

- [ ] Error toast: "Overpayment: $5.00 excess"

**Test Case C: Duplicate Methods**

1. Add Cash: $25.00
2. Add another Cash: $25.00
3. Try to confirm

**Expected:**

- [ ] Error toast: "Duplicate payment methods not allowed"

**Test Case D: Zero Amount**

1. Add Cash: $0.00
2. Try to confirm

**Expected:**

- [ ] Error toast: "All payment amounts must be greater than zero"

---

### **Test 16: Split Payment - Remove Split**

**Steps:**

1. Add 3 payment splits
2. Click delete (🗑️) button on middle split

**Expected Results:**

- [ ] Split removed
- [ ] Remaining splits re-number automatically
- [ ] Total recalculates
- [ ] Can't remove last split (error: "At least one payment method is required")

---

### **Test 17: Cart Actions - All Buttons**

**Steps:**

1. Add items to cart
2. Verify all buttons present:
   - **💳 Process Payment** (green)
   - **🔀 Split Payment** (blue)
   - **🅿️ Park Sale** (yellow)
   - **📋 Parked** (gray)
   - **🗑️ Clear Cart** (gray)

**Expected Results:**

- [ ] All buttons visible
- [ ] Buttons disabled when cart empty (except Parked)
- [ ] Button tooltips/labels clear
- [ ] Click each button opens correct dialog

---

### **Test 18: End-to-End Flow**

**Complete POS Workflow:**

1. **Start Fresh**

   - [ ] Login to POS
   - [ ] Cart is empty

2. **Add Items**

   - [ ] Scan barcode: "1234567890"
   - [ ] Click product from grid
   - [ ] Use quick sale button
   - [ ] Verify cart shows 3+ items

3. **Add Customer**

   - [ ] Enter phone number
   - [ ] Click search
   - [ ] Customer info displays

4. **Park the Sale**

   - [ ] Click Park Sale
   - [ ] Add notes
   - [ ] Confirm
   - [ ] Verify cart clears

5. **Resume Sale**

   - [ ] Click Parked button
   - [ ] Find parked sale
   - [ ] Click Resume
   - [ ] Verify cart restores

6. **Complete with Split Payment**

   - [ ] Click Split Payment
   - [ ] Add Cash: $30
   - [ ] Add Card: $20
   - [ ] Confirm
   - [ ] Verify sale completes

7. **Verify**
   - [ ] Go to Sales page
   - [ ] Find completed sale
   - [ ] Check payment shows "MIXED"
   - [ ] Check customer linked

---

## 🐛 **Known Issues / Limitations**

### **Option 1:**

- ⚠️ Product variant lookup by SKU/barcode not yet integrated into POS scanner
- ⚠️ Variant images not yet supported

### **Option 2:**

- ⚠️ Quick sale item configuration UI is placeholder (add via database)
- ⚠️ Parked sales don't delete automatically after expiry (manual deletion required)
- ⚠️ Split payment splits not stored separately in database (saved as MIXED)

---

## ✅ **Success Criteria**

**Option 1 passes if:**

- [ ] All 8 product variant tests pass
- [ ] Excel import/export works with valid data
- [ ] Error handling prevents invalid imports
- [ ] Product detail page navigates correctly

**Option 2 passes if:**

- [ ] All 10 POS feature tests pass
- [ ] Quick sale buttons add to cart
- [ ] Park/resume workflow completes
- [ ] Split payment validates and processes
- [ ] End-to-end flow completes successfully

---

## 🔧 **Troubleshooting**

### **Issue: Components not loading**

- **Solution:** Hard refresh browser (Ctrl+Shift+R)
- Check console for errors (F12)

### **Issue: API calls failing**

- **Solution:** Verify backend running on port 5000
- Check network tab in DevTools
- Check backend console for errors

### **Issue: Import fails with valid data**

- **Solution:** Check CategoryId and SupplierId exist in database
- Verify column names match exactly (case-sensitive)

### **Issue: Parked sales not appearing**

- **Solution:** Check database: `SELECT * FROM ParkedSale`
- Verify employee ID matches logged-in user

### **Issue: Split payment total mismatch**

- **Solution:** Clear browser cache
- Check for rounding errors (use 2 decimal places)

---

## 📊 **Test Results Template**

```
Test Date: __________
Tester: __________

Option 1 - Product Variants:
✅/❌ Test 1: View Product Details
✅/❌ Test 2: Create Variant
✅/❌ Test 3: Edit Variant
✅/❌ Test 4: Delete Variant
✅/❌ Test 5: Excel Export
✅/❌ Test 6: Template Download
✅/❌ Test 7: Valid Import
✅/❌ Test 8: Error Handling

Option 2 - POS Features:
✅/❌ Test 9: Quick Sale Buttons
✅/❌ Test 10: Park Sale
✅/❌ Test 11: View Parked List
✅/❌ Test 12: Resume Parked
✅/❌ Test 13: Delete Parked
✅/❌ Test 14: Split Payment Basic
✅/❌ Test 15: Split Validation
✅/❌ Test 16: Remove Split
✅/❌ Test 17: Cart Actions
✅/❌ Test 18: End-to-End Flow

Overall Status: ✅ PASS / ❌ FAIL
Notes: ___________________
```

---

## 🎯 **Next Steps After Testing**

1. **If all tests pass:**

   - ✅ Mark Options 1 & 2 as production-ready
   - Move to Option 3: Loyalty Program Dashboard

2. **If issues found:**

   - Document each issue with steps to reproduce
   - Prioritize: Critical → High → Medium → Low
   - Fix critical bugs before proceeding

3. **Performance Testing:**
   - Test with 100+ products
   - Test with 50+ variants per product
   - Test with 20+ parked sales
   - Monitor response times

---

**Happy Testing! 🎉**
