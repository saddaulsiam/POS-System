import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import { analyticsAPI } from "../services";
import toast from "react-hot-toast";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currencyUtils";
import { RefreshButton } from "../components/common";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Period = "today" | "yesterday" | "week" | "lastWeek" | "month" | "lastMonth" | "custom";

interface OverviewData {
  metrics: {
    totalSales: number;
    totalRevenue: number;
    totalDiscount: number;
    totalTax: number;
    averageOrderValue: number;
    uniqueCustomers: number;
  };
  growth: {
    revenue: number;
    sales: number;
  };
  paymentMethods: Record<string, number>;
}

interface SalesTrendData {
  period: string;
  sales: number;
  revenue: number;
  count: number;
}

interface TopProduct {
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
  averagePrice: number;
}

interface CategoryData {
  name: string;
  revenue: number;
  percentage: number;
}

const AnalyticsPage: React.FC = () => {
  const { settings } = useSettings();
  const [period, setPeriod] = useState<Period>("today");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const params =
        period === "custom" && customStartDate && customEndDate
          ? { startDate: customStartDate, endDate: customEndDate }
          : { period };

      const [overview, trend, products, categoryBreakdown] = await Promise.all([
        analyticsAPI.getOverview(params),
        analyticsAPI.getSalesTrend({ period, groupBy: period === "today" ? "hour" : "day" }),
        analyticsAPI.getTopProducts({ ...params, limit: 10 }),
        analyticsAPI.getCategoryBreakdown(params),
      ]);

      setOverviewData(overview);
      setSalesTrend(trend.data || []);
      setTopProducts(products.products || []);
      setCategories(categoryBreakdown.categories || []);
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast.error(error.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      fetchAnalytics();
    } else {
      toast.error("Please select both start and end dates");
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "week":
        return "This Week";
      case "lastWeek":
        return "Last Week";
      case "month":
        return "This Month";
      case "lastMonth":
        return "Last Month";
      case "custom":
        return customStartDate && customEndDate ? `${customStartDate} to ${customEndDate}` : "Custom Range";
      default:
        return "Today";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>
          <p className="text-gray-600 mt-1">{getPeriodLabel()}</p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <RefreshButton onClick={fetchAnalytics} loading={refreshing} />
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPeriod("today")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === "today" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod("yesterday")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === "yesterday" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === "week" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === "month" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod("lastMonth")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === "lastMonth" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Last Month
          </button>
        </div>

        {/* Custom Date Range */}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCustomDateSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Apply
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      {overviewData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              {overviewData.growth.revenue !== 0 && (
                <div
                  className={`flex items-center text-sm ${
                    overviewData.growth.revenue > 0 ? "text-green-200" : "text-red-200"
                  }`}
                >
                  {overviewData.growth.revenue > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(overviewData.growth.revenue).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrency(overviewData.metrics.totalRevenue, settings)}</div>
            <div className="text-blue-100 text-sm">Total Revenue</div>
          </div>

          {/* Total Sales */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 opacity-80" />
              {overviewData.growth.sales !== 0 && (
                <div
                  className={`flex items-center text-sm ${
                    overviewData.growth.sales > 0 ? "text-green-200" : "text-red-200"
                  }`}
                >
                  {overviewData.growth.sales > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(overviewData.growth.sales).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">{overviewData.metrics.totalSales}</div>
            <div className="text-green-100 text-sm">Total Transactions</div>
          </div>

          {/* Average Order Value */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(overviewData.metrics.averageOrderValue, settings)}
            </div>
            <div className="text-purple-100 text-sm">Average Order Value</div>
          </div>

          {/* Unique Customers */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{overviewData.metrics.uniqueCustomers}</div>
            <div className="text-orange-100 text-sm">Unique Customers</div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value, settings)}
                labelStyle={{ color: "#374151" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Revenue"
                dot={{ fill: "#3B82F6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={2}
                name="Transactions"
                dot={{ fill: "#10B981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
              >
                {categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, settings)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Rank</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Qty Sold</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Revenue</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-600"
                            : "bg-blue-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-right text-gray-800 font-semibold">
                      {product.quantitySold.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">
                      {formatCurrency(product.revenue, settings)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(product.averagePrice, settings)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No product data available for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
