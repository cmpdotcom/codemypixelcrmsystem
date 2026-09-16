"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart2,
  Trophy,
  DollarSign,
  TrendingUp,
  Target,
  CheckSquare,
  Users,
  Flame,
  Award,
  Loader2,
  AlertCircle,
  Clock,
  Briefcase,
} from "lucide-react";

interface MemberRank {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: string;
  revenueWon: number;
  qualifiedLeads: number;
  completedTasks: number;
  activitiesCount: number;
  score: number;
}

interface KPIStats {
  totalRevenueWon: string;
  totalLeadsCount: number;
  totalTasksCompleted: number;
  totalHoursLogged: number;
  activeTeamMembers: number;
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-800",
  "bg-blue-100 text-blue-800",
  "bg-emerald-100 text-emerald-800",
  "bg-purple-100 text-purple-800",
  "bg-rose-100 text-rose-800",
];

const BADGE_MEDALS = ["🥇", "🥈", "🥉"];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PerformancePage() {
  const [rankings, setRankings] = useState<MemberRank[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    totalRevenueWon: "$0",
    totalLeadsCount: 0,
    totalTasksCompleted: 0,
    totalHoursLogged: 0,
    activeTeamMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(async () => {
    try {
      const res = await fetch("/api/team/performance");
      if (!res.ok) throw new Error("Failed to load performance telemetry");
      const data = await res.json();
      setRankings(data.rankings || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading organization performance...</span>
      </div>
    );
  }

  const topPerformer = rankings.length > 0 ? rankings[0] : null;

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Performance</h1>
          <p className="mt-1 text-xs text-slate-500">
            Cross-functional KPI dashboard, team leaderboard, sales revenue delivery, and sprint outputs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/team/setters"
            className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            Setters Matrix
          </Link>
          <Link
            href="/team/closers"
            className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            Closers Matrix
          </Link>
          <Link
            href="/team/developers"
            className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            Developers Matrix
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

      {/* Row of 5 Metric KPI Cards (Calculated directly from Database) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Revenue Won</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalRevenueWon}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Total closed deals</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Leads</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalLeadsCount}</h3>
            <p className="text-[10px] text-purple-600 font-semibold">Marketing pipeline</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Tasks Completed</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalTasksCompleted}</h3>
            <p className="text-[10px] text-blue-600 font-semibold">Sprint engineering</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Logged Hours</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalHoursLogged} hrs</h3>
            <p className="text-[10px] text-indigo-600 font-semibold">Development hours</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active Staff</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.activeTeamMembers}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">Cross-functional</p>
          </div>
        </div>
      </div>

      {/* MVP Leader Spotlight */}
      {topPerformer && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 text-xl font-extrabold shadow-sm">
              <Trophy className="w-7 h-7 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-slate-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Organization MVP Leader
                </span>
                <span className="text-xs text-white/90">{topPerformer.team}</span>
              </div>
              <h2 className="text-xl font-extrabold mt-1">{topPerformer.name}</h2>
              <p className="text-xs text-white/90 mt-0.5">{topPerformer.role} • {topPerformer.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-white/30 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/80 block">Impact Score</span>
              <span className="text-xl font-extrabold text-yellow-200 mt-0.5 block">{topPerformer.score} pts</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/80 block">Revenue Won</span>
              <span className="text-xl font-extrabold mt-0.5 block">${topPerformer.revenueWon.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/80 block">Tasks Done</span>
              <span className="text-xl font-extrabold mt-0.5 block">{topPerformer.completedTasks}</span>
            </div>
          </div>
        </div>
      )}

      {/* Organization Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Overall Team Leaderboard & Output Score</h2>
            <p className="text-xs text-slate-400 mt-0.5">Calculated composite score based on revenue closed, qualified leads, tasks done, and activities</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Team</th>
                <th className="py-3 px-3 text-center">Revenue Closed</th>
                <th className="py-3 px-3 text-center">Qualified Leads</th>
                <th className="py-3 px-3 text-center">Sprint Tasks</th>
                <th className="py-3 px-3 text-center">Activities</th>
                <th className="py-3 px-4 text-right">Composite Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankings.map((mem, idx) => (
                <tr key={mem.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-sm">
                    {idx < 3 ? (
                      <span className="text-lg">{BADGE_MEDALS[idx]}</span>
                    ) : (
                      <span className="text-slate-400">#{idx + 1}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                          AVATAR_COLORS[idx % AVATAR_COLORS.length]
                        }`}
                      >
                        {getInitials(mem.name)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{mem.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{mem.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {mem.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {mem.team}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                    {mem.revenueWon > 0 ? `$${mem.revenueWon.toLocaleString()}` : "—"}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-emerald-600">
                    {mem.qualifiedLeads > 0 ? mem.qualifiedLeads : "—"}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-blue-600">
                    {mem.completedTasks > 0 ? mem.completedTasks : "—"}
                  </td>

                  <td className="py-3.5 px-3 text-center text-slate-600">
                    {mem.activitiesCount > 0 ? mem.activitiesCount : "—"}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{mem.score} pts</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
