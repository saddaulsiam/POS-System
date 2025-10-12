// import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { notificationsAPI } from "../../services/api";

// const NotificationBell: React.FC = () => {
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     }
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const data = await notificationsAPI.getAll();
//       setNotifications(data);
//     } catch (err) {
//       // handle error
//     }
//     setLoading(false);
//   };

//   const unreadCount = notifications.filter((n: any) => !n.isRead).length;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         className="relative p-2 rounded-full hover:bg-blue-100 focus:outline-none"
//         aria-label="Notifications"
//         onClick={() => setDropdownOpen((open) => !open)}
//       >
//         <span className="text-2xl">🔔</span>
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
//             {unreadCount}
//           </span>
//         )}
//       </button>
//       {dropdownOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//           <div className="p-3 border-b font-semibold text-gray-700">Alerts & Notifications</div>
//           <div className="max-h-80 overflow-y-auto">
//             {loading ? (
//               <div className="p-4 text-center text-gray-500">Loading...</div>
//             ) : notifications.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">No notifications</div>
//             ) : (
//               notifications.map((n: any) => (
//                 <div key={n.id} className={`px-4 py-3 border-b last:border-b-0 ${!n.isRead ? "bg-blue-50" : ""}`}>
//                   <div className="font-medium text-gray-800">
//                     {n.type === "low_stock" && "Low Stock Alert"}
//                     {n.type === "high_stock" && "High Stock Alert"}
//                     {n.type === "expiry" && "Expiry Alert"}
//                     {n.type === "inactive" && "Inactive Product Alert"}
//                     {!["low_stock", "high_stock", "expiry", "inactive"].includes(n.type) && n.type}
//                   </div>
//                   <div className="text-sm text-gray-600">{n.message}</div>
//                   {n.product && <div className="text-xs text-gray-400 mt-1">Product: {n.product.name}</div>}
//                   <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
//                   {!n.isRead && (
//                     <button
//                       className="mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
//                       onClick={async () => {
//                         await notificationsAPI.markAsRead(n.id);
//                         fetchNotifications();
//                       }}
//                     >
//                       Mark as Read
//                     </button>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//           <Link to="/notifications">
//             <button className="bg-transparent py-2 px-4 text-gray-700 hover:bg-gray-100 border border-gray-300 focus:ring-gray-400 w-full">
//               View All Notifications
//             </button>
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { notificationsAPI } from "../../services/api";

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  // Add Mark All as Read handler
  const handleMarkAllAsRead = async () => {
    await Promise.all(notifications.filter((n: any) => !n.isRead).map((n: any) => notificationsAPI.markAsRead(n.id)));
    fetchNotifications();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-blue-100 focus:outline-none"
        aria-label="Notifications"
        onClick={() => setDropdownOpen((open) => !open)}
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b font-semibold text-gray-700">Alerts & Notifications</div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((n: any) => (
                <div key={n.id} className={`px-4 py-3 border-b last:border-b-0 ${!n.isRead ? "bg-blue-50" : ""}`}>
                  <div className="font-medium text-gray-800">
                    {n.type === "low_stock" && "Low Stock Alert"}
                    {n.type === "high_stock" && "High Stock Alert"}
                    {n.type === "expiry" && "Expiry Alert"}
                    {n.type === "inactive" && "Inactive Product Alert"}
                    {!["low_stock", "high_stock", "expiry", "inactive"].includes(n.type) && n.type}
                  </div>
                  <div className="text-sm text-gray-600">{n.message}</div>
                  {n.product && <div className="text-xs text-gray-400 mt-1">Product: {n.product.name}</div>}
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  {!n.isRead && (
                    <button
                      className="mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={async () => {
                        await notificationsAPI.markAsRead(n.id);
                        fetchNotifications();
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          {/* Mark All as Read Button */}
          {notifications.some((n: any) => !n.isRead) && (
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 w-full mt-2 hover:bg-blue-700"
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </button>
          )}
          <Link to="/notifications">
            <button className="bg-transparent py-2 px-4 text-gray-700 hover:bg-gray-100 border border-gray-300 focus:ring-gray-400 w-full">
              View All Notifications
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
