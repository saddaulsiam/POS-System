import React from "react";
import { Link } from "react-router-dom";

interface AlertsSectionProps {
  lowStockCount: number;
  outOfStockCount: number;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ lowStockCount, outOfStockCount }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Alerts & Notifications</h3>
      <div className="space-y-3">
        {lowStockCount > 0 && (
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <p className="font-medium text-yellow-800">Low Stock Alert</p>
              <p className="text-sm text-yellow-700">{lowStockCount} products are running low on stock</p>
            </div>
            <Link to="/inventory" className="ml-auto text-yellow-600 hover:text-yellow-800">
              View →
            </Link>
          </div>
        )}

        {outOfStockCount > 0 && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-600 mr-3">🚫</div>
            <div>
              <p className="font-medium text-red-800">Out of Stock</p>
              <p className="text-sm text-red-700">{outOfStockCount} products are currently out of stock</p>
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
  );
};
