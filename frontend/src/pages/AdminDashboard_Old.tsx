import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      const { reportsAPI, customersAPI } = await import("../services/api");
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
      ]);

      // Log all API responses for debugging
      console.log("todaySalesReport", todaySalesReport);
      console.log("yesterdaySalesReport", yesterdaySalesReport);
      console.log("weekSalesReport", weekSalesReport);
      console.log("monthSalesReport", monthSalesReport);
      console.log("inventoryReport", inventoryReport);
      console.log("productPerformance", productPerformance);
      console.log("customers", customers);
      console.log("weekCustomers", weekCustomers);

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

      // Map recent transactions from today's sales-range (latest 5)
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

      // Map sales by category (not available directly, so leave empty or implement if backend supports)
      const salesByCategory: DashboardStats["salesByCategory"] = [];

      // Map hourly sales (not available directly, so leave empty or implement if backend supports)
      const hourlySales: DashboardStats["hourlySales"] = [];

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
        salesByCategory,
        hourlySales,
      });
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data: " + (error?.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    change,
    icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    change?: { value: number; isPositive: boolean };
    icon: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.isPositive ? "text-green-600" : "text-red-600"}`}>
              {change.isPositive ? "↗" : "↘"} {Math.abs(change.value)}%
            </p>
          )}
        </div>
        <div className={`text-3xl bg-${color}-100 p-3 rounded-full`}>{icon}</div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const SimpleBarChart = ({ data }: { data: Array<{ label: string; value: number }> }) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-16 text-sm font-medium text-right">{item.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    );
  };

  const quickActions = [
    { name: "Add Product", href: "/products/new", icon: "📦", color: "blue", description: "Add new inventory items" },
    { name: "Process Sale", href: "/", icon: "💰", color: "green", description: "Go to POS terminal" },
    { name: "View Reports", href: "/reports", icon: "📊", color: "purple", description: "Detailed analytics" },
    { name: "Manage Staff", href: "/employees", icon: "👥", color: "indigo", description: "Employee management" },
    { name: "Customer List", href: "/customers", icon: "👤", color: "pink", description: "Customer database" },
    { name: "Inventory", href: "/inventory", icon: "📋", color: "yellow", description: "Stock management" },
  ];

  if (user?.role === "CASHIER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to POS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Today's Sales"
                  value={`$${stats.todaySales.toFixed(2)}`}
                  change={{ value: 12.5, isPositive: true }}
                  icon="💰"
                  color="green"
                />
                <StatCard title="Total Products" value={stats.totalProducts} icon="📦" color="blue" />
                <StatCard title="Low Stock Items" value={stats.lowStockCount} icon="⚠️" color="yellow" />
                <StatCard
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Sales Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Yesterday" value={`$${stats.yesterdaySales.toFixed(2)}`} icon="📅" color="gray" />
                <StatCard
                  title="This Week"
                  value={`$${stats.weekSales.toFixed(2)}`}
                  change={{ value: 15.3, isPositive: true }}
                  icon="📊"
                  color="blue"
                />
                <StatCard
                  title="This Month"
                  value={`$${stats.monthSales.toFixed(2)}`}
                  change={{ value: 23.1, isPositive: true }}
                  icon="📈"
                  color="green"
                />
                <StatCard
                  title="Avg Order Value"
                  value={`$${stats.averageOrderValue.toFixed(2)}`}
                  change={{ value: 5.7, isPositive: true }}
                  icon="💸"
                  color="purple"
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  change={{ value: 4.2, isPositive: true }}
                  icon="👥"
                  color="indigo"
                />
                <StatCard
                  title="New This Week"
                  value={stats.newCustomersThisWeek}
                  change={{ value: 12.8, isPositive: true }}
                  icon="👋"
                  color="pink"
                />
                <StatCard
                  title="Active Products"
                  value={`${stats.activeProducts}/${stats.totalProducts}`}
                  icon="✅"
                  color="green"
                />
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Recent Transactions</h3>
                <div className="space-y-3">
                  {stats.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">#{transaction.id}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.customerName || "Walk-in Customer"} • {transaction.itemCount} items
                        </p>
                        <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${transaction.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      to={action.href}
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                      <div className="text-sm font-medium text-gray-900 text-center">{action.name}</div>
                      <div className="text-xs text-gray-500 text-center mt-1">{action.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts and Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Alerts & Notifications</h3>
              <div className="space-y-3">
                {stats.lowStockCount > 0 && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-yellow-600 mr-3">⚠️</div>
                    <div>
                      <p className="font-medium text-yellow-800">Low Stock Alert</p>
                      <p className="text-sm text-yellow-700">{stats.lowStockCount} products are running low on stock</p>
                    </div>
                    <Link to="/inventory" className="ml-auto text-yellow-600 hover:text-yellow-800">
                      View →
                    </Link>
                  </div>
                )}

                {stats.outOfStockCount > 0 && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-600 mr-3">🚫</div>
                    <div>
                      <p className="font-medium text-red-800">Out of Stock</p>
                      <p className="text-sm text-red-700">
                        {stats.outOfStockCount} products are currently out of stock
                      </p>
                    </div>
                    <Link to="/inventory" className="ml-auto text-red-600 hover:text-red-800">
                      Restock →
                    </Link>
                  </div>
                )}

                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-600 mr-3">✅</div>
                  <div>
                    <p className="font-medium text-green-800">System Status</p>
                    <p className="text-sm text-green-700">All systems operational</p>
                  </div>
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
