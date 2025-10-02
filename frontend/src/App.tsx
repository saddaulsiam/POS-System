import React from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Navbar from "./components/common/Navbar";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import CustomersPage from "./pages/CustomersPage";
import EmployeesPage from "./pages/EmployeesPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import POSPage from "./pages/POSPage";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";
import SalesPage from "./pages/SalesPage";
import NewProductPage from "./pages/NewProductPage";

const adminPaths = ["/admin", "/products", "/customers", "/sales", "/reports", "/inventory", "/employees"];

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

  return (
    <>
      {(user?.role === "ADMIN" || user?.role === "MANAGER") &&
        adminPaths.some((p) => location.pathname.startsWith(p)) && <Navbar />}

      <Routes>
        {/* POS Interface - Main cashier interface */}
        <Route path="/" element={<POSPage />} />
        <Route path="/pos" element={<POSPage />} />

        {/* Admin/Manager Routes */}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<NewProductPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </>
        )}

        {/* Admin Only Routes */}
        {user?.role === "ADMIN" && (
          <>
            <Route path="/employees" element={<EmployeesPage />} />
          </>
        )}

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
