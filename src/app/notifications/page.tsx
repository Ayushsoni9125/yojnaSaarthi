"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();

        if (data.success) {
          setNotifications(data.data);
          
          // Mark all unread notifications as read on load
          const hasUnread = data.data.some((n: any) => !n.isRead);
          if (hasUnread) {
            await fetch("/api/notifications", { method: "PUT" });
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        🔔 Notifications
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-slate-500">No notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2 className="font-semibold">{notification.title}</h2>

              <p className="mt-1 text-sm text-slate-600">
                {notification.message}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}