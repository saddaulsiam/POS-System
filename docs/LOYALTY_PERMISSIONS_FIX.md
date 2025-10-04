# How to Fix "Insufficient permissions" Error

## Quick Fix

You're getting a 403 error because you're logged in with an account that doesn't have ADMIN or MANAGER role.

### Step 1: Check Your Current Role

Open browser console (F12) and run:

```javascript
JSON.parse(localStorage.getItem("user"));
```

This will show your current user info including role.

### Step 2: Identify the Problem

If the role is **STAFF** or **CASHIER**, you need to either:

- **Option A:** Login with an admin account
- **Option B:** Update your account to ADMIN role

### Step 3: Solution

#### Option A: Login with Existing Admin Account

Based on the database, these accounts have access:

- Username: `admin` (Role: ADMIN)
- Username: `manager` (Role: MANAGER)

**Steps:**

1. Logout from current account
2. Login with `admin` or `manager`
3. Access /loyalty-admin again

#### Option B: Make Your Account an Admin

If you want to use your current account (`saddaulsiam`), run this command:

```bash
cd backend
node src/scripts/makeAdmin.js saddaulsiam
```

**Then:**

1. Logout from the app
2. Login again
3. Your account will now have ADMIN access

### Step 4: Verify Fix

After logging in with admin account, check browser console again:

```javascript
JSON.parse(localStorage.getItem("user")).role;
// Should return: "ADMIN" or "MANAGER"
```

---

## Why This Happens

The `/api/loyalty/statistics` endpoint requires:

- ✅ Valid authentication token
- ✅ Role must be **ADMIN** or **MANAGER**

Your account has role **STAFF** which is not authorized for this endpoint.

## Quick Reference

### Valid Roles for Loyalty Admin:

- ✅ **ADMIN** - Full access
- ✅ **MANAGER** - Full access
- ❌ **STAFF** - No access
- ❌ **CASHIER** - No access

### Available Scripts:

**Check all employees:**

```bash
cd backend
node src/scripts/checkEmployees.js
```

**Make user an admin:**

```bash
cd backend
node src/scripts/makeAdmin.js <username>
```

**Debug your token:**

```bash
cd backend
node src/scripts/debugToken.js <your-token-from-localStorage>
```

---

## Still Having Issues?

If you've tried the above and still getting errors:

1. **Clear browser cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear localStorage**: Run in console: `localStorage.clear()`
3. **Restart backend server**: Stop and start `npm run dev`
4. **Login again** with admin credentials

The error should now be resolved! 🎉
