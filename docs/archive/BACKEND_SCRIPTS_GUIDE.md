# Backend Scripts - Complete Reference Guide

**Location:** `backend/src/scripts/`  
**Last Updated:** October 4, 2025  
**Status:** ✅ All scripts working and up-to-date

---

## 📋 Scripts Overview

| Script                    | Purpose                     | Auth Required | Status     |
| ------------------------- | --------------------------- | ------------- | ---------- |
| `seed.js`                 | Initial database seeding    | No            | ✅ Working |
| `seedLoyaltyTiers.js`     | Initialize loyalty tiers    | No            | ✅ Working |
| `diagnoseLoyalty.js`      | Diagnose loyalty system     | No            | ✅ Working |
| `testLoyalty.js`          | Quick loyalty health check  | No            | ✅ Working |
| `testLoyaltyEndpoints.js` | API endpoint tester         | Optional      | ✅ Working |
| `checkEmployees.js`       | List all employees & roles  | No            | ✅ Working |
| `makeAdmin.js`            | Promote user to ADMIN       | No            | ✅ Working |
| `fixMyPermissions.js`     | Quick fix for specific user | No            | ✅ Working |
| `debugToken.js`           | Decode and verify JWT       | No            | ✅ Working |

---

## 🔧 Script Details

### 1. `seed.js` - Main Database Seeder

**Purpose:** Initialize the database with sample data for all modules

**What it seeds:**

- ✅ Categories (5 default categories)
- ✅ Suppliers (3 sample suppliers)
- ✅ Products (20+ sample products)
- ✅ Customers (10 sample customers)
- ✅ Employees (5 employees with different roles)
- ✅ Sales transactions
- ✅ Loyalty tier configuration

**Usage:**

```bash
cd backend
node src/scripts/seed.js
```

**Output:**

```
🌱 Starting database seeding...
✅ Created 5 categories
✅ Created 3 suppliers
✅ Created 20 products
✅ Created 10 customers
✅ Created 5 employees
✅ Created sample sales
✅ Seeded loyalty tiers
🎉 Database seeded successfully!
```

**When to use:**

- Fresh database setup
- Development environment initialization
- After database reset
- Testing with sample data

**Note:** Safe to run multiple times (uses upsert for categories/suppliers)

---

### 2. `seedLoyaltyTiers.js` - Loyalty Tier Initializer

**Purpose:** Initialize or update the 4-tier loyalty configuration

**Tiers Created:**

```
🥉 BRONZE   - 0 pts,    1.0x multiplier,  0% discount,  50pt birthday
🥈 SILVER   - 500 pts,  1.25x multiplier, 5% discount,  100pt birthday
🥇 GOLD     - 1500 pts, 1.5x multiplier,  10% discount, 200pt birthday
💎 PLATINUM - 3000 pts, 2.0x multiplier,  15% discount, 500pt birthday
```

**Usage:**

```bash
cd backend
node src/scripts/seedLoyaltyTiers.js
```

**Output:**

```
🎁 Seeding loyalty tier configuration...
✅ BRONZE tier configured
✅ SILVER tier configured
✅ GOLD tier configured
✅ PLATINUM tier configured
🎉 All loyalty tiers configured successfully!
```

**When to use:**

- First time loyalty setup
- Reset tier configuration to defaults
- After loyalty migration
- Update tier settings in bulk

**Safe to run:** Yes, uses upsert (won't duplicate)

---

### 3. `diagnoseLoyalty.js` - Comprehensive Loyalty Diagnostic

**Purpose:** Full health check of the loyalty system

**What it checks:**

- ✅ Database connection
- ✅ Loyalty tier configuration (should be 4 tiers)
- ✅ Customers with loyalty points
- ✅ Points transactions (recent activity)
- ✅ Active loyalty offers
- ✅ Unredeemed rewards
- ✅ Customer tier distribution

**Usage:**

```bash
cd backend
node src/scripts/diagnoseLoyalty.js
```

**Sample Output:**

```
🔍 Loyalty System Diagnostic Report
═══════════════════════════════════════

📊 Database Connection: ✅ Connected

1️⃣ Loyalty Tier Configuration
   ✅ Found 4 tiers
   🥉 BRONZE: 0 pts, 1.0x multiplier
   🥈 SILVER: 500 pts, 1.25x multiplier
   🥇 GOLD: 1500 pts, 1.5x multiplier
   💎 PLATINUM: 3000 pts, 2.0x multiplier

2️⃣ Customers with Loyalty Points
   ✅ Found 15 customers
   - John Doe: 1250 pts (SILVER)
   - Jane Smith: 2800 pts (GOLD)
   ...

3️⃣ Points Transactions
   ✅ Found 45 transactions
   Recent:
   - John Doe: +50 pts (EARNED on 2025-10-04)
   - Jane Smith: -200 pts (REDEEMED on 2025-10-03)
   ...

4️⃣ Active Loyalty Offers
   ✅ Found 2 active offers
   - Weekend Special (20% off)
   - Gold Member Bonus (2x points)

5️⃣ Unredeemed Rewards
   ✅ Found 8 active rewards
   Total value: $125.00

═══════════════════════════════════════
🎉 Diagnostic complete!
```

**When to use:**

- Troubleshooting loyalty issues
- Verifying data integrity
- Before/after migrations
- Regular health checks
- Debugging customer complaints

**Perfect for:** Finding data issues, missing configurations, or system problems

---

### 4. `testLoyalty.js` - Quick Loyalty Test

**Purpose:** Fast sanity check of loyalty system

**What it tests:**

- ✅ Tier configuration exists
- ✅ Customers with points exist
- ✅ Recent transactions recorded
- ✅ Loyalty offers exist
- ✅ Active rewards exist

**Usage:**

```bash
cd backend
node src/scripts/testLoyalty.js
```

**Output:**

```
🔍 Testing Loyalty System...

1️⃣ Checking Loyalty Tier Configuration...
   Found 4 tiers in database
   - BRONZE: 0 pts, 1.0x multiplier
   - SILVER: 500 pts, 1.25x multiplier
   - GOLD: 1500 pts, 1.5x multiplier
   - PLATINUM: 3000 pts, 2.0x multiplier

2️⃣ Checking Customers...
   Found 5 customers with loyalty points
   - John Doe: 1250 pts (SILVER)
   - Jane Smith: 2800 pts (GOLD)

3️⃣ Checking Points Transactions...
   Found 5 recent transactions
   - John Doe: 50 pts (EARNED)
   - Jane Smith: -200 pts (REDEEMED)

4️⃣ Checking Loyalty Offers...
   Found 2 loyalty offers
   - 1 active offer

5️⃣ Checking Loyalty Rewards...
   Found 8 unredeemed rewards

✅ Loyalty system is working!
```

**When to use:**

- Quick health check
- After code changes
- Before deployment
- Daily monitoring

**Faster than:** diagnoseLoyalty.js (less detailed)

---

### 5. `testLoyaltyEndpoints.js` - API Endpoint Tester

**Purpose:** Test all loyalty API endpoints with real HTTP requests

**What it tests:**

**Public Endpoints (No auth):**

- ✅ GET /api/loyalty/tiers
- ✅ GET /api/loyalty/offers

**Authenticated Endpoints (Admin token required):**

- ✅ GET /api/loyalty/statistics
- ✅ POST /api/loyalty/offers (creates test offer)
- ✅ PUT /api/loyalty/offers/:id (updates test offer)
- ✅ DELETE /api/loyalty/offers/:id (deletes test offer)
- ✅ POST /api/loyalty/tiers/config
- ✅ GET /api/loyalty/customers/:id/loyalty-status
- ✅ POST /api/loyalty/award-points
- ✅ GET /api/loyalty/customers/:id/points-history

**Usage:**

**Without authentication (public endpoints only):**

```bash
cd backend
node src/scripts/testLoyaltyEndpoints.js
```

**With authentication (all endpoints):**

```bash
# First, get your admin token:
# 1. Login to frontend as admin
# 2. Open browser console
# 3. Run: localStorage.getItem('token')
# 4. Copy the token

node src/scripts/testLoyaltyEndpoints.js YOUR_ADMIN_TOKEN_HERE
```

**Sample Output:**

```
╔═══════════════════════════════════════════════════╗
║   LOYALTY API ENDPOINT TESTS                      ║
╚═══════════════════════════════════════════════════╝

🧪 Testing: Get Tier Configuration
   GET /api/loyalty/tiers
   ✅ Status: 200 (expected)
   📦 Response: [
     { "tier": "BRONZE", "minimumPoints": 0, ... },
     ...
   ]

🧪 Testing: Get All Loyalty Offers
   GET /api/loyalty/offers
   ✅ Status: 200 (expected)
   📦 Response: []

==================================================
AUTHENTICATED TESTS (Admin/Manager required)
==================================================

🧪 Testing: Get Loyalty Statistics
   GET /api/loyalty/statistics
   ✅ Status: 200 (expected)
   📦 Response: {
     "customersByTier": {
       "BRONZE": 5,
       "SILVER": 3,
       "GOLD": 2,
       "PLATINUM": 1
     },
     "totalPointsIssued": 12500,
     "totalPointsRedeemed": 3200,
     ...
   }

🧪 Testing: Create Loyalty Offer
   POST /api/loyalty/offers
   ✅ Status: 201 (expected)
   📦 Response: { "id": 1, "title": "Test Weekend Special", ... }

🧪 Testing: Update Loyalty Offer
   PUT /api/loyalty/offers/1
   ✅ Status: 200 (expected)

🧪 Testing: Delete Loyalty Offer
   DELETE /api/loyalty/offers/1
   ✅ Status: 200 (expected)

==================================================
TEST SUMMARY
==================================================
✅ Passed: 10
❌ Failed: 0
📊 Total:  10

🎉 All tests passed!
```

**When to use:**

- After fixing bugs (like we just did!)
- Before deployment
- API integration testing
- Verify authentication works
- Test CRUD operations
- Regression testing

**Perfect for:** Ensuring all endpoints work after code changes

---

### 6. `checkEmployees.js` - Employee Role Viewer

**Purpose:** List all employees with their roles and access permissions

**Usage:**

```bash
cd backend
node src/scripts/checkEmployees.js
```

**Output:**

```
👥 All Employees in Database

Total Employees: 5
Active Employees: 5

ID | Username      | Name              | Role    | Active | Can Access Loyalty Admin
---|---------------|-------------------|---------|--------|-------------------------
4  | admin         | Admin User        | ADMIN   | ✅     | ✅ YES
2  | manager       | Store Manager     | MANAGER | ✅     | ✅ YES
5  | saddaulsiam   | Saddaul Siam      | ADMIN   | ✅     | ✅ YES
1  | cashier2      | Cashier Two       | CASHIER | ✅     | ❌ NO
3  | cashier1      | Cashier One       | CASHIER | ✅     | ❌ NO

Legend:
✅ Can access loyalty admin panel (/loyalty-admin)
❌ Cannot access loyalty admin panel
```

**When to use:**

- Check who has admin access
- Verify role assignments
- Troubleshoot permission issues
- Audit user access levels
- Before promoting users

**Helpful for:** Answering "Why can't I access this feature?"

---

### 7. `makeAdmin.js` - User Role Promoter

**Purpose:** Promote any user to ADMIN role

**Features:**

- ✅ Interactive (lists all users if no username provided)
- ✅ Validates username exists
- ✅ Shows before/after role
- ✅ Confirms success

**Usage:**

**Interactive mode (choose from list):**

```bash
cd backend
node src/scripts/makeAdmin.js
```

**Direct mode (specify username):**

```bash
node src/scripts/makeAdmin.js saddaulsiam
```

**Output:**

```
👑 Make User Admin
═════════════════

Current role: STAFF
New role: ADMIN

⚠️  This will give saddaulsiam full admin access!

✅ SUCCESS!
   saddaulsiam is now ADMIN
   They can now:
   - Access admin panel
   - Manage loyalty program
   - Manage employees
   - View all reports
```

**When to use:**

- Promote new admin users
- Fix permission issues
- Grant temporary admin access
- Onboard new managers

**Important:** User must logout and login again to get new JWT token with updated role

---

### 8. `fixMyPermissions.js` - Quick Permission Fix

**Purpose:** One-click fix for specific user (originally for saddaulsiam)

**Usage:**

```bash
cd backend
node src/scripts/fixMyPermissions.js
```

**What it does:**

- Updates hardcoded user (saddaulsiam) to ADMIN role
- Quick fix without prompts
- Shows success/failure

**Output:**

```
🔧 Fixing permissions for saddaulsiam...

✅ SUCCESS!
   saddaulsiam is now ADMIN

⚠️  Remember to:
1. Logout from the application
2. Login again
3. Your new permissions will be active
```

**When to use:**

- Emergency fix for locked-out admin
- Quick testing
- Development environment

**Note:** Can be customized for other specific users if needed

---

### 9. `debugToken.js` - JWT Token Decoder

**Purpose:** Decode and verify JWT tokens from the application

**Features:**

- ✅ Decodes JWT payload
- ✅ Shows user ID, role, expiration
- ✅ Verifies against database
- ✅ Checks if expired
- ✅ Shows if role matches database

**Usage:**

```bash
# Get token from browser:
# localStorage.getItem('token')

cd backend
node src/scripts/debugToken.js YOUR_JWT_TOKEN_HERE
```

**Output:**

```
🔍 JWT Token Debugger
═════════════════════

📋 Token Payload:
{
  "userId": 4,
  "role": "ADMIN",
  "iat": 1696406400,
  "exp": 1696492800
}

👤 User ID: 4
👑 Role: ADMIN
⏰ Issued: 2025-10-04 12:00:00
⏳ Expires: 2025-10-05 12:00:00
✅ Token is valid (not expired)

═════════════════════════════════════════
Verifying against database...

Database Employee Record:
{
  "id": 4,
  "username": "admin",
  "name": "Admin User",
  "role": "ADMIN",
  "isActive": true
}

✅ Token role matches database role
✅ User is active
✅ Token is valid and can be used

═════════════════════════════════════════
```

**When to use:**

- Debug 403 permission errors
- Check if token is expired
- Verify role in token vs database
- Troubleshoot authentication issues
- Understand why "admin user" can't access admin features

**Perfect for:** Solving the exact problem we just fixed! (Token had old role)

---

## 🚀 Common Workflows

### Fresh Setup

```bash
cd backend

# 1. Seed database with sample data
node src/scripts/seed.js

# 2. Verify loyalty system
node src/scripts/diagnoseLoyalty.js

# 3. Test API endpoints
node src/scripts/testLoyaltyEndpoints.js
```

### Troubleshooting Permission Issues

```bash
# 1. Check who has admin access
node src/scripts/checkEmployees.js

# 2. Promote user to admin
node src/scripts/makeAdmin.js username

# 3. Verify user's JWT token
node src/scripts/debugToken.js <token>
```

### After Bug Fixes (What we just did!)

```bash
# 1. Test all endpoints still work
node src/scripts/testLoyaltyEndpoints.js <admin-token>

# 2. Verify loyalty data intact
node src/scripts/diagnoseLoyalty.js

# 3. Quick sanity check
node src/scripts/testLoyalty.js
```

### Regular Health Checks

```bash
# Daily quick check
node src/scripts/testLoyalty.js

# Weekly full diagnostic
node src/scripts/diagnoseLoyalty.js

# Before deployment
node src/scripts/testLoyaltyEndpoints.js <token>
```

### User Management

```bash
# See all users and roles
node src/scripts/checkEmployees.js

# Make someone admin
node src/scripts/makeAdmin.js username

# Debug why user can't access feature
node src/scripts/debugToken.js <their-token>
```

---

## 📦 Dependencies

All scripts use:

- `@prisma/client` - Database access
- `jsonwebtoken` - Token verification (debugToken.js)
- Node.js built-in modules (http, https, fs)

No additional installations needed!

---

## 🔒 Security Notes

**Safe to run in production:**

- ✅ seed.js (uses upsert, won't duplicate)
- ✅ seedLoyaltyTiers.js (uses upsert)
- ✅ diagnoseLoyalty.js (read-only)
- ✅ testLoyalty.js (read-only)
- ✅ checkEmployees.js (read-only)

**Use with caution in production:**

- ⚠️ makeAdmin.js (modifies user roles)
- ⚠️ fixMyPermissions.js (modifies specific user)
- ⚠️ testLoyaltyEndpoints.js (creates/deletes test data)

**Development only:**

- 🔧 debugToken.js (exposes token contents)

---

## 🎯 Quick Reference

| Need to...           | Run this script           |
| -------------------- | ------------------------- |
| Set up database      | `seed.js`                 |
| Fix loyalty tiers    | `seedLoyaltyTiers.js`     |
| Check loyalty health | `diagnoseLoyalty.js`      |
| Quick loyalty test   | `testLoyalty.js`          |
| Test API endpoints   | `testLoyaltyEndpoints.js` |
| See all users        | `checkEmployees.js`       |
| Make user admin      | `makeAdmin.js`            |
| Fix specific user    | `fixMyPermissions.js`     |
| Debug JWT token      | `debugToken.js`           |

---

## ✅ All Scripts Status

**Last tested:** October 4, 2025  
**All scripts:** ✅ Working correctly  
**Recent updates:** Fixed array nesting bug in loyalty routes (doesn't affect scripts)

All scripts are production-ready and fully documented! 🎉

---

## 📞 Getting Help

If a script fails:

1. **Check backend server is running** (for API test scripts)
2. **Verify database connection** (check .env DATABASE_URL)
3. **Check Prisma client is generated** (`npx prisma generate`)
4. **Look at error message** (scripts have descriptive errors)
5. **Run diagnostic script** (`diagnoseLoyalty.js`)

Still stuck? Check the specific script's error output - they're designed to be self-explanatory!
