import React, { useEffect, useState } from "react";
import { Button } from "../components/common";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { notificationsAPI } from "../services/api";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  // Mark all as read handler
  const handleMarkAllAsRead = async () => {
    await Promise.all(notifications.filter((n: any) => !n.isRead).map((n: any) => notificationsAPI.markAsRead(n.id)));
    fetchNotifications();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Alerts & Notifications</h1>
      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        <>
          {notifications.some((n: any) => !n.isRead) && (
            <div className="mb-4 text-right">
              <Button size="sm" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </Button>
            </div>
          )}
          <div className="bg-white rounded-lg shadow border divide-y">
            {notifications.map((n: any) => (
              <div
                key={n.id}
                className={`px-6 py-4 flex flex-col md:flex-row md:items-center justify-between ${
                  !n.isRead ? "bg-blue-50" : ""
                }`}
              >
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
                {!n.isRead && (
                  <div className="mt-2 md:mt-0 md:ml-4">
                    <Button
                      size="sm"
                      onClick={async () => {
                        await notificationsAPI.markAsRead(n.id);
                        fetchNotifications();
                      }}
                    >
                      Mark as Read
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
