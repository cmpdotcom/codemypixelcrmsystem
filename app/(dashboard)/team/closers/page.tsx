"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  UserCheck,
  Trophy,
  DollarSign,
  TrendingUp,
  Percent,
  Search,
  ChevronRight,
  Award,
  Loader2,
  AlertCircle,
  Briefcase,
  Layers,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

interface CloserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: string;
  totalDeals: number;
  wonDealsCount: number;
  lostDealsCount: number;
  activeDealsCount: number;
  revenueClosed: number;
  pipelineValue: number;
  winRate: string;
  winRateNum: number;
  avgDealSize: number;
}

interface KPIStats {
  activeClosersCount: number;
  totalRevenue: string;
  totalPipeline: string;
  wonDealsCount: number;
  overallWinRate: string;
}

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ClosersPage() {
  const { money: fmt } = useSettings();
  const [closers, setClosers] = useState<CloserItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    activeClosersCount: 0,
    totalRevenue: "$0",
    totalPipeline: "$0",
    wonDealsCount: 0,
    overallWinRate: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchClosers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/team/closers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load closers data");
      const data = await res.json();
      setClosers(data.closers || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchClosers();
  }, [fetchClosers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading closer revenue metrics...</span>
      </div>
    );
  }

  const topCloser = closers.length > 0 ? closers[0] : null;

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deal Closers (Account Executives)</h1>
          <p className="mt-1 text-xs text-slate-500">
            Revenue velocity, closed-won contracts, pipeline management, and win-rate analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/commissions"
            className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            Commission Tiers
          </Link>
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>View Deals Pipeline</span>
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
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active Closers</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.activeClosersCount}</h3>
            <p className="text-[10px] text-slate-400">Account executives</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Closed Revenue</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalRevenue}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Won contract value</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active Pipeline</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalPipeline}</h3>
            <p className="text-[10px] text-blue-600 font-semibold">Under negotiation</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Deals Closed</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.wonDealsCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">Contracts signed</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-sky-50 text-sky-600">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Overall Win Rate</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.overallWinRate}</h3>
            <p className="text-[10px] text-sky-600 font-semibold">Closed won / total</p>
          </div>
        </div>
      </div>

      {/* Top Closer Highlight Banner */}
      {topCloser && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 text-xl font-extrabold shadow-sm">
              <Award className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Top Revenue Producer
                </span>
                <span className="text-xs text-white/80">{topCloser.team}</span>
              </div>
              <h2 className="text-xl font-extrabold mt-1">{topCloser.name}</h2>
              <p className="text-xs text-white/80 mt-0.5">{topCloser.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-white/20 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Revenue Won</span>
              <span className="text-xl font-extrabold mt-0.5 block">{fmt(topCloser.revenueClosed)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Won Deals</span>
              <span className="text-xl font-extrabold mt-0.5 block">{topCloser.wonDealsCount}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Win Rate</span>
              <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">{topCloser.winRate}</span>
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
            placeholder="Search closers by name or email..."
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

      {/* Closers Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Closer Revenue Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time won contracts, active pipeline value, and win-rate ratios</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {closers.length} closers recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Closer Name</th>
                <th className="py-3 px-3">Team</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Won Deals</th>
                <th className="py-3 px-3 text-center">Active Pipeline</th>
                <th className="py-3 px-3 font-semibold text-slate-700">Closed Revenue</th>
                <th className="py-3 px-3">Avg Deal Size</th>
                <th className="py-3 px-4">Win Rate</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {closers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No closers found matching your query.
                  </td>
                </tr>
              ) : (
                closers.map((closer, idx) => (
                  <tr key={closer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                            AVATAR_COLORS[idx % AVATAR_COLORS.length]
                          }`}
                        >
                          {getInitials(closer.name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{closer.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{closer.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {closer.team}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          closer.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {closer.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-extrabold text-emerald-600 text-sm">
                      {closer.wonDealsCount}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                      {fmt(closer.pipelineValue)}
                    </td>

                    <td className="py-3.5 px-3 font-extrabold text-slate-900 text-sm">
                      {fmt(closer.revenueClosed)}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {fmt(closer.avgDealSize)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Win Rate</span>
                          <span className="font-bold text-slate-800">{closer.winRate}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(closer.winRateNum, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-right">
                      <Link
                        href={`/deals?closer=${encodeURIComponent(closer.name)}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>View Deals</span>
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
