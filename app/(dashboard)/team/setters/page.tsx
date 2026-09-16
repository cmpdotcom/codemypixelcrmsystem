"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  UserPlus,
  Users,
  Target,
  Phone,
  CheckCircle2,
  TrendingUp,
  Search,
  Plus,
  ChevronRight,
  Flame,
  Award,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  Building2,
  Calendar,
} from "lucide-react";

interface SetterItem {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: string;
  totalLeads: number;
  qualifiedLeads: number;
  contactedLeads: number;
  meetingsBooked: number;
  callsLogged: number;
  qualificationRate: string;
  conversionNum: number;
}

interface KPIStats {
  activeSettersCount: number;
  totalAssignedLeads: number;
  totalQualified: number;
  avgQualRate: string;
  totalCalls: number;
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
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

export default function SettersPage() {
  const [setters, setSetters] = useState<SetterItem[]>([]);
  const [kpi, setKpi] = useState<KPIStats>({
    activeSettersCount: 0,
    totalAssignedLeads: 0,
    totalQualified: 0,
    avgQualRate: "0%",
    totalCalls: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchSetters = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/team/setters?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load setters telemetry");
      const data = await res.json();
      setSetters(data.setters || []);
      if (data.kpi) setKpi(data.kpi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSetters();
  }, [fetchSetters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading setter performance...</span>
      </div>
    );
  }

  // Top setter for leaderboard badge
  const topSetter = setters.length > 0 ? setters[0] : null;

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Setters (SDRs)</h1>
          <p className="mt-1 text-xs text-slate-500">
            Outreach performance, qualification velocity, booked calls, and lead distribution analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/lead-assignment"
            className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            Assignment Rules
          </Link>
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Assign Leads</span>
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
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active Setters</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.activeSettersCount}</h3>
            <p className="text-[10px] text-slate-400">Team members</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Assigned Leads</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalAssignedLeads}</h3>
            <p className="text-[10px] text-purple-600 font-semibold">Active in pipeline</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Qualified Leads</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalQualified}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Passed to closers</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Avg. Qual. Rate</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.avgQualRate}</h3>
            <p className="text-[10px] text-amber-600 font-semibold">Conversion ratio</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-500">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Outreach Calls</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.totalCalls}</h3>
            <p className="text-[10px] text-rose-500 font-semibold">Activities logged</p>
          </div>
        </div>
      </div>

      {/* Top Leader Highlight Banner */}
      {topSetter && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 text-xl font-extrabold shadow-sm">
              <Award className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Top Performing Setter
                </span>
                <span className="text-xs text-white/80">{topSetter.team}</span>
              </div>
              <h2 className="text-xl font-extrabold mt-1">{topSetter.name}</h2>
              <p className="text-xs text-white/80 mt-0.5">{topSetter.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-white/20 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Active Leads</span>
              <span className="text-xl font-extrabold mt-0.5 block">{topSetter.totalLeads}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Qualified</span>
              <span className="text-xl font-extrabold mt-0.5 block">{topSetter.qualifiedLeads}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-white/70 block">Qual. Rate</span>
              <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">{topSetter.qualificationRate}</span>
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
            placeholder="Search setters by name or email..."
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

      {/* Setters Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Setter Performance Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">Live workload allocation and conversion metrics from database</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {setters.length} setters recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Setter Name</th>
                <th className="py-3 px-3">Team</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Assigned Leads</th>
                <th className="py-3 px-3 text-center">Qualified</th>
                <th className="py-3 px-3 text-center">Meetings Booked</th>
                <th className="py-3 px-3 text-center">Calls Logged</th>
                <th className="py-3 px-4">Qual. Rate</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {setters.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No setters found matching your query.
                  </td>
                </tr>
              ) : (
                setters.map((setter, idx) => (
                  <tr key={setter.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                            AVATAR_COLORS[idx % AVATAR_COLORS.length]
                          }`}
                        >
                          {getInitials(setter.name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{setter.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{setter.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {setter.team}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          setter.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {setter.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-extrabold text-slate-900 text-sm">
                      {setter.totalLeads}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-emerald-600">
                      {setter.qualifiedLeads}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-indigo-600">
                      {setter.meetingsBooked}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-700 font-medium">
                      {setter.callsLogged}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Rate</span>
                          <span className="font-bold text-slate-800">{setter.qualificationRate}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(setter.conversionNum, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-right">
                      <Link
                        href={`/leads?setter=${encodeURIComponent(setter.name)}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>View Leads</span>
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
