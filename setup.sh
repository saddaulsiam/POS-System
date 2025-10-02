#!/bin/bash

# Grocery Store POS System Setup Script
echo "🏪 Setting up Grocery Store POS System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version $(node -v) found"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Setup database
echo "🗄️ Setting up database..."
cd backend

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run seed

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development servers:"
echo "   npm run dev"
echo ""
echo "2. Access the application:"
echo "   - POS Interface: http://localhost:3000"
echo "   - Admin Dashboard: http://localhost:3000/admin"
echo "   - API Server: http://localhost:5000"
echo "   - Database Studio: http://localhost:5555 (run 'npm run db:studio')"
echo ""
echo "🔐 Default login credentials:"
echo "   Admin    - Username: admin,    PIN: 1234"
echo "   Manager  - Username: manager,  PIN: 5678"
echo "   Cashier  - Username: cashier1, PIN: 9999"
echo ""
echo "📖 For more information, see README.md"