"use client";

import { Search } from "lucide-react";

interface SettingsPageHeaderProps {
  title: string;
  description: string;
}

export function SettingsPageHeader({ title, description }: SettingsPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search settings..."
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56"
          />
        </div>
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}
