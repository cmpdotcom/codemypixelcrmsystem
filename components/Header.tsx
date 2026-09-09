"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Search, Bell, Grid, ChevronDown, Settings, LogOut } from "lucide-react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Ahmed Raza";
  const userEmail = session?.user?.email ?? "admin@nexacrm.com";

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search leads, deals, clients, projects..."
          className="block w-full pl-10 pr-12 py-2 bg-white/90 hover:bg-white border border-slate-200/60 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="inline-flex items-center border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-slate-50">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 bg-white rounded-full border border-slate-200/60 shadow-sm hover:shadow transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <button className="p-2 text-slate-500 hover:text-slate-700 bg-white rounded-full border border-slate-200/60 shadow-sm hover:shadow transition-all">
          <Grid className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-2 py-1 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <img
              className="h-9 w-9 rounded-full border border-white shadow-sm object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt={userName}
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-900">{userName}</p>
              <p className="text-[10px] text-slate-400 font-medium">Admin</p>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
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
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200/80 shadow-lg shadow-slate-200/50 py-1.5 z-40 overflow-hidden">
                {/* User info header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {userEmail}
                  </p>
                </div>

                {/* Settings */}
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Settings</span>
                </button>

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
