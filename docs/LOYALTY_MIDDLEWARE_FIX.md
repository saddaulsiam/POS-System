# Loyalty Routes Middleware Fix

## Issue: Double Array Nesting Bug

**Date:** October 4, 2025  
**Status:** ✅ FIXED

## Problem

All loyalty endpoints that used **both** `authenticateToken` and `authorizeRoles` middleware had a critical bug where
the middleware array was double-nested, causing the role authorization to fail.

### Root Cause

**WRONG Syntax:**

```javascript
router.get("/endpoint", [authenticateToken, authorizeRoles(["ADMIN", "MANAGER"])], handler);
//                      ^-- Array wrapper causes double nesting
```

This caused `authorizeRoles` to receive:

```javascript
requiredRoles: [["ADMIN", "MANAGER"]]; // ❌ Double nested!
```

When it should receive:

```javascript
requiredRoles: ["ADMIN", "MANAGER"]; // ✅ Correct
```

**Result:** The role check `roles.includes("ADMIN")` would fail because it was checking if the array contains "ADMIN",
but the array actually contained `["ADMIN", "MANAGER"]` as a single element.

### Symptoms

- Users with ADMIN or MANAGER role got **403 Forbidden** errors
- Backend logs showed:
  ```
  🔒 Authorization check: { requiredRoles: [["ADMIN", "MANAGER"]], userRole: "ADMIN" }
  ❌ Role mismatch: { required: [["ADMIN", "MANAGER"]], actual: "ADMIN", match: false }
  ```

## Solution

**CORRECT Syntax:**

```javascript
router.get("/endpoint", authenticateToken, authorizeRoles("ADMIN", "MANAGER"), handler);
//                      ^-- No array wrapper, middleware runs in sequence
```

This properly passes individual roles as arguments to `authorizeRoles()`, which internally converts them to an array.

## Fixed Endpoints

### 1. GET /loyalty/statistics

**Before:**

```javascript
router.get("/statistics", [authenticateToken, authorizeRoles(["ADMIN", "MANAGER"])], handler);
```

**After:**

```javascript
router.get("/statistics", authenticateToken, authorizeRoles("ADMIN", "MANAGER"), handler);
```

### 2. POST /loyalty/offers

**Before:**

```javascript
router.post("/offers", [authenticateToken, authorizeRoles(["ADMIN", "MANAGER"]), ...validations], handler);
```

**After:**

```javascript
router.post("/offers", authenticateToken, authorizeRoles("ADMIN", "MANAGER"), ...validations, handler);
```

### 3. PUT /loyalty/offers/:offerId

**Before:**

```javascript
router.put("/offers/:offerId", [authenticateToken, authorizeRoles(["ADMIN", "MANAGER"]), ...validations], handler);
```

**After:**

```javascript
router.put("/offers/:offerId", authenticateToken, authorizeRoles("ADMIN", "MANAGER"), ...validations, handler);
```

### 4. DELETE /loyalty/offers/:offerId

**Before:**

```javascript
router.delete("/offers/:offerId", [authenticateToken, authorizeRoles(["ADMIN"]), param("offerId").isInt()], handler);
```

**After:**

```javascript
router.delete("/offers/:offerId", authenticateToken, authorizeRoles("ADMIN"), param("offerId").isInt(), handler);
```

### 5. POST /loyalty/tiers/config

**Before:**

```javascript
router.post("/tiers/config", [authenticateToken, authorizeRoles(["ADMIN"]), ...validations], handler);
```

**After:**

```javascript
router.post("/tiers/config", authenticateToken, authorizeRoles("ADMIN"), ...validations, handler);
```

### 6. PUT /loyalty/customers/:customerId/tier

**Before:**

```javascript
router.put("/customers/:customerId/tier", [authenticateToken, authorizeRoles(["ADMIN"]), ...validations], handler);
```

**After:**

```javascript
router.put("/customers/:customerId/tier", authenticateToken, authorizeRoles("ADMIN"), ...validations, handler);
```

### 7. POST /loyalty/birthday-rewards

**Before:**

```javascript
router.post("/birthday-rewards", [authenticateToken, authorizeRoles(["ADMIN"])], handler);
```

**After:**

```javascript
router.post("/birthday-rewards", authenticateToken, authorizeRoles("ADMIN"), handler);
```

## Verification

After the fix, backend logs should show:

```
🔒 Authorization check: { requiredRoles: ["ADMIN", "MANAGER"], userRole: "ADMIN" }
✅ Authorization passed
```

## Impact

✅ **All loyalty admin features now work correctly:**

- View statistics
- Create special offers
- Update special offers
- Delete special offers
- Configure tier settings
- Update customer tiers
- Process birthday rewards

## Files Modified

- `backend/src/routes/loyalty.js` - Fixed 7 endpoint definitions

## Testing Checklist

- [x] GET /loyalty/statistics (ADMIN, MANAGER)
- [x] POST /loyalty/offers (ADMIN, MANAGER)
- [x] PUT /loyalty/offers/:offerId (ADMIN, MANAGER)
- [x] DELETE /loyalty/offers/:offerId (ADMIN only)
- [x] POST /loyalty/tiers/config (ADMIN only)
- [x] PUT /loyalty/customers/:customerId/tier (ADMIN only)
- [x] POST /loyalty/birthday-rewards (ADMIN only)

## Related Issues

- Fixed in conjunction with:
  - Statistics endpoint `customersByTier` formatting bug
  - Made `/tiers` endpoint public (no auth)
  - Made `/offers` endpoint use `optionalAuth` (public sees active offers, admin sees all)

## Lessons Learned

1. **Express middleware can be passed as individual arguments OR as an array, but not both**

   - ✅ `app.get("/path", middleware1, middleware2, handler)`
   - ✅ `app.get("/path", [middleware1, middleware2], handler)`
   - ❌ `app.get("/path", [middleware1, middleware2([...args])], handler)` ← Creates nesting issue

2. **The `authorizeRoles()` function signature is:**

   ```javascript
   const authorizeRoles = (...roles) => {
     /* roles is already an array */
   };
   ```

   - Call as: `authorizeRoles("ADMIN", "MANAGER")` ✅
   - NOT as: `authorizeRoles(["ADMIN", "MANAGER"])` ❌

3. **When debugging authorization issues, check for:**
   - Token validity and expiration
   - User role in database vs. token
   - **Middleware array structure** ← This was the issue
   - Role matching logic in authorizeRoles function

## Future Prevention

Add ESLint rule to catch this pattern:

```javascript
// .eslintrc.js
rules: {
  "no-restricted-syntax": [
    "error",
    {
      "selector": "CallExpression[callee.property.name=/^(get|post|put|delete|patch)$/] > ArrayExpression > CallExpression[callee.name='authorizeRoles'] > ArrayExpression",
      "message": "Don't nest authorizeRoles(['ROLE']) inside route array. Use authorizeRoles('ROLE') directly."
    }
  ]
}
```
