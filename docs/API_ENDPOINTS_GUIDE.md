# API Endpoints - Loyalty & Customer Search

## Overview

This document covers the critical API endpoints added to support the loyalty program and customer search functionality.

---

## Customer Endpoints

### 1. Get Customer by Phone

**Endpoint:** `GET /api/customers/phone/:phone`

**Purpose:** Search for a customer by their phone number (used in POS for quick customer lookup)

**Authentication:** Required (Bearer token)

**Request:**
```
GET /api/customers/phone/1234567890
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "phoneNumber": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "loyaltyPoints": 150,
  "isActive": true,
  "createdAt": "2025-10-01T00:00:00.000Z",
  "updatedAt": "2025-10-04T00:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Customer not found"
}
```

**Usage in Frontend:**
```typescript
import { customersAPI } from '../services/api';

const customer = await customersAPI.getByPhone("1234567890");
```

---

## Loyalty Endpoints

### 2. Redeem Points

**Endpoint:** `POST /api/loyalty/redeem-points`

**Purpose:** Redeem customer loyalty points for discounts at checkout

**Authentication:** Required (Bearer token)

**Request:**
```json
POST /api/loyalty/redeem-points

{
  "customerId": 1,
  "points": 100,
  "rewardType": "DISCOUNT",
  "rewardValue": 10.00,
  "description": "Fixed discount reward"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| customerId | number | Yes | Customer ID |
| points | number | Yes | Points to redeem (min: 1) |
| rewardType | string | Yes | Type of reward (see below) |
| rewardValue | number | Yes | Discount/reward value |
| description | string | No | Optional description |

**Reward Types:**
- `DISCOUNT` - Fixed dollar discount
- `FREE_PRODUCT` - Free product reward
- `STORE_CREDIT` - Store credit
- `SPECIAL_OFFER` - Special promotional offer

**Success Response (200):**
```json
{
  "success": true,
  "newBalance": 50,
  "pointsRedeemed": 100,
  "discountAmount": 10.00,
  "reward": {
    "id": 5,
    "customerId": 1,
    "rewardType": "DISCOUNT_FIXED",
    "rewardValue": 10.00,
    "pointsCost": 100,
    "description": "Fixed discount reward",
    "redeemedAt": "2025-10-04T12:00:00.000Z",
    "isActive": false
  }
}
```

**Error Responses:**

**400 - Validation Error:**
```json
{
  "errors": [
    {
      "msg": "Points must be positive",
      "param": "points"
    }
  ]
}
```

**500 - Insufficient Points:**
```json
{
  "error": "Insufficient points. Customer has 50, needs 100"
}
```

**500 - Customer Not Found:**
```json
{
  "error": "Customer not found"
}
```

**Usage in Frontend:**
```typescript
import { loyaltyAPI } from '../services/api';

const result = await loyaltyAPI.redeemPoints({
  customerId: 1,
  points: 100,
  rewardType: "DISCOUNT",
  rewardValue: 10.00,
  description: "10% off purchase"
});

console.log(`New balance: ${result.newBalance}`);
console.log(`Discount: $${result.discountAmount}`);
```

---

### 3. Get Loyalty Tiers

**Endpoint:** `GET /api/loyalty/tiers`

**Purpose:** Get all loyalty tier configurations

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
[
  {
    "tier": "BRONZE",
    "minimumPoints": 0,
    "pointsMultiplier": 1.0,
    "discountPercentage": 0,
    "birthdayBonus": 50
  },
  {
    "tier": "SILVER",
    "minimumPoints": 500,
    "pointsMultiplier": 1.25,
    "discountPercentage": 5,
    "birthdayBonus": 100
  },
  {
    "tier": "GOLD",
    "minimumPoints": 1500,
    "pointsMultiplier": 1.5,
    "discountPercentage": 10,
    "birthdayBonus": 200
  },
  {
    "tier": "PLATINUM",
    "minimumPoints": 3000,
    "pointsMultiplier": 2.0,
    "discountPercentage": 15,
    "birthdayBonus": 500
  }
]
```

---

### 4. Get Points History

**Endpoint:** `GET /api/loyalty/customers/:customerId/points-history`

**Purpose:** Get customer's points transaction history

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "type": "EARNED",
    "points": 50,
    "description": "Purchase #REC-12345",
    "createdAt": "2025-10-04T10:00:00.000Z",
    "sale": {
      "receiptId": "REC-12345",
      "finalAmount": 500.00,
      "createdAt": "2025-10-04T10:00:00.000Z"
    }
  },
  {
    "id": 2,
    "customerId": 1,
    "type": "REDEEMED",
    "points": -100,
    "description": "Redeemed 100 points for DISCOUNT",
    "createdAt": "2025-10-04T11:00:00.000Z",
    "sale": null
  }
]
```

---

### 5. Get Customer Rewards

**Endpoint:** `GET /api/loyalty/customers/:customerId/rewards`

**Purpose:** Get customer's available and active rewards

**Authentication:** Required (Bearer token)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "rewardType": "DISCOUNT_PERCENTAGE",
    "rewardValue": 10.00,
    "pointsCost": 200,
    "description": "10% discount voucher",
    "isActive": true,
    "redeemedAt": null,
    "usedAt": null,
    "expiresAt": "2025-11-04T00:00:00.000Z",
    "createdAt": "2025-10-01T00:00:00.000Z"
  }
]
```

---

## Implementation Details

### Backend Files Modified

**1. `/backend/src/routes/customers.js`**
- Added `GET /phone/:phone` endpoint
- Searches for customer by exact phone match
- Returns customer with loyalty points

**2. `/backend/src/routes/loyalty.js`**
- Added `POST /redeem-points` endpoint
- Handles point redemption with validation
- Creates transaction records
- Deducts points from customer balance

### Database Transactions

**Point Redemption Flow:**
```javascript
await prisma.$transaction(async (tx) => {
  // 1. Get customer
  const customer = await tx.customer.findUnique({ 
    where: { id: customerId } 
  });

  // 2. Validate points
  if (customer.loyaltyPoints < points) {
    throw new Error("Insufficient points");
  }

  // 3. Deduct points
  await tx.customer.update({
    where: { id: customerId },
    data: { loyaltyPoints: { decrement: points } }
  });

  // 4. Create transaction record
  await tx.pointsTransaction.create({
    data: {
      customerId,
      type: "REDEEMED",
      points: -points,
      description: `Redeemed ${points} points for ${rewardType}`
    }
  });

  // 5. Create reward record
  const reward = await tx.loyaltyReward.create({
    data: {
      customerId,
      rewardType: "DISCOUNT_FIXED",
      rewardValue,
      pointsCost: points,
      description,
      redeemedAt: new Date(),
      isActive: false
    }
  });

  return { reward, newBalance: customer.loyaltyPoints - points };
});
```

---

## Testing

### Manual Testing with Postman/Curl

**1. Search Customer by Phone:**
```bash
curl -X GET http://localhost:5000/api/customers/phone/1234567890 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**2. Redeem Points:**
```bash
curl -X POST http://localhost:5000/api/loyalty/redeem-points \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "points": 100,
    "rewardType": "DISCOUNT",
    "rewardValue": 10.00,
    "description": "Test redemption"
  }'
```

**3. Get Points History:**
```bash
curl -X GET http://localhost:5000/api/loyalty/customers/1/points-history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Handling

### Common Errors

| Status | Error | Cause | Solution |
|--------|-------|-------|----------|
| 400 | Validation Error | Invalid request data | Check request format |
| 401 | Unauthorized | Missing/invalid token | Login again |
| 404 | Customer not found | Invalid phone/ID | Verify customer exists |
| 500 | Insufficient points | Not enough points | Check available balance |
| 500 | Database error | DB connection issue | Check database |

### Frontend Error Handling

```typescript
try {
  const result = await loyaltyAPI.redeemPoints(data);
  toast.success(`Redeemed ${result.pointsRedeemed} points!`);
} catch (error) {
  if (error.response?.status === 404) {
    toast.error("Customer not found");
  } else if (error.response?.data?.error?.includes("Insufficient")) {
    toast.error("Not enough points available");
  } else {
    toast.error("Failed to redeem points");
  }
  console.error("Redemption error:", error);
}
```

---

## Security Considerations

### Authentication
- All endpoints require valid JWT token
- Token must be passed in Authorization header
- Tokens expire after configured duration

### Validation
- All inputs validated with express-validator
- Points must be positive integers
- Reward types restricted to allowed values
- Customer existence verified before operations

### Data Integrity
- Database transactions ensure atomicity
- Points can't go negative
- Concurrent redemptions handled properly
- Transaction records created for audit trail

---

## Performance

### Optimization Tips

1. **Database Indexes**
   - Index on `customers.phoneNumber` for fast lookups
   - Index on `pointsTransactions.customerId` for history queries
   - Index on `loyaltyRewards.customerId` for rewards queries

2. **Caching** (Future Enhancement)
   - Cache tier configurations
   - Cache customer lookup results (short TTL)
   - Use Redis for high-traffic scenarios

3. **Query Optimization**
   - Use `select` to limit returned fields
   - Paginate transaction history for large datasets
   - Limit rewards query to active/unexpired only

---

## Migration Guide

If upgrading from an older version without these endpoints:

1. **Pull latest code**
2. **Restart backend server**
3. **Test endpoints** with Postman
4. **Update frontend** if needed
5. **Clear browser cache**
6. **Test full flow** in application

---

**Last Updated:** October 4, 2025
**Backend Version:** 1.0.0
**Endpoints Status:** ✅ Production Ready
