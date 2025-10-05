# Points History Table Fix

**Date:** October 4, 2025  
**Issue:** Something wrong with customer loyalty program Points History

---

## 🔧 Fixes Applied

### 1. Fixed Running Balance Calculation

**Problem:** The `calculateRunningBalance` function was being called on every render and was mutating the
`filteredTransactions` array:

```typescript
// OLD (WRONG):
const calculateRunningBalance = () => {
  let balance = 0;
  return filteredTransactions
    .reverse() // ❌ Mutates the array!
    .map((transaction) => {
      balance += transaction.points;
      return { ...transaction, balance };
    })
    .reverse();
};

const transactionsWithBalance = calculateRunningBalance(); // ❌ Runs every render
```

**Issues with this approach:**

1. **Mutates array**: `.reverse()` modifies `filteredTransactions` in place
2. **Not memoized**: Recalculates on every render, even if data hasn't changed
3. **Performance**: Unnecessary recalculations

**Solution:** Convert to a memoized calculation with proper array handling:

```typescript
// NEW (CORRECT):
const transactionsWithBalance = React.useMemo(() => {
  // Create a copy to avoid mutating the original array
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let balance = 0;
  const withBalance = sortedTransactions.map((transaction) => {
    balance += transaction.points;
    return { ...transaction, balance };
  });

  // Return in reverse order (newest first)
  return withBalance.reverse();
}, [filteredTransactions]); // ✅ Only recalculates when filteredTransactions changes
```

**Benefits:**

- ✅ No array mutation
- ✅ Memoized for performance
- ✅ Only recalculates when data changes
- ✅ Proper chronological balance calculation

---

### 2. Added Debug Logging

**Added logging to help diagnose issues:**

```typescript
// When fetching transactions
const data = await loyaltyAPI.getTransactions(customerId);
console.log("Points History - Raw Data:", data);
console.log("Points History - Transaction Count:", data?.length || 0);

// After calculating balances
console.log(
  "Points History - Calculated Balances:",
  result.map((t) => ({
    date: new Date(t.createdAt).toLocaleDateString(),
    type: t.type,
    points: t.points,
    balance: t.balance,
  }))
);
```

**What to check in browser console:**

1. **Raw Data**: Shows what the backend is sending

   ```javascript
   Points History - Raw Data: [
     { id: 1, customerId: 3, type: "EARNED", points: 750, ... },
     { id: 2, customerId: 3, type: "REDEEMED", points: -200, ... }
   ]
   ```

2. **Transaction Count**: How many transactions exist

   ```javascript
   Points History - Transaction Count: 2
   ```

3. **Calculated Balances**: Shows the running balance calculation
   ```javascript
   Points History - Calculated Balances: [
     { date: "10/4/2025", type: "REDEEMED", points: -200, balance: 550 },
     { date: "10/3/2025", type: "EARNED", points: 750, balance: 750 }
   ]
   ```

---

## 📊 How Running Balance Works

The running balance shows the customer's point balance **at the time of each transaction**.

### Example Transaction History:

```
Customer starts with 0 points
```

**Transaction 1 (Oct 1):** Earned +750 points from purchase

- Points: +750
- Running Balance: 0 + 750 = **750**

**Transaction 2 (Oct 3):** Redeemed -200 points for discount

- Points: -200
- Running Balance: 750 - 200 = **550**

**Transaction 3 (Oct 5):** Birthday bonus +100 points

- Points: +100
- Running Balance: 550 + 100 = **650**

### How We Calculate It:

1. **Sort transactions oldest first** (by createdAt date)
2. **Start with balance = 0**
3. **For each transaction** (in chronological order):
   - Add transaction points to balance
   - Store the current balance with that transaction
4. **Reverse the list** (newest first for display)

**Code Flow:**

```typescript
Sorted oldest first:
  Oct 1: +750 → balance = 0 + 750 = 750
  Oct 3: -200 → balance = 750 - 200 = 550
  Oct 5: +100 → balance = 550 + 100 = 650

Display newest first:
  Oct 5: +100 | Balance: 650
  Oct 3: -200 | Balance: 550
  Oct 1: +750 | Balance: 750
```

---

## 🎯 Expected UI Behavior

### Scenario 1: Customer with earned and redeemed points

**Backend Data:**

```json
[
  {
    "id": 2,
    "customerId": 3,
    "type": "REDEEMED",
    "points": -200,
    "description": "Redeemed for $2 discount",
    "createdAt": "2025-10-03T14:30:00Z"
  },
  {
    "id": 1,
    "customerId": 3,
    "type": "EARNED",
    "points": 750,
    "description": "Purchase $75.00",
    "createdAt": "2025-10-01T10:15:00Z"
  }
]
```

**UI Should Display:**

**Summary Stats:**

```
Total Earned: +750
Total Redeemed: -200
Net Balance: 550
```

**Transaction Table:**

```
Date              | Type     | Description              | Points | Balance
------------------|----------|--------------------------|--------|--------
Oct 3, 2025 2:30  | Redeemed | Redeemed for $2 discount | -200   | 550
Oct 1, 2025 10:15 | Earned   | Purchase $75.00          | +750   | 750
```

**Calculation:**

- Transaction 1 (oldest): +750 → Balance: 750
- Transaction 2 (newest): -200 → Balance: 550
- Display shows newest first, so Oct 3 appears at top

---

### Scenario 2: Customer with no transactions

**Backend Data:**

```json
[]
```

**UI Should Display:**

```
Summary Stats:
  Total Earned: +0
  Total Redeemed: -0
  Net Balance: 0

Table:
  "No transactions found"
  "Adjust your filters or check back later"
```

---

### Scenario 3: Customer with only earned points

**Backend Data:**

```json
[
  {
    "id": 3,
    "type": "BIRTHDAY_BONUS",
    "points": 100,
    "description": "Happy Birthday!",
    "createdAt": "2025-10-04T00:00:00Z"
  },
  {
    "id": 1,
    "type": "EARNED",
    "points": 750,
    "description": "Purchase $75.00",
    "createdAt": "2025-10-01T10:15:00Z"
  }
]
```

**UI Should Display:**

**Summary Stats:**

```
Total Earned: +850
Total Redeemed: -0
Net Balance: 850
```

**Transaction Table:**

```
Date              | Type           | Description      | Points | Balance
------------------|----------------|------------------|--------|--------
Oct 4, 2025       | Birthday Bonus | Happy Birthday!  | +100   | 850
Oct 1, 2025       | Earned         | Purchase $75.00  | +750   | 750
```

---

## 🔍 Common Issues and Solutions

### Issue 1: Running balance shows incorrect values

**Symptoms:**

- Balance doesn't match the sum of points
- Balance goes negative when it shouldn't
- Balance resets or jumps unexpectedly

**Causes:**

1. Transactions not sorted chronologically
2. Initial balance not starting at 0
3. Array mutation causing incorrect calculation

**Solution:** ✅ Fixed with proper sorting and memoization

---

### Issue 2: No transactions showing

**Check:**

1. Is `customerId` correct?
2. Are there transactions in the database?
3. Check browser console for errors
4. Check Network tab for API response

**Debug:**

```bash
# In backend directory
node src/scripts/checkCustomerPoints.js
```

Look for customer's transactions in the output.

---

### Issue 3: Summary stats don't match table

**Symptoms:**

- Total Earned shows different number than table
- Net Balance doesn't equal earned - redeemed

**Cause:** Summary stats use `transactions` (all data), but table shows `filteredTransactions` (after filters applied).

**This is correct behavior!**

- Summary always shows **all transactions**
- Table respects date and type filters
- Footer shows: "Showing X of Y transactions"

---

### Issue 4: Filters not working

**Check:**

1. `dateFilter` state updating correctly?
2. `typeFilter` state updating correctly?
3. `filteredTransactions` memo recalculating?

**Debug in console:**

```javascript
// Should update when you change filters
Points History - Calculated Balances: [...]
```

---

## 🚀 Testing the Fix

### 1. Open Customer Loyalty Page

Navigate to: `/customers` → Click customer → "🎁 Loyalty Program" tab → "Points History" section

### 2. Check Browser Console

Should see:

```javascript
Points History - Raw Data: [...]
Points History - Transaction Count: X
Points History - Calculated Balances: [...]
```

### 3. Verify Display

**Check Summary Stats:**

- [ ] Total Earned = sum of all positive points
- [ ] Total Redeemed = sum of all negative points (shown as positive number)
- [ ] Net Balance = Total Earned - Total Redeemed

**Check Transaction Table:**

- [ ] Newest transaction at top
- [ ] Oldest transaction at bottom
- [ ] Running balance decreases as you go down (if looking at past)
- [ ] Running balance increases when points earned
- [ ] Running balance decreases when points redeemed

**Check Balance Column:**

- [ ] Last transaction (bottom) should show final balance
- [ ] Each row's balance = previous balance + current points
- [ ] Final balance should match "Net Balance" in summary

### 4. Test Filters

**Date Filters:**

- [ ] "All Time" shows all transactions
- [ ] "Last 7 Days" shows only recent ones
- [ ] "Last Month" shows transactions from last 30 days
- [ ] "Last Year" shows transactions from last 365 days

**Type Filters:**

- [ ] "All Types" shows everything
- [ ] "Earned" shows only EARNED transactions
- [ ] "Redeemed" shows only REDEEMED transactions
- [ ] "Birthday Bonus" shows only BIRTHDAY_BONUS transactions

**Note:** Summary stats always show totals for ALL transactions, regardless of filters.

### 5. Test Export

- [ ] Click "Export CSV" button
- [ ] File downloads with current date in filename
- [ ] CSV contains all filtered transactions
- [ ] Headers: Date, Type, Description, Points, Balance

---

## 📝 Summary of Changes

### Files Modified:

**`frontend/src/components/loyalty/PointsHistoryTable.tsx`**

1. **Changed:** `calculateRunningBalance` function

   - From: Regular function called every render
   - To: `React.useMemo` hook for performance

2. **Fixed:** Array mutation issue

   - From: `filteredTransactions.reverse()` (mutates)
   - To: `[...filteredTransactions].sort()` (creates copy)

3. **Added:** Debug logging
   - Raw data from API
   - Transaction count
   - Calculated balances

### Performance Improvements:

- ✅ Memoization prevents unnecessary recalculations
- ✅ No array mutations prevent side effects
- ✅ Proper dependency array ensures correct updates

---

## ✨ Result

**Before Fix:**

- ❌ Potential array mutation bugs
- ❌ Recalculating on every render
- ❌ No visibility into calculations

**After Fix:**

- ✅ No array mutations
- ✅ Memoized for performance
- ✅ Debug logging for troubleshooting
- ✅ Correct running balance calculation
- ✅ Proper chronological ordering

**The Points History table should now work correctly!** 🎉

If you still see issues, check the browser console logs to see what data is being received and how it's being
calculated.
