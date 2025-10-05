import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/common";
import { DashboardStatCard } from "../components/dashboard/DashboardStatCard";
import { SimpleBarChart } from "../components/dashboard/SimpleBarChart";
import { RecentTransactionsList } from "../components/dashboard/RecentTransactionsList";
import { QuickActionsGrid } from "../components/dashboard/QuickActionsGrid";
import { AlertsSection } from "../components/dashboard/AlertsSection";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currencyUtils";

interface DashboardStats {
  todaySales: number;
  yesterdaySales: number;
  weekSales: number;
  monthSales: number;
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalCustomers: number;
  newCustomersThisWeek: number;
  todayTransactions: number;
  weekTransactions: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    id: number;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  recentTransactions: Array<{
    id: number;
    total: number;
    createdAt: string;
    customerName?: string;
    itemCount: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  hourlySales: Array<{
    hour: number;
    sales: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    yesterdaySales: 0,
    weekSales: 0,
    monthSales: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalCustomers: 0,
    newCustomersThisWeek: 0,
    todayTransactions: 0,
    weekTransactions: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    recentTransactions: [],
    salesByCategory: [],
    hourlySales: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const { reportsAPI, customersAPI, analyticsAPI } = await import("../services/api");

      // Helper to format date as YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);

      const [
        todaySalesReport,
        yesterdaySalesReport,
        weekSalesReport,
        monthSalesReport,
        inventoryReport,
        productPerformance,
        customers,
        weekCustomers,
        todaySalesRange,
        categoryBreakdown,
      ] = await Promise.all([
        reportsAPI.getSalesRange(formatDate(today), formatDate(today)),
        reportsAPI.getDailySales(formatDate(yesterday)),
        reportsAPI.getSalesRange(formatDate(weekAgo), formatDate(today)),
        reportsAPI.getSalesRange(formatDate(monthAgo), formatDate(today)),
        reportsAPI.getInventory(),
        reportsAPI.getProductPerformance(formatDate(weekAgo), formatDate(today), 5),
        customersAPI.getAll({ page: 1, limit: 1 }),
        customersAPI.getAll({ page: 1, limit: 100 }),
        reportsAPI.getSalesRange(formatDate(today), formatDate(today)),
        analyticsAPI.getCategoryBreakdown({ startDate: formatDate(weekAgo), endDate: formatDate(today) }),
      ]);

      // Defensive checks for required fields
      if (
        !todaySalesReport?.summary ||
        !yesterdaySalesReport?.summary ||
        !weekSalesReport?.summary ||
        !monthSalesReport?.summary
      ) {
        throw new Error("One or more sales report summaries are missing");
      }
      if (!inventoryReport?.products) {
        throw new Error("Inventory report is missing products");
      }
      if (!customers?.pagination) {
        throw new Error("Customers API response is missing pagination");
      }
      if (!Array.isArray(weekCustomers.data)) {
        throw new Error("weekCustomers.data is not an array");
      }

      // Calculate new customers this week
      const newCustomersThisWeek = weekCustomers.data.filter((c: any) => {
        const created = new Date(c.createdAt);
        return created >= weekAgo && created <= today;
      }).length;

      // Map top selling products
      const topSellingProducts = (productPerformance.products || []).map((p: any) => ({
        id: p.product.id,
        name: p.product.name,
        totalSold: p.totalQuantitySold,
        revenue: p.totalRevenue,
      }));

      // Map recent transactions
      const recentTransactions: DashboardStats["recentTransactions"] = (todaySalesRange.sales || [])
        .slice(0, 5)
        .map((sale: any) => ({
          id: sale.id,
          total: sale.finalAmount || sale.total || 0,
          createdAt: sale.createdAt,
          customerName: sale.customer?.name,
          itemCount: Array.isArray(sale.saleItems)
            ? sale.saleItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
            : 0,
        }));

      setStats({
        todaySales: todaySalesReport.summary.totalSales ?? 0,
        yesterdaySales: yesterdaySalesReport.summary.totalSales ?? 0,
        weekSales: weekSalesReport.summary.totalSales ?? 0,
        monthSales: monthSalesReport.summary.totalSales ?? 0,
        totalProducts: inventoryReport.totalProducts ?? 0,
        activeProducts: Array.isArray(inventoryReport.products)
          ? inventoryReport.products.filter((p: any) => p.isActive).length
          : 0,
        lowStockCount: inventoryReport.lowStockCount ?? 0,
        outOfStockCount: inventoryReport.outOfStockCount ?? 0,
        totalCustomers: customers.pagination.totalItems ?? 0,
        newCustomersThisWeek,
        todayTransactions: todaySalesReport.summary.totalTransactions ?? 0,
        weekTransactions: weekSalesReport.summary.totalTransactions ?? 0,
        averageOrderValue:
          todaySalesReport.summary.totalSales && todaySalesReport.summary.totalTransactions
            ? todaySalesReport.summary.totalSales / todaySalesReport.summary.totalTransactions
            : 0,
        topSellingProducts,
        recentTransactions,
        salesByCategory: (categoryBreakdown.categories || []).map((cat: any) => ({
          category: cat.name,
          sales: cat.revenue,
          percentage: cat.percentage,
        })),
        hourlySales: [],
      });
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data: " + (error?.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">{title}</h3>
      {children}
    </div>
  );

  const quickActions = [
    {
      name: "Add Product",
      href: "/products/new",
      icon: "📦",
      color: "blue",
      description: "Add new inventory items",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      name: "Process Sale",
      href: "/",
      icon: "💰",
      color: "green",
      description: "Go to POS terminal",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      name: "View Reports",
      href: "/reports",
      icon: "📊",
      color: "purple",
      description: "Detailed analytics",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      name: "Manage Staff",
      href: "/employees",
      icon: "👥",
      color: "indigo",
      description: "Employee management",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      name: "Customer List",
      href: "/customers",
      icon: "👤",
      color: "pink",
      description: "Customer database",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: "📋",
      color: "yellow",
      description: "Stock management",
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "⚙️",
      color: "gray",
      description: "System configuration",
      gradient: "from-gray-500 to-gray-600",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: "📈",
      color: "teal",
      description: "Advanced insights",
      gradient: "from-teal-500 to-cyan-600",
    },
  ];

  if (user?.role === "CASHIER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <BackButton to="/" label="Back to POS" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back, <span className="font-semibold text-gray-900">{user?.name || "Admin"}</span>! Here's
                what's happening with your store today.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Today's Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  <span>Key Metrics</span>
                </h2>
                <button
                  onClick={loadDashboardData}
                  className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-700 font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard
                  title="Today's Sales"
                  value={formatCurrency(stats.todaySales, settings)}
                  change={{ value: 12.5, isPositive: true }}
                  icon="💰"
                  color="green"
                />
                <DashboardStatCard title="Total Products" value={stats.totalProducts} icon="📦" color="blue" />
                <DashboardStatCard title="Low Stock Items" value={stats.lowStockCount} icon="⚠️" color="yellow" />
                <DashboardStatCard
                  title="Today's Orders"
                  value={stats.todayTransactions}
                  change={{ value: 8.2, isPositive: true }}
                  icon="🛒"
                  color="purple"
                />
              </div>
            </div>

            {/* Sales Overview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">📈</span>
                <span>Sales Overview</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard
                  title="Yesterday"
                  value={formatCurrency(stats.yesterdaySales, settings)}
                  icon="📅"
                  color="gray"
                />
                <DashboardStatCard
                  title="This Week"
                  value={formatCurrency(stats.weekSales, settings)}
                  change={{ value: 15.3, isPositive: true }}
                  icon="📊"
                  color="blue"
                />
                <DashboardStatCard
                  title="This Month"
                  value={formatCurrency(stats.monthSales, settings)}
                  change={{ value: 23.1, isPositive: true }}
                  icon="📈"
                  color="green"
                />
                <DashboardStatCard
                  title="Avg Order Value"
                  value={formatCurrency(stats.averageOrderValue, settings)}
                  change={{ value: 5.7, isPositive: true }}
                  icon="💸"
                  color="purple"
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">⚡</span>
                <span>Performance Metrics</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardStatCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  change={{ value: 4.2, isPositive: true }}
                  icon="👥"
                  color="indigo"
                />
                <DashboardStatCard
                  title="New This Week"
                  value={stats.newCustomersThisWeek}
                  change={{ value: 12.8, isPositive: true }}
                  icon="👋"
                  color="pink"
                />
                <DashboardStatCard
                  title="Active Products"
                  value={`${stats.activeProducts}/${stats.totalProducts}`}
                  icon="✅"
                  color="green"
                />
              </div>
            </div>

            {/* Charts and Analytics */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">📊</span>
                <span>Analytics & Insights</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Top Selling Products">
                  <SimpleBarChart
                    data={stats.topSellingProducts.map((p) => ({
                      label: p.name,
                      value: p.totalSold,
                    }))}
                  />
                </ChartCard>

                <ChartCard title="Sales by Category">
                  <SimpleBarChart
                    data={stats.salesByCategory.map((c) => ({
                      label: c.category,
                      value: c.percentage,
                    }))}
                  />
                </ChartCard>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">⚡</span>
                <span>Recent Activity</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentTransactionsList transactions={stats.recentTransactions} />
                <QuickActionsGrid actions={quickActions} />
              </div>
            </div>

            {/* Alerts and Notifications */}
            <AlertsSection lowStockCount={stats.lowStockCount} outOfStockCount={stats.outOfStockCount} />

            {/* Dashboard Footer - Quick Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Revenue (Month)</p>
                  <p className="text-3xl font-bold">{formatCurrency(stats.monthSales, settings)}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Transactions (Week)</p>
                  <p className="text-3xl font-bold">{stats.weekTransactions}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Active Inventory</p>
                  <p className="text-3xl font-bold">{stats.activeProducts}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Customers</p>
                  <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
