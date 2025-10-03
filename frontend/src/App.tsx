import React from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import { useAuth } from "./context/AuthContext";

import AdminDashboard from "./pages/AdminDashboard";
import CategoriesPage from "./pages/CategoriesPage";
import CustomersPage from "./pages/CustomersPage";
import EmployeesPage from "./pages/EmployeesPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import NewProductPage from "./pages/NewProductPage";
import POSPage from "./pages/POSPage";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import SalesPage from "./pages/SalesPage";
import ProfilePage from "./pages/ProfilePage";
import AuditLogsPage from "./pages/AuditLogsPage";

const adminPaths = [
  "/admin",
  "/products",
  "/categories",
  "/customers",
  "/sales",
  "/reports",
  "/inventory",
  "/employees",
  "/profile",
  "/audit-logs",
];

const App: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const isAdminPath = adminPaths.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));

  return (
    <>
      {isAdminPath && <Navbar />}

      <div className="flex">
        {isAdminPath && <Sidebar />}

        <main className={`flex-1 ${isAdminPath ? "pt-16" : ""} min-h-screen bg-gray-50`}>
          <Routes>
            {/* POS Interface - Main cashier interface */}
            <Route path="/" element={<POSPage />} />
            <Route path="/pos" element={<POSPage />} />

            {/* Profile route for all authenticated users */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin/Manager Routes */}
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<NewProductPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
              </>
            )}

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default App;
