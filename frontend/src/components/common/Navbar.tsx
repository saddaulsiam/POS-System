import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl">
              🛒
            </span>
            <span className="hidden sm:inline">{settings?.storeName || "POS System"}</span>
            <span className="sm:hidden">POS</span>
          </span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* User Role Badge */}
          <span className="hidden sm:inline-flex px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
            {user?.role}
          </span>

          {/* User Name */}
          <span className="hidden md:inline-flex text-sm font-medium text-gray-700">{user?.name}</span>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              POS Terminal
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded-md hover:border-red-300 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none"
              aria-label="Open menu"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                  onClick={() => setMenuOpen(false)}
                >
                  🏪 POS Terminal
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
