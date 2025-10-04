# 🎨 Customer Search & Creation - Quick Visual Guide

## Customer Search Section States

### 1️⃣ Empty State (Default)

```
╔══════════════════════════════════════════════╗
║ 👤 Customer Info              [➕ New]      ║
╠══════════════════════════════════════════════╣
║ [Enter phone number...  ] [🔍 Search]       ║
║                                              ║
║ ┌──────────────────────────────────────────┐ ║
║ │ 💡 Tip: Search for existing customer or │ ║
║ │        continue as guest                 │ ║
║ └──────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════╝
```

### 2️⃣ Customer Found (Success)

```
╔══════════════════════════════════════════════╗
║ 👤 Customer Info              [➕ New]      ║
╠══════════════════════════════════════════════╣
║ [1234567890           ] [🔍 Search]         ║
║                                              ║
║ ┌────────────────────────────────────────┐  ║
║ │ │ John Doe            [Member]      ✕ │  ║
║ │ │ 📞 +880 1234-567890                 │  ║
║ │ │ ⭐ 450 pts   ✉️ john@example.com    │  ║
║ └────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════╝
```

**Colors:** Green gradient background, green-500 left border

### 3️⃣ Customer Not Found (Warning)

```
╔══════════════════════════════════════════════╗
║ 👤 Customer Info              [➕ New]      ║
╠══════════════════════════════════════════════╣
║ [9999999999           ] [🔍 Search]         ║
║                                              ║
║ ┌────────────────────────────────────────┐  ║
║ │ ⚠️  Customer Not Found                 │  ║
║ │                                         │  ║
║ │ No customer registered with phone       │  ║
║ │ number 9999999999                       │  ║
║ │                                         │  ║
║ │ ┌─────────────────────────────────────┐ │  ║
║ │ │   ➕ Create New Customer            │ │  ║
║ │ └─────────────────────────────────────┘ │  ║
║ └────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════╝
```

**Colors:** Amber gradient background, amber-400 left border

---

## Customer Modal Sections

### Create New Customer Modal

```
╔═══════════════════════════════════════════════════╗
║  ┌──────┐  Create New Customer             ✕     ║
║  │  ➕  │  Add customer details for loyalty       ║
║  └──────┘  program                                ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ 📋 Required Information                     │ ║
║  ├─────────────────────────────────────────────┤ ║
║  │ Customer Name *                             │ ║
║  │ [Enter full name_____________________]      │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ 📞 Contact Details (Optional)               │ ║
║  ├─────────────────────────────────────────────┤ ║
║  │ Phone Number                                │ ║
║  │ [1234567890______________] [Pre-filled]     │ ║
║  │                                             │ ║
║  │ Email Address                               │ ║
║  │ [customer@example.com_______________]       │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ 🎂 Additional Info (Optional - for          │ ║
║  │                     birthday rewards)       │ ║
║  ├─────────────────────────────────────────────┤ ║
║  │ Date of Birth                               │ ║
║  │ [DD/MM/YYYY_______________________]         │ ║
║  │ 🎁 Customers receive bonus points on their │ ║
║  │    birthday!                                │ ║
║  │                                             │ ║
║  │ Address                                     │ ║
║  │ ┌─────────────────────────────────────────┐ │ ║
║  │ │ Street address, city, postal code...    │ │ ║
║  │ │                                         │ │ ║
║  │ └─────────────────────────────────────────┘ │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
║              [Cancel]  [➕ Create Customer]       ║
╚═══════════════════════════════════════════════════╝
```

### Edit Customer Modal

```
╔═══════════════════════════════════════════════════╗
║  ┌──────┐  Edit Customer                    ✕     ║
║  │  ✏️  │  Update customer information            ║
║  └──────┘                                          ║
╠═══════════════════════════════════════════════════╣
║  ... (Same sections as Create) ...                ║
║                                                   ║
║              [Cancel]  [💾 Update Customer]       ║
╚═══════════════════════════════════════════════════╝
```

---

## Color Guide

### Section Backgrounds

- 🔵 **Blue** (blue-50) = Required Information
- ⚪ **Gray** (gray-50) = Contact Details (Optional)
- 🟣 **Purple** (purple-50) = Additional Info (Optional)

### Status Indicators

- 🟢 **Green** (green gradient) = Customer Found
- 🟡 **Amber** (amber gradient) = Customer Not Found
- 🔵 **Blue** (blue-50) = Information/Tip

### Buttons

- 🔵 **Blue Gradient** = Create action
- 🟢 **Green Gradient** = Update action
- ⚪ **Gray Ghost** = Cancel action

---

## User Flow Example

### Scenario: New Customer Purchase

```
1. Cashier Types Phone
   ┌────────────────────────┐
   │ [9876543210] [Search] │
   └────────────────────────┘
           ↓
2. Not Found Alert
   ┌────────────────────────┐
   │ ⚠️  Customer Not Found │
   │ [➕ Create New]        │
   └────────────────────────┘
           ↓
3. Modal Opens (Phone Pre-filled)
   ┌────────────────────────┐
   │ Phone: [9876543210]   │
   │        [Pre-filled]    │
   └────────────────────────┘
           ↓
4. Cashier Enters Name
   ┌────────────────────────┐
   │ Name: [Jane Smith]     │
   └────────────────────────┘
           ↓
5. Click Create
   ┌────────────────────────┐
   │ [➕ Create Customer]   │
   └────────────────────────┘
           ↓
6. Success - Customer Assigned
   ┌────────────────────────┐
   │ │ Jane Smith [Member] │
   │ │ ⭐ 0 pts            │
   └────────────────────────┘
```

---

## Keyboard Shortcuts

| Key       | Action                                    |
| --------- | ----------------------------------------- |
| **Enter** | Search for customer (when in phone input) |
| **Esc**   | Close modal                               |
| **Tab**   | Navigate form fields                      |

---

## Tips for Cashiers

✅ **Press Enter** to search - no need to click button  
✅ **Click ✕** to clear customer and start over  
✅ **Quick create** - Use "New" button in corner  
✅ **Pre-filled phone** - Automatically populated from search  
✅ **Optional fields** - Only name is required, rest is optional  
✅ **Birthday rewards** - Add birthday to enable automatic bonuses

---

## Common Actions

### Add New Customer Quickly

1. Enter phone number
2. Press **Enter** or click **Search**
3. If not found, click **➕ Create New Customer**
4. Enter name (required)
5. Click **Create Customer**
6. Done! Customer is now assigned to sale

### Clear Customer from Sale

1. Click **✕** button on customer card
2. Customer removed, loyalty discount reset
3. Ready for new customer or guest checkout

### Update Existing Customer

1. Search and find customer
2. Navigate to Customers page to edit
3. Changes reflect immediately in POS

---

**Last Updated:** October 4, 2025  
**Version:** 2.0  
**Status:** ✅ Live
