# 🎁 Loyalty Program - Quick Reference

## 🚀 Quick Start

### If Loyalty Page Shows Errors:

```bash
# 1. Run diagnostic (shows what's wrong)
cd backend
node src/scripts/diagnoseLoyalty.js

# 2. If "No tiers found", run seed:
node src/scripts/seedLoyaltyTiers.js

# 3. Restart backend server:
npm run dev
```

## 🔍 Diagnostic Commands

```bash
# Full system check
cd backend
node src/scripts/diagnoseLoyalty.js

# Test API endpoints
node src/scripts/testLoyaltyEndpoints.js

# Test with authentication
node src/scripts/testLoyaltyEndpoints.js YOUR_ADMIN_TOKEN

# View tier config in database
npx prisma studio
```

## 🐛 Common Issues (Quick Fix)

| Issue                 | Quick Fix                                   |
| --------------------- | ------------------------------------------- |
| 💢 Stats show 0/NaN   | Fixed in latest code - pull changes         |
| 💢 "Cannot load data" | Check backend running on port 5000          |
| 💢 401 Unauthorized   | Login as ADMIN or MANAGER                   |
| 💢 No tiers in DB     | Run: `node src/scripts/seedLoyaltyTiers.js` |
| 💢 Offers don't show  | Check dates and isActive status             |
| 💢 Can't create offer | Check all required fields filled            |

## 📡 API Endpoints

### Public (No Auth Required)

```bash
GET  /api/loyalty/tiers              # Get tier config
GET  /api/loyalty/offers             # Get all offers
```

### Authenticated (Admin/Manager)

```bash
GET  /api/loyalty/statistics                      # Stats dashboard
GET  /api/loyalty/customers/:id/loyalty-status    # Customer details
GET  /api/loyalty/customers/:id/points-history    # Points history
POST /api/loyalty/offers                          # Create offer
PUT  /api/loyalty/offers/:id                      # Update offer
DELETE /api/loyalty/offers/:id                    # Delete offer
POST /api/loyalty/tiers/config                    # Update tier
POST /api/loyalty/award-points                    # Award points
POST /api/loyalty/redeem-points                   # Redeem points
```

## 🧪 Test Endpoints

```bash
# Test tier config
curl http://localhost:5000/api/loyalty/tiers

# Test statistics (with auth)
curl -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/api/loyalty/statistics
```

## 🗂️ Database Quick Queries

```sql
-- View all tiers
SELECT * FROM LoyaltyTierConfig;

-- Count customers by tier
SELECT loyaltyTier, COUNT(*)
FROM Customer
GROUP BY loyaltyTier;

-- Recent points transactions
SELECT * FROM PointsTransaction
ORDER BY createdAt DESC
LIMIT 10;

-- Active offers
SELECT * FROM LoyaltyOffer
WHERE isActive = 1;
```

## 📚 Documentation

- **Full Guide:** `docs/LOYALTY_PROGRAM_COMPLETE_GUIDE.md`
- **Troubleshooting:** `docs/LOYALTY_TROUBLESHOOTING_GUIDE.md`
- **Fix Summary:** `docs/LOYALTY_PROGRAM_FIX_SUMMARY.md`

## 🎯 Tier System Quick Reference

| Tier        | Min Points | Multiplier | Discount | Birthday |
| ----------- | ---------- | ---------- | -------- | -------- |
| 🥉 BRONZE   | 0          | 1.0x       | 0%       | 50 pts   |
| 🥈 SILVER   | 500        | 1.25x      | 5%       | 100 pts  |
| 🥇 GOLD     | 1,500      | 1.5x       | 10%      | 200 pts  |
| 💎 PLATINUM | 3,000      | 2.0x       | 15%      | 500 pts  |

## 🔧 Emergency Reset

```bash
# If everything is broken:

# 1. Stop all servers (Ctrl+C)

# 2. Reseed tiers
cd backend
node src/scripts/seedLoyaltyTiers.js

# 3. Run diagnostic
node src/scripts/diagnoseLoyalty.js

# 4. Restart backend
npm run dev

# 5. Restart frontend
cd ../frontend
npm run dev

# 6. Clear browser cache
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## ✅ Health Check (30 seconds)

```bash
# Run this to verify everything works:
cd backend

# 1. Check tiers exist (should show 4)
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.loyaltyTierConfig.count().then(c=>console.log('Tiers:',c)).finally(()=>p.\$disconnect())"

# 2. Check backend responds
curl http://localhost:5000/api/loyalty/tiers

# 3. Run full diagnostic
node src/scripts/diagnoseLoyalty.js
```

## 🆘 Still Stuck?

1. **Check Backend Console** - Look for error messages
2. **Check Browser Console** - F12 → Console tab
3. **Check Network Tab** - See which API call failed
4. **Read Troubleshooting Guide** - `docs/LOYALTY_TROUBLESHOOTING_GUIDE.md`
5. **Run Diagnostic Tool** - `node src/scripts/diagnoseLoyalty.js`

---

**💡 Tip:** Bookmark this file for quick access during development!

**Last Updated:** October 4, 2025
