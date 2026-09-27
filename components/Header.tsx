"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Grid, ChevronDown, Settings, LogOut, Menu } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Ahmed Raza";
  const userEmail = session?.user?.email ?? "admin@nexacrm.com";

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      {/* Mobile / tablet menu button */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Input */}
      <div className="flex-1 max-w-md relative min-w-0">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search leads, deals, clients, projects..."
          className="block w-full pl-10 pr-3 sm:pr-12 py-2 bg-white/90 hover:bg-white border border-slate-200/60 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 hidden sm:flex items-center pointer-events-none">
          <kbd className="inline-flex items-center border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-slate-50">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <NotificationBell />

        <button className="hidden sm:inline-flex p-2 text-slate-500 hover:text-slate-700 bg-white rounded-full border border-slate-200/60 shadow-sm hover:shadow transition-all">
          <Grid className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 sm:gap-2.5 pl-1 sm:pl-2 pr-1 sm:pr-2 py-1 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <img
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-white shadow-sm object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt={userName}
            />
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-900 max-w-[140px] truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 font-medium">{session?.user?.roleName || ""}</p>
            </div>
            <ChevronDown
              className={`hidden sm:block h-3.5 w-3.5 text-slate-400 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              {/* Click-away overlay */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl border border-slate-200/80 shadow-lg shadow-slate-200/50 py-1.5 z-40 overflow-hidden">
                {/* User info header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {userEmail}
                  </p>
                  {session?.user?.roleName && (
                    <p className="md:hidden text-[10px] text-slate-500 font-semibold mt-0.5">{session.user.roleName}</p>
                  )}
                </div>

                {/* Settings */}
                <Link
                  href="/settings/general"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Settings</span>
                </Link>

                {/* Log Out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
