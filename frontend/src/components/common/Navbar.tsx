import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/admin", label: "Dashboard", icon: "🏠" },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/categories", label: "Categories", icon: "🗂️" },
  { to: "/inventory", label: "Inventory", icon: "📋" },
  { to: "/sales", label: "Sales", icon: "💰" },
  { to: "/reports", label: "Reports", icon: "📊" },
  { to: "/employees", label: "Employees", icon: "👥" },
  { to: "/customers", label: "Customers", icon: "🧑‍🤝‍🧑" },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className="container mx-auto px-3 sm:px-6 lg:px-10 flex items-center h-16 justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-1">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">
              🛒
            </span>
            POS System
            <span className="ml-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">{user?.role}</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-1 md:gap-2  flex-wrap">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-150
                  ${
                    location.pathname === link.to
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }
                `}
              >
                <span className="text-base md:text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* User/Actions */}
        <div className="flex items-center gap-1 min-w-[150px] justify-end relative">
          {isAdmin && (
            <>
              <div className="hidden md:flex items-center gap-1.5">
                <Link
                  to="/"
                  className="text-xs md:text-sm bg-blue-600 text-white px-2.5 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                >
                  POS Terminal
                </Link>
                <button
                  onClick={logout}
                  className="text-xs md:text-sm text-gray-500 hover:text-red-600 px-2.5 py-1.5 border border-gray-300 rounded-md transition-colors"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none"
                  aria-label="Open user menu"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
                    <Link
                      to="/"
                      className="px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-t-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      POS Terminal
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
