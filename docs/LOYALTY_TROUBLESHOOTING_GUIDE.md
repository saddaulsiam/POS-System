# Loyalty Program Management - Troubleshooting Guide

## 🔍 Quick Diagnosis

If the Loyalty Program Management page is not working properly, follow these steps:

### Step 1: Run the Diagnostic Tool

```bash
cd backend
node src/scripts/diagnoseLoyalty.js
```

This will check:

- ✅ Database tier configuration
- ✅ Customer data
- ✅ Points transactions
- ✅ Loyalty offers
- ✅ Loyalty rewards
- ✅ Statistics calculations

### Step 2: Check Backend Server

Ensure the backend server is running:

```bash
cd backend
npm run dev
```

Server should be running on `http://localhost:5000`

### Step 3: Test API Endpoints

```bash
# Test tier configuration endpoint
curl http://localhost:5000/api/loyalty/tiers

# Should return JSON array with 4 tiers
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot load loyalty data" / Blank Statistics

**Symptoms:**

- Loyalty Admin page shows loading spinner indefinitely
- Statistics show 0 for all values
- Console errors about undefined properties

**Causes:**

1. Backend server not running
2. Statistics endpoint returning incorrect data format
3. Database has no tier configuration

**Solutions:**

**A. Check Backend Server**

```bash
# Windows PowerShell
Get-Process -Name node
# Should show node processes running

# If not running:
cd backend
npm run dev
```

**B. Verify Database Has Tiers**

```bash
cd backend
node src/scripts/diagnoseLoyalty.js
```

If no tiers found:

```bash
node src/scripts/seedLoyaltyTiers.js
```

**C. Test Statistics Endpoint**

```bash
# Get an admin token from browser localStorage
# Then test:
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/loyalty/statistics
```

Expected response:

```json
{
  "customersByTier": {
    "BRONZE": 2,
    "SILVER": 1,
    "GOLD": 0,
    "PLATINUM": 0
  },
  "pointsIssued": 500,
  "pointsRedeemed": 100,
  "activeOffers": 0,
  "recentRedemptions": [],
  "topCustomers": []
}
```

**D. Fixed: Statistics Endpoint Bug** The `customersByTier` groupBy was returning incorrect format. This has been fixed
in the latest version. If you still see issues, ensure your `loyalty.js` file has this code:

```javascript
// Format customers by tier correctly
const tierDistribution = {};
const allTiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

// Initialize all tiers with 0
allTiers.forEach((tier) => {
  tierDistribution[tier] = 0;
});

// Fill in actual counts
customersByTier.forEach((item) => {
  tierDistribution[item.loyaltyTier] = item._count.loyaltyTier || item._count._all || 0;
});
```

---

### Issue 2: 401 Unauthorized Errors

**Symptoms:**

- API calls return 401 Unauthorized
- User can access page but data doesn't load
- Console shows authentication errors

**Causes:**

1. User not logged in
2. User doesn't have ADMIN or MANAGER role
3. Token expired

**Solutions:**

**A. Check User Login**

```javascript
// In browser console:
localStorage.getItem("token");
localStorage.getItem("user");
```

If null, login again.

**B. Verify User Role**

```javascript
// In browser console:
JSON.parse(localStorage.getItem("user")).role;
// Should be 'ADMIN' or 'MANAGER'
```

**C. Re-login**

- Logout and login again to refresh token
- Ensure you're using an admin account

---

### Issue 3: Tier Configuration Not Saving

**Symptoms:**

- Click "Save Changes" on tier edit
- Success message appears
- But values revert to original

**Causes:**

1. Validation errors on backend
2. Tier config not in database
3. Permission issues

**Solutions:**

**A. Check Backend Logs** Look for validation errors when saving:

```bash
# Backend terminal should show:
Update tier config error: <error details>
```

**B. Verify Tier Exists in Database**

```bash
cd backend
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.loyaltyTierConfig.findMany().then(console.log).finally(() => prisma.\$disconnect());"
```

**C. Check Request Payload** Open browser DevTools → Network tab → Find the POST request to `/api/loyalty/tiers/config`

Payload should match:

```json
{
  "tier": "BRONZE",
  "minimumPoints": 0,
  "pointsMultiplier": 1.0,
  "discountPercentage": 0,
  "birthdayBonus": 50,
  "description": "Entry level tier"
}
```

**D. Validation Requirements**

- `tier`: Must be BRONZE, SILVER, GOLD, or PLATINUM
- `minimumPoints`: Must be ≥ 0
- `pointsMultiplier`: Must be ≥ 1.0
- `discountPercentage`: Must be 0-100
- `birthdayBonus`: Must be ≥ 0

---

### Issue 4: Special Offers Not Appearing

**Symptoms:**

- Offers tab shows "No active offers"
- Created offers don't appear in list
- Offers exist in database but don't show

**Causes:**

1. All offers are inactive
2. Offer dates are in the past
3. Frontend filtering issue

**Solutions:**

**A. Check Database**

```bash
cd backend
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.loyaltyOffer.findMany().then(console.log).finally(() => prisma.\$disconnect());"
```

**B. Verify Offer Dates**

- `startDate` should be ≤ current date
- `endDate` should be ≥ current date
- `isActive` should be true

**C. Check Frontend Filter** The frontend fetches ALL offers (no filtering). The issue might be with date display. Check
browser console for errors.

**D. Test Offer Creation**

```bash
# Use the test script:
cd backend
node src/scripts/testLoyaltyEndpoints.js YOUR_ADMIN_TOKEN
```

---

### Issue 5: "Cannot Create Offer" Error

**Symptoms:**

- Click "Create Offer" button
- Fill in form
- Error message appears

**Causes:**

1. Validation errors
2. Missing required fields
3. Invalid date format

**Solutions:**

**A. Required Fields**

- Title (required)
- Description (required)
- Offer Type (required)
- Start Date (required)
- End Date (required)

**B. Valid Offer Types**

- DISCOUNT_PERCENTAGE
- DISCOUNT_FIXED
- BUY_X_GET_Y
- POINTS_MULTIPLIER

**C. Date Format** Dates must be ISO 8601 format: `2025-10-04T00:00:00.000Z`

**D. Check Network Tab**

- Open DevTools → Network
- Find POST request to `/api/loyalty/offers`
- Check Response tab for detailed error message

---

### Issue 6: Points Not Calculating Correctly

**Symptoms:**

- Customer makes purchase
- Points awarded don't match expected amount
- Tier multiplier not being applied

**Causes:**

1. Incorrect tier multiplier in database
2. Points calculation logic issue
3. Customer tier not updated

**Solutions:**

**A. Verify Tier Multipliers**

```bash
cd backend
node src/scripts/diagnoseLoyalty.js
```

Should show:

- BRONZE: 1.0x
- SILVER: 1.25x
- GOLD: 1.5x
- PLATINUM: 2.0x

**B. Points Calculation Formula**

```javascript
basePoints = Math.floor(purchaseAmount / 10);
bonusPoints = Math.floor(basePoints * (tierMultiplier - 1));
totalPoints = basePoints + bonusPoints;
```

Example: $100 purchase, GOLD tier (1.5x)

- Base: 10 points
- Bonus: 10 × (1.5 - 1) = 5 points
- Total: 15 points

**C. Check Customer Tier** Ensure customer's `loyaltyTier` field matches their actual lifetime points.

**D. Manual Points Adjustment** If needed, admin can manually adjust points in database.

---

### Issue 7: Tier Not Auto-Upgrading

**Symptoms:**

- Customer reaches tier threshold
- Tier doesn't upgrade automatically
- Still shows old tier

**Causes:**

1. Tier upgrade logic not running
2. Lifetime points not calculated correctly
3. Threshold values incorrect

**Solutions:**

**A. Tier Thresholds**

```
BRONZE:   0+ points
SILVER:   500+ points
GOLD:     1,500+ points
PLATINUM: 3,000+ points
```

Based on **lifetime earned points**, not current balance.

**B. Check Upgrade Logic** The tier upgrade should happen in `/api/loyalty/award-points` endpoint after awarding points.

**C. Verify Lifetime Points**

```javascript
// Lifetime points = sum of all EARNED transactions
SELECT SUM(points) FROM PointsTransaction
WHERE customerId = X AND type = 'EARNED'
```

**D. Manual Tier Update** Admin can manually update tier:

```
PUT /api/loyalty/customers/:customerId/tier
Body: { "tier": "GOLD" }
```

---

### Issue 8: Birthday Rewards Not Working

**Symptoms:**

- Customer birthday passes
- No bonus points awarded
- No transaction created

**Causes:**

1. Cron job not running
2. Customer birthday not set in database
3. Birthday already awarded this year

**Solutions:**

**A. Set Up Cron Job**

```bash
# Linux/Mac - Add to crontab:
0 6 * * * curl -X POST http://localhost:5000/api/loyalty/birthday-rewards

# Windows - Use Task Scheduler or run manually
```

**B. Manual Trigger**

```bash
curl -X POST http://localhost:5000/api/loyalty/birthday-rewards
```

**C. Check Customer Birthday**

```javascript
// Verify dateOfBirth is set:
SELECT id, name, dateOfBirth FROM Customer WHERE id = X
```

**D. Check Transaction History** Look for existing BIRTHDAY_BONUS transaction for current year.

---

## 🔧 Developer Debugging Tools

### Database Inspection

**View all tier configurations:**

```sql
SELECT * FROM LoyaltyTierConfig ORDER BY minimumPoints;
```

**View customers by tier:**

```sql
SELECT loyaltyTier, COUNT(*) as count
FROM Customer
WHERE isActive = 1
GROUP BY loyaltyTier;
```

**View recent points transactions:**

```sql
SELECT
  c.name,
  pt.type,
  pt.points,
  pt.description,
  pt.createdAt
FROM PointsTransaction pt
JOIN Customer c ON c.id = pt.customerId
ORDER BY pt.createdAt DESC
LIMIT 10;
```

**View active offers:**

```sql
SELECT * FROM LoyaltyOffer
WHERE isActive = 1
AND startDate <= datetime('now')
AND endDate >= datetime('now');
```

### API Testing

Use the provided test script:

```bash
cd backend

# Without auth (public endpoints):
node src/scripts/testLoyaltyEndpoints.js

# With auth (all endpoints):
node src/scripts/testLoyaltyEndpoints.js YOUR_ADMIN_TOKEN
```

### Frontend Debugging

**Check API calls in browser console:**

```javascript
// Test tier config fetch:
fetch("http://localhost:5000/api/loyalty/tiers", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((r) => r.json())
  .then(console.log);

// Test statistics fetch:
fetch("http://localhost:5000/api/loyalty/statistics", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 📊 Health Check Checklist

Run through this checklist to verify everything is working:

### Backend

- [ ] Backend server running on port 5000
- [ ] Database has 4 tier configurations
- [ ] GET `/api/loyalty/tiers` returns tier array
- [ ] GET `/api/loyalty/offers` returns offers array
- [ ] GET `/api/loyalty/statistics` returns statistics (with auth)

### Database

- [ ] LoyaltyTierConfig table has 4 rows
- [ ] Customer table has loyaltyPoints and loyaltyTier columns
- [ ] PointsTransaction table exists and has records
- [ ] LoyaltyOffer table exists
- [ ] LoyaltyReward table exists

### Frontend

- [ ] Loyalty admin link appears in sidebar (for admin/manager)
- [ ] /loyalty-admin route exists in App.tsx
- [ ] LoyaltyAdminPage component imported
- [ ] All API methods exist in services/api.ts
- [ ] No TypeScript compilation errors

### Functionality

- [ ] Overview tab loads statistics
- [ ] Tier cards display correctly
- [ ] Can edit tier configuration
- [ ] Offers tab displays existing offers
- [ ] Can create new offers
- [ ] Can edit existing offers
- [ ] Can delete offers
- [ ] Top customers list displays

---

## 🆘 Still Having Issues?

If you've tried all the above and still experiencing problems:

### 1. Check Full Error Stack

**Backend:**

```bash
# Run backend in debug mode:
cd backend
DEBUG=* npm run dev
```

**Frontend:**

```bash
# Check browser console for errors
# Check Network tab for failed requests
# Look for CORS errors
```

### 2. Restart Everything

```bash
# Stop all processes
# Ctrl+C in all terminals

# Restart backend:
cd backend
npm run dev

# Restart frontend:
cd frontend
npm run dev
```

### 3. Clear Cache & Rebuild

```bash
# Frontend:
cd frontend
rm -rf node_modules dist
npm install
npm run build

# Backend:
cd backend
rm -rf node_modules
npm install
```

### 4. Check Dependencies

```bash
# Backend:
cd backend
npm list @prisma/client express express-validator

# Frontend:
cd frontend
npm list react react-router-dom lucide-react
```

### 5. Verify Environment

**Backend `.env`:**

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key"
PORT=5000
```

**Frontend (vite.config.ts):**

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 📞 Getting More Help

### Log Files to Check:

- Backend console output
- Browser DevTools console
- Network tab (failed requests)
- Browser localStorage (token, user)

### Information to Provide:

1. Exact error message
2. Steps to reproduce
3. Backend/frontend versions
4. Database diagnostic output
5. Network tab screenshot

### Useful Commands:

```bash
# Get system info:
node --version
npm --version

# Check running processes:
netstat -ano | findstr :5000  # Windows
lsof -i :5000                # Linux/Mac

# Database check:
cd backend
npx prisma studio
# Opens database viewer at http://localhost:5555
```

---

## ✅ Resolved Issues Log

### Issue: Statistics customersByTier returning wrong format

**Date:** 2025-10-04 **Symptoms:** TypeError when accessing `stats.customersByTier[tier]` **Cause:** Prisma `groupBy`
returns `_count` object, not plain number **Fix:** Updated statistics endpoint to properly format tier distribution
**Status:** ✅ FIXED

### Issue: No tiers in database after first setup

**Date:** 2025-10-04 **Symptoms:** Empty tier configuration array **Cause:** Seed script not run after setup **Fix:**
Added seed script to setup documentation **Status:** ✅ FIXED (documented)

---

**Last Updated:** October 4, 2025 **Version:** 1.1
