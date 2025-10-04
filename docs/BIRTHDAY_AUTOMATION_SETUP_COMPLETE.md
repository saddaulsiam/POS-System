# Birthday Rewards Automation - Complete Setup & Testing Guide

## 📋 What This System Does

### **Automatic Daily Process:**

1. **9:00 AM Every Day** - System wakes up automatically
2. **Checks Database** - Finds customers with today's birthday
3. **Awards Points** - Gives tier-based birthday bonuses
4. **Creates Records** - Logs transactions for audit trail
5. **Continues** - Runs every day without manual intervention

### **Example Timeline:**

```
October 4, 2025 at 9:00 AM:
├─ System checks: Who has birthday on Oct 4?
├─ Found: Jane Smith (SILVER tier)
├─ Awards: 100 points (SILVER birthday bonus)
├─ Creates transaction: "🎉 Happy Birthday Jane! SILVER tier birthday bonus"
└─ Logs: "Birthday bonuses awarded to 1 customer"

October 5, 2025 at 9:00 AM:
├─ System checks: Who has birthday on Oct 5?
├─ Found: Nobody
└─ Logs: "No birthdays today - all clear!"
```

---

## 🚀 Setup Instructions

### **Step 1: Install Dependencies**

```bash
cd backend
npm install node-cron
```

**What this does:** Installs the scheduler library that makes automation work

---

### **Step 2: Files Already Created** ✅

I've already created and configured:

1. ✅ **`backend/src/scheduler.js`** - Birthday automation logic
2. ✅ **`backend/src/index.js`** - Updated to start scheduler
3. ✅ **Documentation files** - Complete guides

**You don't need to create anything manually!**

---

### **Step 3: Test It**

#### **Option A: Test Immediately (Recommended)**

Run the birthday check right now (doesn't wait for 9 AM):

```bash
cd backend
node src/scheduler.js
```

**Expected Output:**

```
🧪 Testing birthday rewards process...

🎂 Checking for birthdays on 10/4/2025...
✅ No birthdays today - all clear!

📊 Test Results:
{
  "success": true,
  "count": 0,
  "customers": []
}
```

#### **Option B: Create Test Birthday**

Add a customer with today's birthday:

```bash
# Open SQLite database
cd backend
sqlite3 prisma/dev.db

# Update a customer to have today's birthday
UPDATE Customer
SET dateOfBirth = date('now')
WHERE id = 1;

# Exit SQLite
.exit

# Now test again
node src/scheduler.js
```

**Expected Output:**

```
🎂 Checking for birthdays on 10/4/2025...
🎉 Found 1 birthday today!
  🎁 John Doe (BRONZE): +50 points

✅ Birthday rewards complete: 1/1 customers awarded

📊 Test Results:
{
  "success": true,
  "count": 1,
  "customers": [
    {
      "customerId": 1,
      "name": "John Doe",
      "tier": "BRONZE",
      "bonus": 50,
      "success": true
    }
  ]
}
```

---

### **Step 4: Start Backend Server**

The scheduler will start automatically with your server:

```bash
cd backend
npm run dev
```

**You'll see:**

```
Server running on port 5000
Environment: development

⏰ Birthday Rewards Scheduler Starting...
✅ Birthday rewards scheduler is running
📆 Schedule: Daily at 9:00 AM
🎂 Automatically checks for birthdays and awards bonuses
```

---

## 🎯 How It Works Technically

### **1. Cron Schedule**

```javascript
cron.schedule("0 9 * * *", async () => {
  // This runs every day at 9:00 AM
  await processBirthdayRewards();
});
```

**Cron Format:** `minute hour day month dayOfWeek`

- `0` = 0 minutes (start of the hour)
- `9` = 9th hour (9:00 AM)
- `*` = every day
- `*` = every month
- `*` = every day of the week

### **2. Database Query**

```sql
SELECT * FROM Customer
WHERE isActive = 1
AND dateOfBirth IS NOT NULL
AND CAST(strftime('%m', dateOfBirth) AS INTEGER) = currentMonth
AND CAST(strftime('%d', dateOfBirth) AS INTEGER) = currentDay
```

**What this does:**

- Extracts month and day from `dateOfBirth`
- Compares with today's month and day
- Returns matching customers

### **3. Award Process**

```javascript
// For each birthday customer:
await prisma.$transaction(async (tx) => {
  // 1. Add points to customer
  await tx.customer.update({
    where: { id: customerId },
    data: { loyaltyPoints: { increment: birthdayBonus } },
  });

  // 2. Create transaction record
  await tx.pointsTransaction.create({
    data: {
      customerId,
      type: "BIRTHDAY_BONUS",
      points: birthdayBonus,
      description: "Happy Birthday! ...",
    },
  });
});
```

**Benefits of transaction:**

- Both operations succeed or both fail
- No partial updates
- Data integrity maintained

---

## 🎂 Birthday Bonus Amounts

| Tier     | Points Awarded |
| -------- | -------------- |
| BRONZE   | 50 points      |
| SILVER   | 100 points     |
| GOLD     | 200 points     |
| PLATINUM | 500 points     |

---

## 📊 Monitoring & Verification

### **Check Console Logs**

When the scheduler runs, you'll see:

```
📅 ==========================================
   Scheduled Birthday Rewards Check
   Time: 10/4/2025, 9:00:00 AM
==========================================

🎂 Checking for birthdays on 10/4/2025...
🎉 Found 2 birthdays today!
  🎁 Jane Smith (SILVER): +100 points
  🎁 Bob Johnson (PLATINUM): +500 points

✅ Birthday rewards complete: 2/2 customers awarded

🎊 Success! Awarded bonuses to 2 customers
```

### **Check Database**

View birthday transactions:

```sql
SELECT
  c.name,
  pt.points,
  pt.description,
  pt.createdAt
FROM PointsTransaction pt
JOIN Customer c ON pt.customerId = c.id
WHERE pt.type = 'BIRTHDAY_BONUS'
ORDER BY pt.createdAt DESC
LIMIT 10;
```

### **Check Customer History**

In your app, customers will see:

```
Points History:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10/4/2025  BIRTHDAY_BONUS  +100 pts
Description: 🎉 Happy Birthday Jane! SILVER tier birthday bonus
```

---

## ⚙️ Configuration Options

### **Change Schedule Time**

Edit `backend/src/scheduler.js`:

```javascript
// Current: 9:00 AM daily
cron.schedule('0 9 * * *', ...)

// Change to 8:00 AM
cron.schedule('0 8 * * *', ...)

// Change to noon (12:00 PM)
cron.schedule('0 12 * * *', ...)

// Run every hour (testing)
cron.schedule('0 * * * *', ...)

// Run every 5 minutes (testing only!)
cron.schedule('*/5 * * * *', ...)
```

### **Run Immediately on Startup**

Edit `backend/src/scheduler.js`, in `startScheduler()` function:

```javascript
// Uncomment this line:
processBirthdayRewards();
```

This will run the birthday check as soon as the server starts (useful for testing).

---

## 🧪 Testing Scenarios

### **Test 1: No Birthdays Today**

```bash
node src/scheduler.js
```

**Expected:** "No birthdays today - all clear!"

### **Test 2: One Birthday**

```sql
UPDATE Customer SET dateOfBirth = date('now') WHERE id = 1;
```

```bash
node src/scheduler.js
```

**Expected:** 1 customer awarded points

### **Test 3: Multiple Birthdays**

```sql
UPDATE Customer SET dateOfBirth = date('now') WHERE id IN (1, 2, 3);
```

**Expected:** 3 customers awarded points

### **Test 4: Different Tiers**

Create customers with different tiers and same birthday:

- BRONZE customer gets 50 pts
- SILVER customer gets 100 pts
- GOLD customer gets 200 pts
- PLATINUM customer gets 500 pts

---

## 🔧 Troubleshooting

### **Problem: Scheduler doesn't start**

**Solution:** Check console for errors when server starts

### **Problem: No birthdays found**

**Check:**

1. Customers have `dateOfBirth` set in database
2. `dateOfBirth` format is correct (YYYY-MM-DD)
3. Customers have `isActive = 1`

### **Problem: Points not awarded**

**Check:**

1. Transaction errors in console
2. Database connection working
3. Customer exists in database

### **Problem: Runs at wrong time**

**Check:**

1. Server timezone settings
2. Cron expression is correct
3. Server is actually running at 9 AM

---

## 📝 What Customers See

### **In Their Dashboard:**

```
┌─────────────────────────────────────────┐
│ Points History                          │
├─────────────────────────────────────────┤
│ Oct 4, 2025                             │
│ 🎉 BIRTHDAY_BONUS          +100 points  │
│ Happy Birthday! SILVER tier birthday    │
│ bonus                                   │
└─────────────────────────────────────────┘
```

### **Updated Balance:**

```
Current Points: 350  →  450 (+100)
Lifetime Points: 850  →  950 (+100)
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `node-cron` installed
- [ ] `scheduler.js` created
- [ ] `index.js` updated
- [ ] Test script runs successfully
- [ ] Server starts with scheduler message
- [ ] Can manually trigger with `node src/scheduler.js`
- [ ] Console shows correct schedule (9:00 AM daily)
- [ ] Birthday transactions appear in database
- [ ] Customer points increase correctly

---

## 🎊 Success Criteria

You'll know it's working when:

1. ✅ Server console shows scheduler started
2. ✅ Test script finds birthdays correctly
3. ✅ Points are awarded automatically
4. ✅ Transaction records created
5. ✅ Customers see birthday bonus in history
6. ✅ Runs every day at 9 AM automatically

---

## 📚 Related Files

- `backend/src/scheduler.js` - Main automation logic
- `backend/src/index.js` - Server startup integration
- `backend/src/routes/loyalty.js` - Manual birthday endpoint (backup)
- `docs/BIRTHDAY_REWARDS_AUTOMATION_GUIDE.md` - Full documentation

---

## 🚀 Next Steps

1. **Install node-cron:** `npm install node-cron`
2. **Test it:** `node src/scheduler.js`
3. **Start server:** `npm run dev`
4. **Monitor logs:** Watch for 9 AM execution tomorrow
5. **Done!** It runs automatically forever!

---

## 💡 Pro Tips

1. **Test with fake birthdays** - Update customer birthdays to today for testing
2. **Check logs daily** - Monitor the 9 AM runs for first few days
3. **Keep it simple** - Default 9 AM schedule works great
4. **Don't over-test** - Once it works, let it run automatically
5. **Celebrate with customers** - Tell them about automatic birthday rewards!

---

**Time to Setup:** 5-10 minutes  
**Maintenance Required:** Zero! Runs automatically  
**Customer Delight:** Maximum! 🎉
