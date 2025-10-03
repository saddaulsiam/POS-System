import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Button } from "../components/common";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔐 Login form submitted");

    if (!username || !pinCode) {
      console.log("⚠️ Missing credentials:", { username: !!username, pinCode: !!pinCode });
      return;
    }

    console.log("🔄 Starting login process...", { username, pinCodeLength: pinCode.length });
    setIsLoading(true);
    try {
      const result = await login({ username, pinCode });
      console.log("✅ Login completed successfully:", result);
    } catch (error: any) {
      console.error("❌ Login failed:", {
        error,
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    switch (role) {
      case "admin":
        setUsername("admin");
        setPinCode("1234");
        break;
      case "manager":
        setUsername("manager");
        setPinCode("5678");
        break;
      case "cashier":
        setUsername("cashier1");
        setPinCode("9999");
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Fresh Mart POS</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pinCode" className="sr-only">
                PIN Code
              </label>
              <input
                id="pinCode"
                name="pinCode"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="PIN Code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" fullWidth disabled={isLoading || !username || !pinCode}>
              {isLoading ? <LoadingSpinner size="sm" /> : "Sign in"}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">Quick Login</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button type="button" variant="ghost" onClick={() => quickLogin("admin")}>
                Admin
              </Button>
              <Button type="button" variant="ghost" onClick={() => quickLogin("manager")}>
                Manager
              </Button>
              <Button type="button" variant="ghost" onClick={() => quickLogin("cashier")}>
                Cashier
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <div className="text-xs text-gray-500">
            <p className="font-semibold mb-2">Default Credentials:</p>
            <p>Admin: admin / 1234</p>
            <p>Manager: manager / 5678</p>
            <p>Cashier: cashier1 / 9999</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
