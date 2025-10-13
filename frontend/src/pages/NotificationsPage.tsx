import React, { useEffect, useState } from "react";
import { Button } from "../components/common";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { notificationsAPI } from "../services/api";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const fetchNotifications = async (pageNum: number) => {
    setLoading(true);
    try {
      const limit = 10;
      const response = await notificationsAPI.getAll({ page: pageNum, limit });
      setNotifications(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setNotifications([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  // Mark all as read handler
  const handleMarkAllAsRead = async () => {
    await Promise.all(notifications.filter((n: any) => !n.isRead).map((n: any) => notificationsAPI.markAsRead(n.id)));
    fetchNotifications(page);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="sticky top-0 z-10 bg-blue-50/80 rounded-xl shadow-sm pb-5 mb-6 flex items-center justify-between px-6 pt-4">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
          <span className="text-3xl">🔔</span>
          Alerts & Notifications
        </h1>
        {notifications.some((n: any) => !n.isRead) && (
          <Button
            size="sm"
            onClick={handleMarkAllAsRead}
            className="bg-blue-600 text-white rounded-full px-5 py-2 text-base shadow hover:bg-blue-700"
          >
            Mark All as Read
          </Button>
        )}
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        <>
          <div className="grid gap-4">
            {notifications.map((n: any) => (
              <div
                key={n.id}
                className={`flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl shadow-sm border px-5 py-4 transition-all duration-150 ${
                  !n.isRead ? "border-blue-400 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">
                    {n.type === "low_stock" && "⚠️"}
                    {n.type === "high_stock" && "📦"}
                    {n.type === "expiry" && "⏰"}
                    {n.type === "inactive" && "🚫"}
                    {!["low_stock", "high_stock", "expiry", "inactive"].includes(n.type) && "🔔"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {n.type === "low_stock" && "Low Stock Alert"}
                      {n.type === "high_stock" && "High Stock Alert"}
                      {n.type === "expiry" && "Expiry Alert"}
                      {n.type === "inactive" && "Inactive Product Alert"}
                      {!["low_stock", "high_stock", "expiry", "inactive"].includes(n.type) && n.type}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{n.message}</div>
                    {n.product && <div className="text-xs text-gray-400 mt-1">Product: {n.product.name}</div>}
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                {!n.isRead && (
                  <div className="mt-3 md:mt-0 md:ml-4 flex-shrink-0">
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white rounded-full px-3 py-1 text-xs shadow hover:bg-blue-700"
                      onClick={async () => {
                        await notificationsAPI.markAsRead(n.id);
                        fetchNotifications(page);
                      }}
                    >
                      Mark as Read
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
