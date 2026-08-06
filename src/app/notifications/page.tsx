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
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          🔔 Your Notifications
        </h1>
        <p className="mt-1.5 text-slate-500 text-sm">
          Stay updated on deadline alerts, status changes, and new matching scheme announcements.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-12 text-slate-500">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading notifications...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <span className="text-4xl mb-3">🔕</span>
          <h3 className="text-base font-bold text-slate-700">No new notifications</h3>
          <p className="mt-1 text-xs text-slate-400">
            You're all caught up! Updates regarding your saved schemes will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h2 className="font-bold text-slate-800 text-base">{notification.title}</h2>

              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                {notification.message}
              </p>

              <p className="mt-3 text-xs font-medium text-slate-400">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}