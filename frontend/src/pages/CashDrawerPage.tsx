import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface CashDrawer {
  id: number;
  employeeId: number;
  openingBalance: number;
  closingBalance: number | null;
  expectedBalance: number | null;
  difference: number | null;
  status: string;
  openedAt: string;
  closedAt: string | null;
  employee: {
    id: number;
    name: string;
    email: string;
  };
}

interface DrawerReconciliation {
  drawer: CashDrawer;
  sales: number;
  totalSales: number;
  paymentBreakdown: {
    cash: number;
    card: number;
    mobile: number;
    other: number;
  };
  expectedCashBalance: number;
  actualBalance: number | null;
  difference: number | null;
  recentTransactions: any[];
}

const CashDrawerPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDrawer, setCurrentDrawer] = useState<CashDrawer | null>(null);
  const [drawerHistory, setDrawerHistory] = useState<CashDrawer[]>([]);
  const [reconciliation, setReconciliation] = useState<DrawerReconciliation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Open drawer form
  const [openingBalance, setOpeningBalance] = useState("");
  const [showOpenForm, setShowOpenForm] = useState(false);

  // Close drawer form
  const [closingBalance, setClosingBalance] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [showCloseForm, setShowCloseForm] = useState(false);

  // History filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCurrentDrawer();
    if (user?.role === "ADMIN" || user?.role === "MANAGER") {
      fetchDrawerHistory();
    }
  }, [page]);

  const fetchCurrentDrawer = async () => {
    try {
      const response = await api.get("/cash-drawer/current");
      setCurrentDrawer(response.data.drawer);

      if (response.data.drawer) {
        fetchReconciliation(response.data.drawer.id);
      }
    } catch (err: any) {
      console.error("Error fetching current drawer:", err);
    }
  };

  const fetchReconciliation = async (drawerId: number) => {
    try {
      const response = await api.get(`/cash-drawer/${drawerId}/reconciliation`);
      setReconciliation(response.data);
    } catch (err: any) {
      console.error("Error fetching reconciliation:", err);
    }
  };

  const fetchDrawerHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cash-drawer?page=${page}&limit=10`);
      setDrawerHistory(response.data.cashDrawers);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      setError("Failed to fetch drawer history");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!openingBalance || parseFloat(openingBalance) < 0) {
      setError("Please enter a valid opening balance");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/cash-drawer/open", {
        openingBalance: parseFloat(openingBalance),
      });

      setCurrentDrawer(response.data);
      setSuccess("Cash drawer opened successfully");
      setShowOpenForm(false);
      setOpeningBalance("");
      fetchReconciliation(response.data.id);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to open cash drawer");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!closingBalance || parseFloat(closingBalance) < 0) {
      setError("Please enter a valid closing balance");
      return;
    }

    if (!currentDrawer) {
      setError("No open drawer found");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/cash-drawer/close/${currentDrawer.id}`, {
        closingBalance: parseFloat(closingBalance),
        actualCash: actualCash ? parseFloat(actualCash) : parseFloat(closingBalance),
        notes: closeNotes,
      });

      setSuccess("Cash drawer closed successfully");
      setShowCloseForm(false);
      setClosingBalance("");
      setActualCash("");
      setCloseNotes("");
      setCurrentDrawer(null);
      setReconciliation(null);

      if (user?.role === "ADMIN" || user?.role === "MANAGER") {
        fetchDrawerHistory();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to close cash drawer");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cash Drawer Management</h1>
        <p className="text-gray-600 mt-2">Manage your cash drawer and track shifts</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <span className="font-medium">⚠️ {error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <span className="font-medium">✓ {success}</span>
        </div>
      )}

      {/* Current Drawer Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">💵 Current Shift</h2>
              {!currentDrawer && (
                <button
                  onClick={() => setShowOpenForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Open Drawer
                </button>
              )}
              {currentDrawer && (
                <button
                  onClick={() => setShowCloseForm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Close Drawer
                </button>
              )}
            </div>

            {!currentDrawer && !showOpenForm && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💵</div>
                <p className="text-gray-500 text-lg">No cash drawer is currently open</p>
                <p className="text-gray-400 mt-2">Click "Open Drawer" to start a new shift</p>
              </div>
            )}

            {showOpenForm && (
              <form onSubmit={handleOpenDrawer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? "Opening..." : "Open Drawer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOpenForm(false);
                      setOpeningBalance("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {currentDrawer && !showCloseForm && reconciliation && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Opening Balance</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentDrawer.openingBalance)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Expected Cash</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(reconciliation.expectedCashBalance)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shift Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sales:</span>
                      <span className="font-medium">{reconciliation.sales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">{formatCurrency(reconciliation.totalSales)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cash Sales:</span>
                      <span className="font-medium">{formatCurrency(reconciliation.paymentBreakdown.cash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Sales:</span>
                      <span className="font-medium">{formatCurrency(reconciliation.paymentBreakdown.card)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile Sales:</span>
                      <span className="font-medium">{formatCurrency(reconciliation.paymentBreakdown.mobile)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opened At:</span>
                      <span className="font-medium">{new Date(currentDrawer.openedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showCloseForm && reconciliation && (
              <form onSubmit={handleCloseDrawer} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 font-medium">
                    Expected Cash Balance: {formatCurrency(reconciliation.expectedCashBalance)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Opening: {formatCurrency(currentDrawer!.openingBalance)} + Cash Sales:{" "}
                    {formatCurrency(reconciliation.paymentBreakdown.cash)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actual Cash Count</label>
                  <input
                    type="number"
                    step="0.01"
                    value={actualCash}
                    onChange={(e) => {
                      setActualCash(e.target.value);
                      setClosingBalance(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                  {actualCash && (
                    <p
                      className={`text-sm mt-1 ${
                        parseFloat(actualCash) - reconciliation.expectedCashBalance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Difference: {formatCurrency(parseFloat(actualCash) - reconciliation.expectedCashBalance)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={closeNotes}
                    onChange={(e) => setCloseNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any notes about this shift..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {loading ? "Closing..." : "Close Drawer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCloseForm(false);
                      setClosingBalance("");
                      setActualCash("");
                      setCloseNotes("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Shift Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentDrawer ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentDrawer ? "Open" : "Closed"}
                </span>
              </div>
              {currentDrawer && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Employee:</span>
                    <span className="text-sm font-medium">{currentDrawer.employee.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">
                      {Math.floor((Date.now() - new Date(currentDrawer.openedAt).getTime()) / 3600000)}h
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {reconciliation && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {reconciliation.recentTransactions.length === 0 ? (
                  <p className="text-sm text-gray-500">No transactions yet</p>
                ) : (
                  reconciliation.recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">#{transaction.receiptId}</span>
                      <span className="font-medium">{formatCurrency(transaction.total)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer History (Admin/Manager only) */}
      {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">🕐 Drawer History</h2>
            <button onClick={fetchDrawerHistory} className="text-blue-600 hover:text-blue-700 flex items-center">
              🔄 Refresh
            </button>
          </div>

          {loading && drawerHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : drawerHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No drawer history found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opened</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closed</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Opening</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Closing</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Difference</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {drawerHistory.map((drawer) => (
                      <tr key={drawer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{drawer.employee.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(drawer.openedAt)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {drawer.closedAt ? formatDate(drawer.closedAt) : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatCurrency(drawer.openingBalance)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {drawer.closingBalance ? formatCurrency(drawer.closingBalance) : "-"}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm text-right font-medium ${
                            drawer.difference === null
                              ? "text-gray-400"
                              : drawer.difference >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {drawer.difference !== null ? formatCurrency(drawer.difference) : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              drawer.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {drawer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CashDrawerPage;
