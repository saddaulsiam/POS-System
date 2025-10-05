# Product Variant Routes - Fixed

## 🔧 Issues Fixed

### Issue 1: Missing GET /api/product-variants Route

**Error:** `403 Forbidden - Insufficient permissions` **Root Cause:** No route existed for `GET /api/product-variants`

**Fix:** Added new route at the top of productVariants.js

```javascript
router.get("/", authenticateToken, async (req, res) => {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });
    res.json(variants);
  } catch (error) {
    console.error("Get all variants error:", error);
    res.status(500).json({ error: "Failed to fetch variants" });
  }
});
```

### Issue 2: Incorrect authorizeRoles Usage

**Error:** `403 Forbidden - Insufficient permissions` when ADMIN tries to create/update variants **Root Cause:**
`authorizeRoles()` was called with array wrapped in array: `authorizeRoles(["ADMIN", "MANAGER"])`

**Problem:**

```javascript
// WRONG - Double array
authorizeRoles(["ADMIN", "MANAGER"]);
// Results in: requiredRoles: [ [ 'ADMIN', 'MANAGER' ] ]
// 'ADMIN' is NOT in [ [ 'ADMIN', 'MANAGER' ] ] ❌
```

**Fix:**

```javascript
// CORRECT - Spread arguments
authorizeRoles("ADMIN", "MANAGER");
// Results in: requiredRoles: [ 'ADMIN', 'MANAGER' ]
// 'ADMIN' is in [ 'ADMIN', 'MANAGER' ] ✅
```

**Files Modified:**

- Line 61: `POST /` - Create variant
- Line 141: `PUT /:id` - Update variant
- Line 217: `DELETE /:id` - Delete variant

---

## ✅ Product Variant Routes - All Working Now

### GET /api/product-variants

**Description:** Get all product variants **Auth:** Required (any authenticated user) **Response:** Array of variants
with product and category details

### GET /api/product-variants/product/:productId

**Description:** Get all variants for a specific product **Auth:** Required **Response:** Array of variants for the
product

### GET /api/product-variants/lookup/:identifier

**Description:** Lookup variant by ID, SKU, or barcode **Auth:** Required **Response:** Single variant object

### POST /api/product-variants

**Description:** Create a new product variant **Auth:** Required (ADMIN or MANAGER) **Body:**

```json
{
  "productId": 4,
  "name": "Large Size",
  "sku": "PROD-001-L",
  "barcode": "1234567890128",
  "purchasePrice": 10.0,
  "sellingPrice": 15.0,
  "stockQuantity": 100,
  "isActive": true
}
```

### PUT /api/product-variants/:id

**Description:** Update an existing variant **Auth:** Required (ADMIN or MANAGER) **Body:** Same as POST (all fields
optional)

### DELETE /api/product-variants/:id

**Description:** Delete a variant **Auth:** Required (ADMIN only)

---

## 🎯 Testing

### Test 1: Get All Variants

```bash
GET http://localhost:5000/api/product-variants
Authorization: Bearer <token>
```

**Expected:** 200 OK with array of variants

### Test 2: Create Variant (ADMIN)

```bash
POST http://localhost:5000/api/product-variants
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "productId": 4,
  "name": "XL Size",
  "sku": "PROD-004-XL",
  "purchasePrice": 12.00,
  "sellingPrice": 18.00
}
```

**Expected:** 201 Created with variant object

### Test 3: Create Variant (MANAGER)

**Expected:** 201 Created (MANAGER also has permission)

### Test 4: Create Variant (CASHIER)

**Expected:** 403 Forbidden - Insufficient permissions

---

## 📊 Authorization Matrix

| Route                   | ADMIN | MANAGER | CASHIER |
| ----------------------- | ----- | ------- | ------- |
| GET all variants        | ✅    | ✅      | ✅      |
| GET variants by product | ✅    | ✅      | ✅      |
| GET variant lookup      | ✅    | ✅      | ✅      |
| POST create variant     | ✅    | ✅      | ❌      |
| PUT update variant      | ✅    | ✅      | ❌      |
| DELETE variant          | ✅    | ❌      | ❌      |

---

## 🔍 How the Bug Was Found

Looking at the backend logs:

```
🔒 Authorization check: {
  requiredRoles: [ [ 'ADMIN', 'MANAGER' ] ],   ← Array inside array!
  userRole: 'ADMIN',
  userName: 'Admin',
  userId: 4,
  hasUser: true
}
❌ Role mismatch: {
  required: [ [ 'ADMIN', 'MANAGER' ] ],  ← Checking if 'ADMIN' === ['ADMIN', 'MANAGER']
  actual: 'ADMIN',                       ← String
  match: false                           ← String never equals array!
}
```

The `authorizeRoles` middleware uses:

```javascript
if (!roles.includes(req.user.role)) {
  return res.status(403).json({ error: "Insufficient permissions" });
}
```

When passed `["ADMIN", "MANAGER"]`, the `...roles` spread creates `[["ADMIN", "MANAGER"]]`

So it checks: `[["ADMIN", "MANAGER"]].includes("ADMIN")` → **false** ❌

When passed `"ADMIN", "MANAGER"`, the `...roles` spread creates `["ADMIN", "MANAGER"]`

So it checks: `["ADMIN", "MANAGER"].includes("ADMIN")` → **true** ✅

---

## 💡 Key Learnings

1. **Spread Operator Behavior**: `...roles` in function parameters expects individual arguments, not an array
2. **Correct:** `authorizeRoles("ADMIN", "MANAGER")`
3. **Wrong:** `authorizeRoles(["ADMIN", "MANAGER"])`

4. **Middleware Definition:**

```javascript
const authorizeRoles = (...roles) => {
  // roles is already an array from spread operator
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
```

---

## ✅ Resolution Status

- [x] Added missing GET /api/product-variants route
- [x] Fixed authorizeRoles calls (removed array wrapper)
- [x] Tested with ADMIN role - working ✅
- [x] Server auto-restarted with nodemon
- [x] Product variants can now be created/updated/deleted

**Last Updated:** October 4, 2025  
**Status:** ✅ All product variant routes working correctly
