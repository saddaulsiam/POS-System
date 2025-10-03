import React from "react";
import { Link } from "react-router-dom";

interface QuickAction {
  name: string;
  href: string;
  icon: string;
  color: string;
  description: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ actions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
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
  );
};
