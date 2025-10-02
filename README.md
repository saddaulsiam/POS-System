# Grocery Store POS System

A fully functional grocery store Point of Sale (POS) system built with modern web technologies.

## Features

### Core POS Features

- **Intuitive POS Interface**: Fast and responsive checkout interface optimized for touchscreens
- **Barcode Scanning**: Support for 1D/2D barcode scanning
- **Weighted Items**: Integration with electronic scales for produce and bulk items
- **Multiple Payment Methods**: Cash, credit/debit cards, and mobile payments
- **Receipt Generation**: Physical and digital receipt options
- **Returns & Refunds**: Easy return processing with inventory adjustment

### Inventory Management

- **Real-time Stock Tracking**: Automatic inventory updates on sales and receiving
- **Low Stock Alerts**: Automated notifications for reorder points
- **Product Management**: Complete product catalog with categories, suppliers, and pricing
- **Purchase Orders**: Create and track supplier orders
- **Stock Receiving**: Simple interface for updating inventory on deliveries

### Customer Management

- **Customer Profiles**: Store customer information and purchase history
- **Loyalty Program**: Points-based rewards system
- **Customer Lookup**: Quick customer search by phone or name

### Reporting & Analytics

- **Real-time Dashboard**: Live sales data and performance metrics
- **End-of-Day Reports**: Complete sales summaries and cash reconciliation
- **Product Performance**: Analyze best-selling and most profitable items
- **Inventory Reports**: Stock value, turnover rates, and dead stock analysis

### User Management

- **Role-Based Access**: Admin, Manager, and Cashier roles with appropriate permissions
- **Employee Performance**: Track sales performance by cashier
- **Secure Authentication**: PIN-based login for POS terminals

## Technology Stack

### Frontend

- **React** with TypeScript for type safety
- **Tailwind CSS** for responsive design
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Recharts** for data visualization

### Backend

- **Node.js** with Express.js
- **Prisma ORM** for database management
- **SQLite** for local development (easily switchable to PostgreSQL)
- **JWT** for authentication
- **bcrypt** for password hashing

### Database

- **SQLite** (development) / **PostgreSQL** (production)
- **Prisma** for schema management and migrations

## Project Structure

```
├── backend/                 # Node.js API server
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API communication
│   │   └── utils/          # Helper functions
│   └── package.json
└── database/               # Database files and scripts
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   npm run install:all
   ```

2. **Set up the database:**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Start the development servers:**

   ```bash
   npm run dev
   ```

4. **Access the application:**
   - POS Interface: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - API Server: http://localhost:5000
   - Database Studio: http://localhost:5555 (run `npm run db:studio`)

### Default Credentials

**Admin User:**

- Username: admin
- PIN: 1234

**Cashier User:**

- Username: cashier
- PIN: 5678

## API Documentation

The REST API provides endpoints for:

- Product management (`/api/products`)
- Inventory operations (`/api/inventory`)
- Sales transactions (`/api/sales`)
- Customer management (`/api/customers`)
- Employee management (`/api/employees`)
- Reporting (`/api/reports`)

## Hardware Integration

The system supports integration with:

- USB/Bluetooth barcode scanners
- Electronic weighing scales
- Thermal receipt printers
- Cash drawers
- Card payment terminals

## Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
PORT=5000
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please create an issue in the GitHub repository.
# POS-System
