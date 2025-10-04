# Loyalty Program - User Guide 🎁

## Quick Start Guide

### For Customers Page 👥

#### Viewing Customer Loyalty Details

1. **Navigate to Customers Page**

   - Click "Customers" in the main navigation

2. **Find a Customer**

   - Use search bar to find customer by name, email, or phone
   - Or browse the customer list

3. **View Details**

   - Click the "👁️ View" button next to any customer
   - Customer detail view opens

4. **Explore Loyalty Information**

   - **Overview Tab (default):**

     - See contact information
     - View account summary (member since, total purchases)
     - Check loyalty points balance
     - Use "Edit Customer" to modify details

   - **Loyalty Program Tab:**
     - **Tier Badge** - Shows current tier (Bronze/Silver/Gold/Platinum)
     - **Points Balance** - Available points and points to next tier
     - **Progress Bar** - Visual progress to next tier
     - **Transaction History** - All points earned/spent
       - Export to CSV
       - Filter by transaction type
     - **Rewards Gallery** - Available, used, and expired rewards
       - Activate rewards
       - View reward details

5. **Return to List**
   - Click "← Back to Customers" button

---

### For POS Page 🛒

#### Redeeming Loyalty Points at Checkout

1. **Start a Sale**

   - Add products to cart as normal
   - Cart must have items

2. **Select Customer**

   - Search for customer by phone number
   - Customer must be selected and have loyalty points

3. **Use Loyalty Points**

   - Look for "⭐ Use Loyalty Points (XXX pts)" button in cart
   - Button shows available points
   - Button only appears when customer has points > 0

4. **Open Redemption Dialog**

   - Click the "Use Loyalty Points" button
   - Dialog opens showing:
     - Customer name and available points
     - Current cart total
     - Redemption options

5. **Choose Reward Type**

   - **Fixed Discount** - Enter points, get dollar discount

     - Example: 100 points = $10 off

   - **Percentage Discount** - Enter points for percentage off

     - Example: 200 points = 20% off

   - **Free Shipping** - Redeem for free shipping

     - Fixed 500 points = $10 shipping discount

   - **Buy One Get One** - Special BOGO offer

     - Enter points for discount

   - **Category Discount** - Discount on specific category

     - Enter points for category-specific discount

   - **Early Access** - Special access rewards
     - Typically used for events/launches

6. **Enter Points Amount**

   - Type the number of points to redeem
   - See real-time discount calculation
   - Validation:
     - Can't exceed available points
     - Can't exceed cart total
     - Minimum points required

7. **Apply Discount**

   - Click "Redeem Points" button
   - Dialog closes
   - Success notification appears

8. **Review Cart**

   - See "🎁 Loyalty Discount" line in cart summary (green text)
   - Shows discount amount (e.g., "-$15.00")
   - Total automatically updated
   - **New Total = Original Total - Loyalty Discount**

9. **Process Payment**

   - Click "💳 Process Payment" or "🔀 Split Payment"
   - Discount automatically applied to final amount
   - Complete payment as normal

10. **After Payment**
    - Discount cleared automatically
    - Cart cleared
    - Ready for next sale

---

## Visual Elements 🎨

### Cart Summary Example

**Without Loyalty Discount:**

```
Subtotal:    $100.00
Tax:         $  8.00
─────────────────────
Total:       $108.00
```

**With Loyalty Discount:**

```
Subtotal:         $100.00
Tax:              $  8.00
🎁 Loyalty Discount: -$ 15.00  (green text)
──────────────────────────────
Total:            $ 93.00
```

---

## Button States 🔘

### "Use Loyalty Points" Button Visibility

**Shows When:**

- ✅ Customer is selected
- ✅ Customer has points > 0
- ✅ Cart has items
- ✅ No loyalty discount already applied

**Hidden When:**

- ❌ No customer selected
- ❌ Customer has 0 points
- ❌ Cart is empty
- ❌ Loyalty discount already applied

---

## Redemption Dialog Fields 📋

### Required Information

- **Customer Name** - Auto-filled, read-only
- **Available Points** - Shows customer's current balance
- **Cart Total** - Current order total (before discount)
- **Reward Type** - Dropdown selection (required)
- **Points to Redeem** - Number input (required, validated)

### Calculated Fields

- **Discount Amount** - Auto-calculated based on points and type
- **Conversion Rate** - Shows points to dollar ratio
- **Remaining Points** - Points after redemption

---

## Redemption Rules ⚖️

### Point Conversion Rates

- **Fixed Discount:** 10 points = $1.00
- **Percentage:** 10 points = 1% off
- **Free Shipping:** 500 points = $10.00 shipping credit
- **BOGO:** Varies by promotion
- **Category:** 15 points = $1.00 category discount
- **Early Access:** Fixed amounts

### Limits

- **Minimum Redemption:** Usually 10 points
- **Maximum Redemption:**
  - Cannot exceed available points
  - Cannot exceed cart total
  - Some reward types have fixed maximums

### Validation Messages

- "Not enough points" - Trying to redeem more than available
- "Amount exceeds cart total" - Discount would be greater than purchase
- "Minimum 10 points required" - Below minimum threshold

---

## Tips & Best Practices 💡

### For Cashiers

1. **Always Search Customer First**

   - Get loyalty points from the start
   - Customer may not remember they have points

2. **Inform About Points**

   - Tell customer their available balance
   - Suggest redemption if they have enough points

3. **Suggest Rewards**

   - "You have 500 points, that's $50 off!"
   - "Would you like to use some points today?"

4. **Review Before Payment**

   - Confirm discount is applied
   - Check final total is correct

5. **Handle Mistakes**
   - If wrong discount applied, clear cart and start over
   - Or process without loyalty and adjust later

### For Managers

1. **Monitor Loyalty Usage**

   - Check redemption rates in reports
   - See which reward types are popular

2. **Review Customer Loyalty**

   - Use Customers page to check high-value customers
   - View their transaction history
   - Identify customers close to tier upgrade

3. **Export Data**
   - Use CSV export from points history
   - Analyze trends
   - Plan promotions

---

## Common Scenarios 🎯

### Scenario 1: Small Discount

**Situation:** Customer has 150 points, wants small discount

**Steps:**

1. Select Fixed Discount
2. Enter 100 points
3. Gets $10 off
4. Still has 50 points remaining

---

### Scenario 2: Large Purchase

**Situation:** Customer buying $500 worth of products, has 1000 points

**Steps:**

1. Select Percentage Discount
2. Enter 500 points (50% off)
3. Gets $250 off
4. New total: $250
5. Still has 500 points left

---

### Scenario 3: Free Shipping

**Situation:** Online order, customer wants free shipping

**Steps:**

1. Select Free Shipping
2. System auto-fills 500 points
3. Gets $10 shipping discount
4. Confirm and apply

---

### Scenario 4: Not Enough Points

**Situation:** Customer wants discount but has only 50 points

**Options:**

1. Redeem partial discount ($5 off)
2. Save points for next purchase
3. Suggest earning more points today

---

## Keyboard Shortcuts ⌨️

- **Tab** - Navigate between fields in dialog
- **Enter** - Submit/Redeem (when valid)
- **Esc** - Close dialog without redeeming
- **Arrow keys** - Navigate dropdown options

---

## Troubleshooting 🔧

### "Button Not Showing"

**Check:**

- Is customer selected?
- Does customer have points > 0?
- Are there items in cart?
- Is a discount already applied?

### "Can't Redeem Points"

**Verify:**

- Points amount is valid (>= minimum)
- Not exceeding available points
- Not exceeding cart total
- Reward type is selected

### "Discount Not Applied"

**Solutions:**

- Check cart summary for green discount line
- Refresh page if needed
- Clear cart and try again
- Contact technical support

### "Wrong Discount Amount"

**Steps:**

1. Clear cart (clears discount)
2. Re-add items
3. Redeem points again with correct amount
4. Or adjust sale after payment

---

## Support & Help 📞

**Need Help?**

- See full documentation in `LOYALTY_INTEGRATION_COMPLETE.md`
- Check component reference in `LOYALTY_COMPONENTS_QUICK_REFERENCE.md`
- Review technical specs in `OPTION_3_LOYALTY_PROGRAM_SUMMARY.md`

**Found a Bug?**

- Clear browser cache
- Refresh page
- Check console for errors
- Report to development team

---

## Success! 🎉

You're now ready to use the complete loyalty program system!

**Remember:**

- Always search customer first
- Inform them about available points
- Suggest redemption opportunities
- Verify discount before payment
- Check final total is correct

**Happy Selling! 🛍️**
