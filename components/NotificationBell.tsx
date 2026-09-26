"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

const POLL_MS = 60_000;

function timeAgo(value: string, now: number) {
  const minutes = Math.floor((now - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [fetchedAt, setFetchedAt] = useState(0);

  const apply = useCallback((data: { notifications: NotificationItem[]; unread: number } | null) => {
    if (!data) return;
    setItems(data.notifications);
    setUnread(data.unread);
    setFetchedAt(Date.now());
  }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = () =>
      fetch("/api/notifications")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => !cancelled && apply(data))
        .catch(() => {});
    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [apply]);

  const markRead = async (body: { ids?: string[]; all?: boolean }) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
    const res = await fetch("/api/notifications").catch(() => null);
    apply(res?.ok ? await res.json() : null);
  };

  const openItem = async (item: NotificationItem) => {
    setOpen(false);
    if (!item.readAt) await markRead({ ids: [item.id] });
    if (item.link) router.push(item.link);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        className="relative cursor-pointer rounded-full border border-slate-200/60 bg-white p-2 text-slate-500 shadow-sm transition-all hover:text-slate-700 hover:shadow"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
              <p className="text-xs font-bold text-slate-900">Notifications</p>
              {unread > 0 && (
                <button onClick={() => markRead({ all: true })} className="flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-slate-400">You are all caught up.</p>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openItem(item)}
                    className={`flex w-full cursor-pointer gap-2.5 border-b border-slate-50 px-3.5 py-2.5 text-left last:border-0 hover:bg-slate-50 ${item.readAt ? "" : "bg-blue-50/40"}`}
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.readAt ? "bg-transparent" : "bg-blue-500"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-slate-900">{item.title}</span>
                      {item.body && <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{item.body}</span>}
                      <span className="mt-0.5 block text-[10px] text-slate-400">{timeAgo(item.createdAt, fetchedAt)}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
