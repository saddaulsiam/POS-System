import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/admin", label: "Dashboard", icon: "🏠", roles: ["ADMIN", "MANAGER", "CASHIER", "STAFF"] },
  { to: "/profile", label: "Profile", icon: "🙍", roles: ["ADMIN", "MANAGER", "CASHIER", "STAFF"] },
  { to: "/products", label: "Products", icon: "📦", roles: ["ADMIN", "MANAGER", "CASHIER", "STAFF"] },
  { to: "/categories", label: "Categories", icon: "🗂️", roles: ["ADMIN", "MANAGER"] },
  { to: "/suppliers", label: "Suppliers", icon: "🏪", roles: ["ADMIN", "MANAGER"] },
  { to: "/inventory", label: "Inventory", icon: "📋", roles: ["ADMIN", "MANAGER", "STAFF"] },
  { to: "/sales", label: "Sales", icon: "💰", roles: ["ADMIN", "MANAGER", "CASHIER"] },
  { to: "/reports", label: "Reports", icon: "📊", roles: ["ADMIN", "MANAGER"] },
  { to: "/analytics", label: "Analytics", icon: "📈", roles: ["ADMIN", "MANAGER"] },
  { to: "/loyalty-admin", label: "Loyalty Program", icon: "🎁", roles: ["ADMIN", "MANAGER"] },
  { to: "/employees", label: "Employees", icon: "👥", roles: ["ADMIN"] },
  { to: "/customers", label: "Customers", icon: "🧑‍🤝‍🧑", roles: ["ADMIN", "MANAGER", "CASHIER"] },
  { to: "/audit-logs", label: "Audit Logs", icon: "📜", roles: ["ADMIN", "MANAGER"] },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredLinks = navLinks.filter((link) => !link.roles || link.roles.includes(user?.role || ""));

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-30 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-4 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100 shadow-md"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-xs">{isCollapsed ? "→" : "←"}</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col h-full p-3 overflow-y-auto">
          {/* Main Navigation */}
          <div className="flex flex-col gap-1 flex-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
                title={isCollapsed ? link.label : ""}
              >
                <span className="text-xl flex-shrink-0">{link.icon}</span>
                {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </Link>
            ))}
          </div>

          {/* Settings - Bottom Section */}
          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/settings"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
                title={isCollapsed ? "Settings" : ""}
              >
                <span className="text-xl flex-shrink-0">⚙️</span>
                {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Spacer for content */}
      <div className={`${isCollapsed ? "w-16" : "w-64"} flex-shrink-0 transition-all duration-300`} />
    </>
  );
};

export default Sidebar;
