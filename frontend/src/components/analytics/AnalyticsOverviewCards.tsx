import React from "react";
import { OverviewData } from "../../types/analyticsTypes";
import { formatCurrency } from "../../utils/currencyUtils";

interface AnalyticsOverviewCardsProps {
  overviewData: OverviewData;
  settings: any;
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({ overviewData, settings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Revenue */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 4c-4.418 0-8 3.582-8 8a8 8 0 0016 0c0-4.418-3.582-8-8-8z"
            />
          </svg>
          {overviewData.growth.revenue !== 0 && (
            <div
              className={`flex items-center text-sm ${
                overviewData.growth.revenue > 0 ? "text-green-200" : "text-red-200"
              }`}
            >
              {overviewData.growth.revenue > 0 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5-5m0 0l-5 5m5-5v12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5 5m0 0l5-5m-5 5V4" />
                </svg>
              )}
              <span>{Math.abs(overviewData.growth.revenue).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">
          {formatCurrency(Number(overviewData.metrics.totalRevenue), settings, 2)}
        </div>
        <div className="text-blue-100 text-sm">Total Revenue</div>
      </div>

      {/* Total Sales */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.6 19h8.8a2 2 0 001.95-1.7L17 13M7 13V6h10v7"
            />
          </svg>
          {overviewData.growth.sales !== 0 && (
            <div
              className={`flex items-center text-sm ${
                overviewData.growth.sales > 0 ? "text-green-200" : "text-red-200"
              }`}
            >
              {overviewData.growth.sales > 0 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5-5m0 0l-5 5m5-5v12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5 5m0 0l5-5m-5 5V4" />
                </svg>
              )}
              <span>{Math.abs(overviewData.growth.sales).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="text-3xl font-bold mb-1">{Number(overviewData.metrics.totalSales).toFixed(2)}</div>
        <div className="text-green-100 text-sm">Total Transactions</div>
      </div>

      {/* Average Order Value */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4h-1v-4h-1m-4 4h-1v-4h-1" />
          </svg>
        </div>
        <div className="text-3xl font-bold mb-1">
          {formatCurrency(Number(overviewData.metrics.averageOrderValue), settings, 2)}
        </div>
        <div className="text-purple-100 text-sm">Average Order Value</div>
      </div>

      {/* Unique Customers */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold mb-1">{Number(overviewData.metrics.uniqueCustomers).toFixed(2)}</div>
        <div className="text-orange-100 text-sm">Unique Customers</div>
      </div>
    </div>
  );
};
