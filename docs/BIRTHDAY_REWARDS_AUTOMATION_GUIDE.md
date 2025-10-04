# Birthday Rewards Automation Setup Guide

## Option A: Using Node-Cron (Recommended for Development)

### 1. Install node-cron

```bash
cd backend
npm install node-cron
```

### 2. Create scheduler file

**File:** `backend/src/scheduler.js`

```javascript
const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const LOYALTY_TIERS = {
  BRONZE: { birthdayBonus: 50 },
  SILVER: { birthdayBonus: 100 },
  GOLD: { birthdayBonus: 200 },
  PLATINUM: { birthdayBonus: 500 },
};

async function processBirthdayRewards() {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    console.log(`🎂 Checking for birthdays on ${todayMonth}/${todayDay}...`);

    // Find customers with birthdays today
    const customers = await prisma.$queryRaw`
      SELECT * FROM Customer 
      WHERE isActive = 1 
      AND dateOfBirth IS NOT NULL
      AND CAST(strftime('%m', dateOfBirth) AS INTEGER) = ${todayMonth}
      AND CAST(strftime('%d', dateOfBirth) AS INTEGER) = ${todayDay}
    `;

    if (customers.length === 0) {
      console.log("✅ No birthdays today");
      return [];
    }

    const results = [];

    for (const customer of customers) {
      const tierConfig = LOYALTY_TIERS[customer.loyaltyTier] || LOYALTY_TIERS.BRONZE;
      const birthdayBonus = tierConfig.birthdayBonus;

      // Award birthday points
      await prisma.customer.update({
        where: { id: customer.id },
        data: { loyaltyPoints: { increment: birthdayBonus } },
      });

      // Create transaction record
      await prisma.pointsTransaction.create({
        data: {
          customerId: customer.id,
          type: "BIRTHDAY_BONUS",
          points: birthdayBonus,
          description: `🎉 Happy Birthday! ${customer.loyaltyTier} tier birthday bonus`,
        },
      });

      console.log(`🎁 Awarded ${birthdayBonus} points to ${customer.name}`);

      results.push({
        customerId: customer.id,
        name: customer.name,
        bonus: birthdayBonus,
      });
    }

    console.log(`✅ Birthday bonuses awarded to ${results.length} customers`);
    return results;
  } catch (error) {
    console.error("❌ Birthday rewards error:", error);
    throw error;
  }
}

function startScheduler() {
  // Run every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("\n📅 Running scheduled birthday rewards...");
    try {
      await processBirthdayRewards();
    } catch (error) {
      console.error("Birthday rewards failed:", error);
    }
  });

  console.log("⏰ Birthday rewards scheduler started (runs daily at 9 AM)");

  // Optional: Run immediately on startup for testing
  // processBirthdayRewards();
}

module.exports = { startScheduler, processBirthdayRewards };
```

### 3. Update backend/src/index.js

Add this after your existing server setup:

```javascript
// Add at the top
const { startScheduler } = require("./scheduler");

// Add after app.listen()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start birthday rewards scheduler
  startScheduler();
});
```

### 4. Test It

**Manual test:**

```bash
cd backend
node -e "require('./src/scheduler').processBirthdayRewards().then(() => process.exit())"
```

**Add a test birthday:**

```sql
-- Update a customer to have today's birthday
UPDATE Customer
SET dateOfBirth = date('now')
WHERE id = 1;
```

---

## Option B: Windows Task Scheduler (Recommended for Production)

### 1. Create PowerShell script

**File:** `backend/run-birthday-rewards.ps1`

```powershell
# Set working directory
Set-Location "E:\All Project\POS-System\backend"

# Run the birthday rewards
$response = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/loyalty/birthday-rewards" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer YOUR_ADMIN_TOKEN_HERE"
    "Content-Type" = "application/json"
  }

Write-Host "Birthday rewards processed: $($response.customers.Count) customers"
```

### 2. Setup Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Name: "POS Birthday Rewards"
4. Trigger: Daily at 9:00 AM
5. Action: Start a program
6. Program: `powershell.exe`
7. Arguments: `-File "E:\All Project\POS-System\backend\run-birthday-rewards.ps1"`

---

## Option C: Linux Cron (For Production on Linux)

Add to crontab:

```bash
crontab -e

# Add this line (runs daily at 9 AM):
0 9 * * * curl -X POST http://localhost:3000/api/loyalty/birthday-rewards \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Testing Schedule

**Cron expressions:**

- `0 9 * * *` - Every day at 9 AM
- `*/5 * * * *` - Every 5 minutes (for testing)
- `0 0 * * 0` - Every Sunday at midnight
- `0 12 * * 1-5` - Weekdays at noon

**To test immediately:**

```javascript
// In scheduler.js, uncomment this line in startScheduler():
processBirthdayRewards();
```

---

## Monitoring

**View logs:**

```bash
# Backend logs will show:
🎂 Checking for birthdays on 10/4...
🎁 Awarded 100 points to John Doe
✅ Birthday bonuses awarded to 1 customers
```

**Check transaction history:**

```sql
SELECT * FROM PointsTransaction
WHERE type = 'BIRTHDAY_BONUS'
ORDER BY createdAt DESC;
```

---

## Recommended: Option A (Node-Cron)

**Pros:**

- ✅ Self-contained in your app
- ✅ Easy to test
- ✅ Works on any OS
- ✅ Logs visible in app console
- ✅ Can add email notifications later

**Time:** 15-30 minutes to setup **Effort:** Low **Value:** High - customers love birthday rewards!
