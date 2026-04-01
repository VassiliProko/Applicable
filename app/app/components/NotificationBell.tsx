"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

const typeIcons: Record<string, string> = {
  new_application: "👤",
  application_accepted: "✅",
  application_rejected: "❌",
  new_report: "📝",
  report_approved: "✅",
  report_rejected: "🔄",
  new_submission: "📦",
  submission_approved: "🎉",
  submission_rejected: "🔄",
};

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function fetchNotifications() {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {});
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function handleClick(notif: Notification) {
    // Mark as read
    if (!notif.read) {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [notif.id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }

    // Navigate
    if (notif.link) {
      setOpen(false);
      router.push(notif.link);
    }
  }

  function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-text-secondary transition-all duration-100 hover:bg-surface-3 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-surface-1 shadow-lg overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-accent hover:underline"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2 ${
                    !notif.read ? "bg-accent/5" : ""
                  }`}
                >
                  <span className="text-lg mt-0.5 shrink-0">
                    {typeIcons[notif.type] || "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                      {notif.title}
                    </p>
                    <p className="type-caption text-text-tertiary line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <p className="type-caption text-text-disabled mt-1">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Bell size={24} className="mx-auto text-text-disabled mb-2" />
                <p className="type-caption text-text-tertiary">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
