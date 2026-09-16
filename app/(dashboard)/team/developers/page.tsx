"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Code,
  CheckSquare,
  Clock,
  AlertTriangle,
  TrendingUp,
  Search,
  ChevronRight,
  Award,
  Loader2,
  AlertCircle,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";

interface DeveloperItem {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  totalEstimated: number;
  totalLogged: number;
  completionRate: string;
  completionNum: number;
}

interface KPIStats {
  activeDevsCount: number;
  totalDevTasks: number;
  totalCompleted: number;
  totalHoursLogged: number;
  totalBlocked: number;
}

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<DeveloperItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    activeDevsCount: 0,
    totalDevTasks: 0,
    totalCompleted: 0,
    totalHoursLogged: 0,
    totalBlocked: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchDevelopers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/team/developers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load developers data");
      const data = await res.json();
      setDevelopers(data.developers || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading engineering sprint velocity...</span>
      </div>
    );
  }

  const topDev = developers.length > 0 ? developers[0] : null;

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Engineering & Developers</h1>
          <p className="mt-1 text-xs text-slate-500">
            Sprint task completion, logged engineering hours, backlog progress, and blocked issue triaging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/projects/tasks"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Open Tasks Board</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {/* Row of 5 Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Developers</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.activeDevsCount}</h3>
            <p className="text-[10px] text-slate-400">Engineering team</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Sprint Tasks</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalDevTasks}</h3>
            <p className="text-[10px] text-blue-600 font-semibold">Tracked in database</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Completed Tasks</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalCompleted}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Done in sprints</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Logged Hours</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalHoursLogged} hrs</h3>
            <p className="text-[10px] text-purple-600 font-semibold">Development time</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Blocked Items</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalBlocked}</h3>
            <p className="text-[10px] text-rose-500 font-semibold">Requires unblocking</p>
          </div>
        </div>
      </div>

      {/* Top Engineer Highlight Banner */}
      {topDev && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 text-xl font-extrabold shadow-sm">
              <Award className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Sprint Velocity Leader
                </span>
                <span className="text-xs text-white/70">{topDev.team}</span>
              </div>
              <h2 className="text-xl font-extrabold mt-1">{topDev.name}</h2>
              <p className="text-xs text-white/70 mt-0.5">{topDev.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-white/20 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Completed</span>
              <span className="text-xl font-extrabold mt-0.5 block">{topDev.completedTasks} tasks</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Logged Hours</span>
              <span className="text-xl font-extrabold mt-0.5 block">{topDev.totalLogged} hrs</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Completion</span>
              <span className="text-xl font-extrabold text-indigo-400 mt-0.5 block">{topDev.completionRate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-3 flex items-center justify-between gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search engineers by name or email..."
            className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Developers Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Engineering Workload & Velocity</h2>
            <p className="text-xs text-slate-400 mt-0.5">Assigned tasks, hours logged, and completion ratios from Task database</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {developers.length} engineers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Developer</th>
                <th className="py-3 px-3">Role & Team</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Assigned Tasks</th>
                <th className="py-3 px-3 text-center">Completed</th>
                <th className="py-3 px-3 text-center">Active / Review</th>
                <th className="py-3 px-3 text-center">Hours Logged</th>
                <th className="py-3 px-4">Completion %</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {developers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No developers found matching query.
                  </td>
                </tr>
              ) : (
                developers.map((dev, idx) => (
                  <tr key={dev.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                            AVATAR_COLORS[idx % AVATAR_COLORS.length]
                          }`}
                        >
                          {getInitials(dev.name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{dev.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{dev.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800 block text-xs">{dev.role}</span>
                      <span className="text-[10px] text-slate-400">{dev.team}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dev.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {dev.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-slate-900 text-sm">
                      {dev.totalTasks}
                    </td>

                    <td className="py-3.5 px-3 text-center font-extrabold text-emerald-600">
                      {dev.completedTasks}
                    </td>

                    <td className="py-3.5 px-3 text-center font-medium text-blue-600">
                      {dev.activeTasks}
                    </td>

                    <td className="py-3.5 px-3 text-center font-semibold text-slate-700">
                      {dev.totalLogged} / {dev.totalEstimated} hrs
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Done</span>
                          <span className="font-bold text-slate-800">{dev.completionRate}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(dev.completionNum, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-right">
                      <Link
                        href={`/projects/tasks?assignee=${encodeURIComponent(dev.name)}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>View Tasks</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
