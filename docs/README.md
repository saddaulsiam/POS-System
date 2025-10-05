# 📚 POS System - User Guide# 📚 POS System Documentation

Complete guide for using the Grocery Store POS System.Welcome to the comprehensive documentation for the Grocery Store
POS System.

---**Last Updated:** October 5, 2025

**Status:** Production Ready ✅

## 🚀 Quick Start

---

### Installation

## 🚀 Essential Documentation

````bash

# 1. Clone and installStart here for quick access to everything you need:

git clone https://github.com/saddaulsiam/POS-System.git

cd POS-System### 📖 Core Guides

npm install

npm run install:all1. **[QUICK_START.md](./QUICK_START.md)** - 🏁 Get up and running in 5 minutes

   - Installation steps

# 2. Setup database   - First-time setup

npm run db:migrate   - Default credentials

npm run db:seed   - Common commands



# 3. Start the system2. **[FEATURES.md](./FEATURES.md)** - ⭐ Complete feature guide

npm run dev   - POS System

```   - Inventory Management

   - Customer Management

### Access the System   - Loyalty Program

   - Analytics & Reports

- **Frontend:** http://localhost:3000

- **Backend API:** http://localhost:50003. **[API_REFERENCE.md](./API_REFERENCE.md)** - 🌐 Complete API documentation

- **Database Studio:** http://localhost:5555 (run `npm run db:studio`)   - All endpoints

   - Request/response examples

### Default Login   - Authentication

   - Error handling

**Admin:**

- Username: `admin`4. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - 🔧 Common issues & solutions

- PIN: `1234`   - Installation problems

   - Database issues

**Cashier:**   - API errors

- Username: `cashier`   - UI bugs

- PIN: `5678`

5. **[CHANGELOG.md](./CHANGELOG.md)** - 📝 Recent updates

---   - Latest changes

   - Bug fixes

## 💡 How to Use   - New features

   - Version history

### For Cashiers - POS Interface

---

1. **Login** at http://localhost:3000

   - Enter username and PIN## 📁 Documentation Structure



2. **Process a Sale:**```

   - Search products (by name or scan barcode)docs/

   - Click products to add to cart├── README.md              ⭐ You are here

   - Adjust quantities if needed├── QUICK_START.md         🏁 Setup guide

   - Select customer (optional - for loyalty points)├── API_REFERENCE.md       🌐 API documentation

   - Choose payment method (Cash/Card/Mobile)├── FEATURES.md            ⭐ Feature guide

   - Enter amount paid├── TROUBLESHOOTING.md     🔧 Common issues

   - Click "Complete Sale"├── CHANGELOG.md           📝 Updates

   - Print receipt├── CLEANUP_SUMMARY.md     📊 Cleanup report

└── archive/               📦 Archived docs

3. **Customer Lookup:**    ├── INDEX.md

   - Click "Add Customer" button    ├── old-docs/          Previous documentation

   - Search by name or phone    └── fixes-history/     Historical fixes

   - Select customer to apply loyalty benefits```



### For Managers/Admin - Dashboard---



1. **Login** at http://localhost:3000/admin## 🎯 Quick Links by Role

   - Use admin credentials

### 👨‍💻 Developers

2. **Main Dashboard:**- Start with **[QUICK_START.md](./QUICK_START.md)** for setup

   - View today's sales- Read **[API_REFERENCE.md](./API_REFERENCE.md)** for backend

   - See customer count- Check **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for issues

   - Monitor inventory status

   - Check top products### 👥 End Users

- Read **[FEATURES.md](./FEATURES.md)** to learn features

3. **Product Management:**- Check **[CHANGELOG.md](./CHANGELOG.md)** for updates

   - Admin → Products

   - Add/Edit/Delete products### 🏢 Business Owners

   - Set prices and stock levels- Review **[FEATURES.md](./FEATURES.md)** for capabilities

   - Upload product images- See **[CHANGELOG.md](./CHANGELOG.md)** for improvements

   - Assign categories

---

4. **Customer Management:**

   - Admin → Customers## 📦 Archived Documentation

   - Add/Edit customer profiles

   - View purchase historyPrevious documentation (110+ files) has been archived to `archive/` folder:

   - Manage loyalty points

   - Track birthday rewards- **[archive/INDEX.md](./archive/INDEX.md)** - Archive navigation

- **archive/old-docs/** - Previous organization structure

5. **Inventory:**- **archive/fixes-history/** - Historical bug fixes and updates

   - Admin → Inventory

   - View stock levelsTo access archived content, see the archive folder or restore from backup: `docs-backup-20251005-175013/`

   - Adjust stock (add/remove)

   - Set low stock alerts---

   - Track inventory value

## 🔍 Finding Information

6. **Reports:**

   - Admin → Reports/Analytics### By Topic

   - Daily sales reports

   - Employee performance| Topic | Document |

   - Product performance|-------|----------|

   - Date range reports| Installation | [QUICK_START.md](./QUICK_START.md) |

   - Export to CSV| API Endpoints | [API_REFERENCE.md](./API_REFERENCE.md) |

| Features | [FEATURES.md](./FEATURES.md) |

7. **Settings:**| Problems | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |

   - Admin → Settings| Updates | [CHANGELOG.md](./CHANGELOG.md) |

   - Currency settings| Loyalty Program | [FEATURES.md#loyalty-program](./FEATURES.md#loyalty-program) |

   - Tax configuration| Product Variants | [FEATURES.md#product-variants](./FEATURES.md#product-variants) |

   - Store information| Currency System | [FEATURES.md#currency-system](./FEATURES.md#currency-system) |

   - Loyalty program settings

---

---

## 📊 Cleanup Summary

## ⭐ Key Features

**Cleanup Date:** October 5, 2025

### 1. POS System

- Fast checkout process- **Files Archived:** 110+

- Barcode scanning support- **Folders Archived:** 5

- Multiple payment methods (Cash, Card, Mobile, Loyalty Points)- **Files Remaining:** 6 essential guides

- Receipt printing- **Backup Location:** `docs-backup-20251005-175013/`

- Customer lookup during checkout

- Real-time inventory updates**Benefits:**

- 🎯 Simpler navigation (6 files vs 110+)

### 2. Product Management- 📖 Easier to find information

- Unlimited products- 🔍 Less duplication

- Product categories- 👥 Better for new users

- Product images

- Price and cost tracking---

- Stock management

- Barcode support## 🚀 Quick Start

- **Product Variants** - Different sizes, colors, flavors per product

```bash

### 3. Customer Management# Clone repository

- Customer profiles (name, phone, email, birthday)git clone https://github.com/saddaulsiam/POS-System.git

- Purchase historycd POS-System

- Loyalty points tracking

- Quick search# Install dependencies

- Birthday field for rewardsnpm install

npm run install:all

### 4. Loyalty Program

- **3 Tiers:** Bronze, Silver, Gold# Setup database

  - Bronze (0-499 points): 1x multipliernpm run db:migrate

  - Silver (500-999 points): 1.2x multipliernpm run db:seed

  - Gold (1000+ points): 1.5x multiplier

- Earn points on every purchase# Start development servers

- Redeem points for discountsnpm run dev

- Automatic tier upgrades```

- Configurable point rates

**Access the app:**

### 5. Birthday Rewards- Frontend: http://localhost:3000

- Automatic daily check for customer birthdays- Backend: http://localhost:5000

- Auto-award bonus points on birthdays- Admin login: `admin` / `1234`

- Email notifications

- Birthday badge shown to cashiers (🎂)**For detailed setup, see [QUICK_START.md](./QUICK_START.md)**

- Configurable reward amount

---

### 6. Inventory Tracking

- Real-time stock updates## 📚 Documentation Index

- Low stock alerts

- Stock adjustment history### Core Documentation

- Inventory value reporting- [README.md](./README.md) - This file

- Out of stock tracking- [QUICK_START.md](./QUICK_START.md) - Installation & setup

- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation

### 7. Reports & Analytics- [FEATURES.md](./FEATURES.md) - Features guide

- **Daily Sales:** Today's performance- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

- **Sales Range:** Custom date periods- [CHANGELOG.md](./CHANGELOG.md) - Recent updates

- **Employee Performance:** Sales by cashier

- **Product Performance:** Best sellers### Administrative

- **Inventory Reports:** Stock value and levels- [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) - Documentation cleanup report

- Interactive charts and graphs

- Export to CSV/Excel### Archived

- [archive/](./archive/) - Previous documentation (110+ files)

### 8. Multi-Currency Support  - [archive/INDEX.md](./archive/INDEX.md) - Archive navigation

- Support for USD, BDT, EUR, GBP, etc.  - [archive/old-docs/](./archive/old-docs/) - Old structure

- Custom currency symbols (৳, $, €, £)  - [archive/fixes-history/](./archive/fixes-history/) - Historical fixes

- Symbol position (before/after)

- Configurable decimal places---

- English numerals (0-9) always used

## 🆘 Getting Help

### 9. User Management

- **Roles:** Admin, Manager, Cashier### Find Answers

- **Admin:** Full access

- **Manager:** Reports and inventory (no user management)1. **Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for common issues

- **Cashier:** Sales and customer lookup only2. **Search this documentation** for your topic

- PIN-based login for fast access3. **Check archived docs** if looking for historical information

- Session management4. **Create a GitHub issue** for bugs or feature requests



### 10. Hardware Integration### Documentation Tips

- USB/Bluetooth barcode scanners

- Thermal receipt printers- Use Ctrl+F to search within documents

- Electronic scales (for weighted items)- Check the table of contents in each guide

- Cash drawers- Related documents are linked at the bottom of each page

- Card payment terminals- Archive contains detailed historical documentation



------



## 🎯 Common Tasks## 🔄 Maintenance



### Add a New Product### Keeping Documentation Updated

1. Admin → Products → "Add Product"

2. Enter name, barcode, price, cost- **Add to CHANGELOG.md** when making changes

3. Set stock quantity- **Update FEATURES.md** for new features

4. Choose category- **Update API_REFERENCE.md** for API changes

5. Upload image (optional)- **Update TROUBLESHOOTING.md** for new issues/solutions

6. Set low stock threshold

7. Click "Save"### Backup



### Process a Return/RefundOriginal documentation backup: `docs-backup-20251005-175013/`

1. Admin → Sales

2. Find the sale---

3. Click "Refund"

4. Select items to return## 📝 Contributing

5. Choose refund method

6. Confirm refundWhen adding documentation:



### Add a Customer1. Use clear, concise language

1. POS or Admin → Customers → "Add Customer"2. Include code examples where helpful

2. Enter name (required)3. Add to the appropriate core document

3. Add phone, email, birthday (optional)4. Update this README if adding new sections

4. Click "Save"5. Keep formatting consistent

5. Customer gets loyalty account automatically

---

### Award Loyalty Points Manually

1. Admin → Customers## ✨ Recent Changes

2. Find customer

3. Click "Adjust Points"**October 5, 2025:**

4. Enter points to add/remove- ✅ Cleaned up documentation structure

5. Add reason- ✅ Created 5 essential core guides

6. Click "Save"- ✅ Archived 110+ previous docs

- ✅ Improved navigation and findability

### View Reports

1. Admin → Analytics or ReportsFor full change history, see [CHANGELOG.md](./CHANGELOG.md)

2. Select date range

3. View charts and tables---

4. Click "Export" for CSV

**Happy coding! 🚀**

### Change Currency

1. Admin → SettingsFor questions or issues, please create a GitHub issue.

2. Select currency from dropdown
3. Choose symbol position
4. Set decimal places
5. Click "Save"
6. All prices update automatically

### Configure Birthday Rewards
1. Admin → Settings → Loyalty
2. Enable birthday rewards
3. Set reward points amount (default: 500)
4. Configure email template
5. Scheduler runs automatically at midnight

---

## 🔧 Troubleshooting

### Can't Login
- Check username and PIN are correct
- Default admin: `admin` / `1234`
- Default cashier: `cashier` / `5678`
- Reset database if needed: `npm run db:reset`

### Products Not Showing
- Check if products exist: `npm run db:studio`
- Reseed database: `npm run db:seed`
- Check backend is running on port 5000

### Port Already in Use
```bash
# Kill port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
````

### Database Issues

```bash
# Reset database (deletes all data!)
npm run db:reset

# Or just migrate
npm run db:migrate
```

### Frontend Not Connecting to Backend

1. Make sure backend is running (port 5000)
2. Check browser console (F12) for errors
3. Verify `backend/.env` has correct settings

### Barcode Scanner Not Working

1. Test scanner in notepad first
2. Scanner should be in keyboard emulation mode
3. Check USB connection
4. Ensure scanner sends Enter after barcode

---

## 🛠️ Maintenance

### Database Commands

```bash
npm run db:studio      # Browse database
npm run db:migrate     # Apply migrations
npm run db:reset       # Reset database (⚠️ deletes data)
npm run db:seed        # Add sample data
```

### Development Commands

```bash
npm run dev            # Start both servers
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
```

### Production Build

```bash
npm run build          # Build frontend
npm start              # Start production server
```

---

## 📱 Technology Stack

**Frontend:**

- React + TypeScript
- Tailwind CSS
- Vite
- React Query
- Recharts (for analytics)

**Backend:**

- Node.js + Express
- Prisma ORM
- SQLite (dev) / PostgreSQL (prod)
- JWT Authentication

---

## 🆘 Need Help?

1. **Check this guide** for common tasks
2. **Inspect browser console** (F12) for errors
3. **Check backend logs** for API errors
4. **Reset database** if data is corrupted
5. **Create GitHub issue** for bugs

---

## 📋 Keyboard Shortcuts (POS)

- `F1` - Focus product search
- `F2` - Customer lookup
- `F3` - Apply discount
- `F4` - Process payment
- `ESC` - Clear cart

---

**🎉 That's it! You're ready to use the POS System.**

For more details, check the code or create a GitHub issue.
