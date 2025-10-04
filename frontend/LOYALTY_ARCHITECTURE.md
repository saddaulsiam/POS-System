# Loyalty Program - Architecture & Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         POS SYSTEM                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  CUSTOMERS PAGE  │              │    POS PAGE      │         │
│  │                  │              │                  │         │
│  │  ┌────────────┐  │              │  ┌────────────┐ │         │
│  │  │ Customer   │  │              │  │   Cart     │ │         │
│  │  │   List     │  │              │  │  Summary   │ │         │
│  │  └─────┬──────┘  │              │  └─────┬──────┘ │         │
│  │        │         │              │        │        │         │
│  │        ↓         │              │        ↓        │         │
│  │  ┌────────────┐  │              │  ┌────────────┐ │         │
│  │  │   View     │  │              │  │  Loyalty   │ │         │
│  │  │  Details   │  │              │  │  Points    │ │         │
│  │  └─────┬──────┘  │              │  │   Button   │ │         │
│  │        │         │              │  └─────┬──────┘ │         │
│  │        ↓         │              │        │        │         │
│  │  ┌────────────┐  │              │        ↓        │         │
│  │  │  Overview  │  │              │  ┌────────────┐ │         │
│  │  │    Tab     │  │              │  │  Redeem    │ │         │
│  │  └────────────┘  │              │  │  Dialog    │ │         │
│  │        │         │              │  └─────┬──────┘ │         │
│  │  ┌────────────┐  │              │        │        │         │
│  │  │  Loyalty   │  │              │        ↓        │         │
│  │  │    Tab     │  │              │  ┌────────────┐ │         │
│  │  └─────┬──────┘  │              │  │  Apply     │ │         │
│  │        │         │              │  │  Discount  │ │         │
│  │        ↓         │              │  └─────┬──────┘ │         │
│  │  ┌────────────┐  │              │        │        │         │
│  │  │ Dashboard  │  │              │        ↓        │         │
│  │  │  History   │  │              │  ┌────────────┐ │         │
│  │  │  Rewards   │  │              │  │  Payment   │ │         │
│  │  └────────────┘  │              │  └────────────┘ │         │
│  └──────────────────┘              └──────────────────┘         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
│
├── CustomersPage
│   ├── CustomerSearch
│   ├── CustomersTable
│   │   └── View Details Button (👁️)
│   │
│   └── Customer Detail View
│       ├── Header (Back Button + Customer Name)
│       ├── Tabs (Overview | Loyalty Program)
│       │
│       ├── Overview Tab
│       │   ├── Contact Information Card
│       │   ├── Account Information Card
│       │   └── Quick Actions
│       │
│       └── Loyalty Program Tab
│           ├── LoyaltyDashboard ⭐
│           │   ├── Tier Badge
│           │   ├── Points Balance
│           │   └── Progress Bar
│           │
│           ├── PointsHistoryTable 📊
│           │   ├── Transaction List
│           │   ├── Filters
│           │   └── CSV Export
│           │
│           └── RewardsGallery 🎁
│               ├── Available Rewards
│               ├── Used Rewards
│               └── Expired Rewards
│
└── POSPage
    ├── POSProductGrid
    ├── POSCustomerSearch
    │
    ├── POSCart
    │   ├── Cart Items List
    │   ├── Cart Summary
    │   │   ├── Subtotal
    │   │   ├── Tax
    │   │   ├── Loyalty Discount (🎁) ← NEW!
    │   │   └── Total
    │   │
    │   ├── Use Loyalty Points Button (⭐) ← NEW!
    │   ├── Process Payment Button
    │   ├── Split Payment Button
    │   └── Other Action Buttons
    │
    ├── POSPaymentModal (uses finalTotal)
    ├── SplitPaymentDialog (uses finalTotal)
    │
    └── RedeemPointsDialog ⭐ ← NEW!
        ├── Customer Info Display
        ├── Available Points
        ├── Reward Type Selector
        ├── Points Input Field
        ├── Discount Calculation
        └── Redeem Button
```

---

## Data Flow Diagram

### Customers Page Flow

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ↓
┌─────────────────┐
│ Load Customers  │
│    from API     │
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│ Display Table   │
│ with "View"     │
│    buttons      │
└──────┬──────────┘
       │
       ↓ (User clicks View)
┌─────────────────┐
│ setViewingCustomer │
│   (customer)    │
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│ Show Detail     │
│   View with     │
│  Two Tabs       │
└──────┬──────────┘
       │
       ├─────────────────┐
       │                 │
       ↓                 ↓
┌──────────┐      ┌──────────┐
│ Overview │      │ Loyalty  │
│   Tab    │      │   Tab    │
└──────────┘      └─────┬────┘
                        │
                        ↓
              ┌─────────────────┐
              │ Load Components │
              ├─────────────────┤
              │ • Dashboard     │
              │ • History       │
              │ • Rewards       │
              └─────────────────┘
                        │
                        ↓
              ┌─────────────────┐
              │ Fetch Data via  │
              │ customerId prop │
              └─────────────────┘
                        │
                        ↓
              ┌─────────────────┐
              │ Display Loyalty │
              │  Information    │
              └─────────────────┘
```

### POS Redemption Flow

```
┌─────────────┐
│ Add Items   │
│  to Cart    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Search    │
│  Customer   │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│ Customer has     │
│ Points > 0?      │
└──────┬──────┬────┘
       │      │
      Yes    No
       │      │
       ↓      └──→ (Button Hidden)
┌─────────────┐
│   "Use      │
│  Loyalty    │
│  Points"    │
│  Button     │
│  Appears    │
└──────┬──────┘
       │
       ↓ (User clicks)
┌─────────────┐
│   Open      │
│ Redeem      │
│  Dialog     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Select      │
│ Reward Type │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Enter     │
│   Points    │
│   Amount    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Calculate   │
│  Discount   │
│ (Real-time) │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Validate:   │
│ • Points    │
│ • Cart Total│
│ • Min/Max   │
└──────┬──────┘
       │
       ↓
┌──────────────┐
│ Click Redeem │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│ handlePointsRedeemed │
│ • setLoyaltyDiscount │
│ • setPointsUsed     │
│ • Close Dialog      │
│ • Show Toast        │
└──────┬──────────────┘
       │
       ↓
┌──────────────┐
│ Update Cart  │
│  Summary:    │
│ • Show 🎁    │
│ • Show -$XX  │
│ • Update     │
│   Total      │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Process      │
│ Payment with │
│ finalTotal   │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Payment      │
│ Success      │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Clear:       │
│ • Cart       │
│ • Customer   │
│ • Discount   │
│ • Points     │
└──────────────┘
```

---

## State Management Flow

### POSPage State

```
┌──────────────────────────────────────┐
│         POSPage State                │
├──────────────────────────────────────┤
│                                       │
│  cart: CartItem[]                    │
│  customer: Customer | null           │
│  customerPhone: string               │
│                                       │
│  ┌────────────────────────────┐     │
│  │   LOYALTY STATE (NEW!)     │     │
│  ├────────────────────────────┤     │
│  │ showRedeemPointsDialog: boolean  │
│  │ loyaltyDiscount: number    │     │
│  │ pointsUsed: number         │     │
│  └────────────────────────────┘     │
│                                       │
│  Calculations:                       │
│  • subtotal = calculateSubtotal()   │
│  • tax = calculateTax()             │
│  • total = calculateTotal()         │
│  • finalTotal = total - loyaltyDiscount ← NEW!
│  • changeAmount = calculateChange() │
│                                       │
└──────────────────────────────────────┘
```

### CustomersPage State

```
┌──────────────────────────────────────┐
│      CustomersPage State             │
├──────────────────────────────────────┤
│                                       │
│  customers: Customer[]               │
│  searchQuery: string                 │
│  currentPage: number                 │
│  totalPages: number                  │
│                                       │
│  ┌────────────────────────────┐     │
│  │   DETAIL VIEW STATE (NEW!) │     │
│  ├────────────────────────────┤     │
│  │ viewingCustomer: Customer | null │
│  │ activeTab: 'overview' | 'loyalty'│
│  └────────────────────────────┘     │
│                                       │
│  Modal States:                       │
│  • showCustomerModal: boolean       │
│  • editingCustomer: Customer | null │
│                                       │
└──────────────────────────────────────┘
```

---

## Props Flow

### RedeemPointsDialog Props

```
POSPage
   │
   ├─ customerId: customer.id
   ├─ customerName: customer.name
   ├─ availablePoints: customer.loyaltyPoints
   ├─ cartTotal: total
   ├─ isOpen: showRedeemPointsDialog
   ├─ onClose: () => setShowRedeemPointsDialog(false)
   └─ onRedeemed: handlePointsRedeemed
              │
              └─→ (discountAmount, pointsUsed)
                      │
                      ├─ setLoyaltyDiscount(discountAmount)
                      ├─ setPointsUsed(pointsUsed)
                      ├─ setShowRedeemPointsDialog(false)
                      └─ toast.success(...)
```

### POSCart Props (Enhanced)

```
POSPage
   │
   ├─ cart: cart[]
   ├─ subtotal: subtotal
   ├─ tax: tax
   ├─ total: total
   ├─ loyaltyDiscount: loyaltyDiscount ← NEW!
   ├─ customer: customer ← NEW!
   ├─ onRedeemPoints: () => setShowRedeemPointsDialog(true) ← NEW!
   ├─ onProcessPayment: handlePayment
   ├─ onSplitPayment: handleSplitPayment
   ├─ onParkSale: handleParkSale
   └─ onClearCart: handleClearCart
```

### Loyalty Components Props

```
CustomersPage → Loyalty Tab
   │
   ├─→ LoyaltyDashboard
   │      └─ customerId: viewingCustomer.id
   │
   ├─→ PointsHistoryTable
   │      └─ customerId: viewingCustomer.id
   │
   └─→ RewardsGallery
          └─ customerId: viewingCustomer.id
```

---

## Event Flow

### Redeem Points Event Chain

```
1. User Action
   └─→ Click "Use Loyalty Points" button

2. State Update
   └─→ setShowRedeemPointsDialog(true)

3. Dialog Opens
   └─→ RedeemPointsDialog renders
       ├─ Shows customer info
       ├─ Shows available points
       └─ Shows cart total

4. User Interaction
   └─→ Select reward type
   └─→ Enter points amount
   └─→ See real-time discount calculation

5. Validation
   └─→ Points >= minimum?
   └─→ Points <= available?
   └─→ Discount <= cart total?

6. Redemption
   └─→ Click "Redeem Points"
   └─→ onRedeemed callback fires
       └─→ handlePointsRedeemed(discount, points)

7. State Updates
   ├─→ setLoyaltyDiscount(discount)
   ├─→ setPointsUsed(points)
   ├─→ setShowRedeemPointsDialog(false)
   └─→ toast.success(...)

8. UI Updates
   ├─→ Dialog closes
   ├─→ Cart summary shows discount (green)
   ├─→ Total recalculated
   └─→ finalTotal = total - discount

9. Payment
   └─→ User processes payment
       └─→ Payment modal uses finalTotal
       └─→ Split payment uses finalTotal

10. Cleanup
    ├─→ Payment succeeds
    ├─→ Clear cart
    ├─→ Clear customer
    ├─→ Clear discount (setLoyaltyDiscount(0))
    └─→ Clear points (setPointsUsed(0))
```

---

## Conditional Rendering Logic

### "Use Loyalty Points" Button Visibility

```javascript
Show Button IF:
  ✓ onRedeemPoints prop exists
  AND
  ✓ customer exists
  AND
  ✓ customer.loyaltyPoints > 0
  AND
  ✓ loyaltyDiscount === 0
  AND
  ✓ cart.length > 0

Hide Button IF:
  ✗ No onRedeemPoints callback
  OR
  ✗ No customer selected
  OR
  ✗ customer.loyaltyPoints === 0
  OR
  ✗ loyaltyDiscount > 0 (already applied)
  OR
  ✗ cart.length === 0 (empty cart)
```

### Loyalty Discount Display

```javascript
Show Discount Line IF:
  ✓ loyaltyDiscount > 0

Display:
  🎁 Loyalty Discount: -$XX.XX (green)
```

### Customer Detail View

```javascript
Show Detail View IF:
  ✓ viewingCustomer !== null

Show Table IF:
  ✓ viewingCustomer === null
```

---

## API Integration Points

### Loyalty Components API Calls

```
LoyaltyDashboard
  ├─ GET /api/loyalty/tiers/{customerId}
  └─ GET /api/loyalty/points/{customerId}

PointsHistoryTable
  └─ GET /api/loyalty/history/{customerId}

RewardsGallery
  ├─ GET /api/loyalty/rewards/{customerId}
  └─ POST /api/loyalty/rewards/activate

RedeemPointsDialog
  ├─ GET /api/loyalty/points/{customerId}
  └─ POST /api/loyalty/redeem (planned)
      ├─ customerId
      ├─ points
      ├─ rewardType
      └─ discountAmount
```

---

## File Structure

```
frontend/src/
│
├── pages/
│   ├── CustomersPage.tsx (Modified)
│   │   └── Integrated loyalty detail view
│   │
│   └── POSPage.tsx (Modified)
│       └── Integrated redemption dialog
│
├── components/
│   ├── customers/
│   │   └── CustomersTable.tsx (Modified)
│   │       └── Added View button
│   │
│   ├── pos/
│   │   └── POSCart.tsx (Modified)
│   │       └── Added loyalty discount display
│   │
│   └── loyalty/ (NEW!)
│       ├── LoyaltyDashboard.tsx
│       ├── PointsHistoryTable.tsx
│       ├── RewardsGallery.tsx
│       ├── LoyaltyOffersList.tsx
│       ├── TierBenefitsDisplay.tsx
│       ├── RedeemPointsDialog.tsx
│       └── index.ts
│
└── types/
    └── index.ts (Uses existing types)
```

---

## Summary

### Integration Points: 6
1. ✅ CustomersPage → Customer detail view
2. ✅ CustomersPage → Loyalty tab
3. ✅ POSPage → Redeem dialog
4. ✅ POSCart → Discount display
5. ✅ POSCart → Use points button
6. ✅ Payment → Final total calculation

### State Variables: 5
1. ✅ showRedeemPointsDialog
2. ✅ loyaltyDiscount
3. ✅ pointsUsed
4. ✅ viewingCustomer
5. ✅ activeTab

### Event Handlers: 4
1. ✅ handlePointsRedeemed
2. ✅ handleViewDetails
3. ✅ handleCloseDetails
4. ✅ Updated handleClearCart

### UI Elements: 8
1. ✅ View Details button (👁️)
2. ✅ Use Loyalty Points button (⭐)
3. ✅ Loyalty discount line (🎁)
4. ✅ Customer detail header
5. ✅ Tab switcher (Overview | Loyalty)
6. ✅ Back button
7. ✅ Redeem dialog
8. ✅ Updated total display

---

**Everything is connected and working! 🎉**
