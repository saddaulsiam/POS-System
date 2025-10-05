# Quick Sale Items Troubleshooting Guide

## Issue: QuickSaleButtons not working

### ✅ What We've Verified

1. **Database Check** ✅

   - Quick Sale Items exist: 3 items found
   - All items are active
   - Products are linked correctly

2. **Backend Route** ✅

   - Route exists: `/api/quick-sale-items`
   - File: `backend/src/routes/quickSaleItems.js`
   - Registered in `backend/src/index.js`

3. **Frontend Component** ✅

   - Component exists: `QuickSaleButtons.tsx`
   - No TypeScript errors
   - API service configured: `quickSaleItemsAPI`

4. **Proxy Configuration** ✅
   - Vite proxy set to forward `/api` → `http://localhost:5000`

---

## 🔧 Potential Issues & Solutions

### Issue 1: Frontend Not Loading Items

**Symptoms:**

- Component shows "Loading..." forever
- Component shows empty state despite items in database
- No items appearing in POS

**Solution 1: Check Authentication**

```
The API route requires authentication. Make sure you're logged in!
```

**Steps:**

1. Open http://localhost:3002
2. Check if you're logged in
3. Open browser DevTools (F12)
4. Go to Console tab
5. Look for errors related to quick-sale-items

**Solution 2: Check Network Tab**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the POS page
4. Look for request to `/api/quick-sale-items`
5. Check response:
   - Status 200 = Success
   - Status 401 = Not authenticated
   - Status 500 = Server error

**Solution 3: Check Backend Server**

```bash
# Make sure backend is running on port 5000
cd backend
npm run dev
```

---

## 🧪 Quick Test Steps

### Step 1: Test Backend API Directly

Open a new PowerShell terminal and run:

```powershell
# Get authentication token first
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{
    username = "admin"
    password = "your_password_here"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.token

# Test Quick Sale Items API
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/quick-sale-items" -Method GET -Headers $headers
```

Expected result: Should return 3 items

### Step 2: Test Frontend

1. Open http://localhost:3002
2. Login with admin credentials
3. Go to POS page
4. Scroll to "Quick Sale" section
5. You should see 3 colored buttons:
   - 🔵 Blue button: "Whole Milk (1 Gallon)"
   - 🟢 Green button: "Large Eggs (Dozen)"
   - 🟡 Orange button: "Cheddar Cheese (8oz)"

---

## 🎯 Quick Fix Commands

### Option 1: Restart Everything

```powershell
# Stop all terminals, then:

# Terminal 1 - Backend
cd "E:\All Project\POS-System\backend"
npm run dev

# Terminal 2 - Frontend
cd "E:\All Project\POS-System\frontend"
yarn dev
```

### Option 2: Clear Browser Cache

1. Open browser DevTools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Check If Items Are Being Returned

```bash
cd "E:\All Project\POS-System\backend"
node src/scripts/checkQuickSaleItems.js
```

---

## 🔍 Debugging Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3002
- [ ] You are logged in as admin or cashier
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Quick Sale Items exist in database (run check script)
- [ ] Items have `isActive: true`

---

## 📊 Current Database State

```
Quick Sale Items: 3
1. Whole Milk (1 Gallon) - Blue (#3B82F6)
2. Large Eggs (Dozen) - Green (#10B981)
3. Cheddar Cheese (8oz) - Orange (#F59E0B)
```

---

## 🚀 Expected Behavior

When everything is working:

1. **POS Page Loads**

   - Quick Sale section appears below search bar
   - "Quick Sale" heading with settings icon

2. **Items Display**

   - Grid of colored buttons (2-4 columns)
   - Each button shows:
     - Product name
     - Price
     - Colored background

3. **Clicking a Button**
   - Product added to cart
   - Toast notification: "Added [Product] to cart"
   - Cart updates with item

---

## 🐛 Common Errors & Fixes

### Error: "Failed to load quick sale items"

**Cause:** Backend not running or API error

**Fix:**

```bash
cd backend
npm run dev
```

### Error: "401 Unauthorized"

**Cause:** Not logged in or token expired

**Fix:**

1. Logout
2. Login again
3. Navigate to POS

### Error: Shows empty state despite items existing

**Cause:** Items might have `isActive: false`

**Fix:**

```bash
cd backend
node src/scripts/checkQuickSaleItems.js
# Check if items are active
```

---

## 📝 Manual Test Script

If automated tests fail, manually verify:

1. ✅ Database has items:

   ```bash
   node src/scripts/checkQuickSaleItems.js
   ```

2. ✅ Backend returns items:

   ```bash
   # Use Postman or curl to test:
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/quick-sale-items
   ```

3. ✅ Frontend makes request:

   - Open DevTools → Network
   - Look for "quick-sale-items" request
   - Check status and response

4. ✅ Component renders:
   - Check React DevTools
   - Find QuickSaleButtons component
   - Inspect props and state

---

## 💡 If Still Not Working

1. **Check Console Logs**

   ```
   Browser DevTools → Console
   Look for API request logs (we added console.log in api.ts)
   ```

2. **Check Backend Logs**

   ```
   Look at terminal running backend
   Should see GET /api/quick-sale-items requests
   ```

3. **Verify Products Still Exist**

   ```bash
   cd backend
   npx prisma studio
   # Check QuickSaleItem table
   # Verify products are not deleted
   ```

4. **Re-create Items**
   ```bash
   # Delete all quick sale items
   # Run check script again to create fresh samples
   node src/scripts/checkQuickSaleItems.js
   ```

---

## 🎯 Next Steps

1. Open http://localhost:3002
2. Login
3. Go to POS page
4. Look at Quick Sale section
5. If you see 3 colored buttons → ✅ Working!
6. If you see empty state → Check above troubleshooting

---

**Last Updated:** October 4, 2025 **Status:** Items exist in database, component configured correctly **Action
Required:** Verify frontend can fetch items via API
