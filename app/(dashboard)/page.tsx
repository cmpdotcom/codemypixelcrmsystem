"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Briefcase,
  UserPlus,
  FolderKanban,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Monitor,
  Calendar,
  Box,
  Target,
  Smartphone,
  Database,
  Check,
  Loader2,
  Inbox,
} from "lucide-react";
import { hasPermission, PermissionAction } from "@/lib/permissions";

// --- Types for the /api/dashboard response ---
interface DashboardData {
  kpi: {
    totalLeads: number;
    leadsThisMonth: number;
    activeDeals: number;
    pipelineValue: number;
    wonRevenueThisMonth: number;
    activeProjects: number;
    teamMembers: number;
  };
  revenueTrend: { name: string; value: number }[];
  funnel: { name: string; value: number; percentage: string; color: string }[];
  recentLeads: { id: string; name: string; desc: string; status: string; time: string }[];
  activeDeals: { id: string; name: string; desc: string; value: number; stage: string; probability: number }[];
  projectProgress: { id: string; name: string; desc: string; progress: number }[];
  teamPerformance: { id: string; name: string; role: string; leads: number; deals: number; revenue: number }[];
  todayTasks: { id: string; title: string; time: string; tag: string; status: string; completed: boolean }[];
  activityTimeline: { id: string; action: string; type: string; by: string; time: string }[];
}

const statusStyles: Record<string, string> = {
  New: "bg-rose-50 text-rose-500 border border-rose-100",
  Contacted: "bg-sky-50 text-sky-600 border border-sky-100",
  Qualified: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Meeting: "bg-amber-50 text-amber-600 border border-amber-100",
  Proposal: "bg-blue-50 text-blue-600 border border-blue-100",
  "Not Interested": "bg-red-50 text-red-500 border border-red-100",
  Nurture: "bg-purple-50 text-purple-600 border border-purple-100",
  Converted: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Lost: "bg-slate-100 text-slate-500 border border-slate-200",
};

const stageStyles: Record<string, string> = {
  qualified: "bg-purple-50 text-purple-600 border border-purple-100",
  discovery: "bg-purple-50 text-purple-600 border border-purple-100",
  proposal: "bg-blue-50 text-blue-600 border border-blue-100",
  negotiation: "bg-amber-50 text-amber-600 border border-amber-100",
  contract: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

const dealIcons = [Briefcase, Monitor, Smartphone, Database, Target];
const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
];
const activityIcons: Record<string, { icon: typeof Phone; bg: string }> = {
  Call: { icon: Phone, bg: "bg-emerald-500" },
  Email: { icon: Mail, bg: "bg-blue-500" },
  Meeting: { icon: Calendar, bg: "bg-purple-500" },
  WhatsApp: { icon: MessageCircle, bg: "bg-green-500" },
  Note: { icon: FileText, bg: "bg-amber-500" },
  Task: { icon: Check, bg: "bg-emerald-500" },
  SMS: { icon: MessageCircle, bg: "bg-sky-500" },
  Other: { icon: UserPlus, bg: "bg-slate-500" },
};

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "—";
}

function getAvatarBg(name: string) {
  const hash = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
  return avatarColors[hash % avatarColors.length];
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

// Funnel Graphic (SVG Polygon Trapezoid Layers) — decorative, proportions are illustrative
const FunnelGraphic = () => {
  const layers = [
    { topW: 200, botW: 172, y1: 0, y2: 24, fill: "#3b82f6" },
    { topW: 168, botW: 140, y1: 28, y2: 52, fill: "#38bdf8" },
    { topW: 136, botW: 108, y1: 56, y2: 80, fill: "#34d399" },
    { topW: 104, botW: 76, y1: 84, y2: 108, fill: "#fbbf24" },
    { topW: 72, botW: 48, y1: 112, y2: 136, fill: "#fb923c" },
    { topW: 44, botW: 30, y1: 140, y2: 164, fill: "#c084fc" },
  ];
  const centerX = 110;
  return (
    <svg viewBox="0 0 220 170" className="w-full h-44 drop-shadow-sm">
      {layers.map((l, i) => {
        const x1 = centerX - l.topW / 2;
        const x2 = centerX + l.topW / 2;
        const x3 = centerX + l.botW / 2;
        const x4 = centerX - l.botW / 2;
        const points = `${x1},${l.y1} ${x2},${l.y1} ${x3},${l.y2} ${x4},${l.y2}`;
        return (
          <polygon
            key={i}
            points={points}
            fill={l.fill}
            rx={4}
            className="transition-all duration-300 hover:opacity-90 cursor-pointer"
          />
        );
      })}
    </svg>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "User";
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<DashboardData["todayTasks"]>([]);

  const canView = (module: string) =>
    !session?.user?.roleName ||
    session.user.roleName === "Super Admin" ||
    hasPermission(
      session.user.permissions,
      module,
      "view" as PermissionAction
    );
  const hasDashboardWidgets = [
    "Leads",
    "Deals",
    "Payments",
    "Projects",
    "Users",
    "Tasks",
    "Performance",
    "Activities",
  ].some(canView);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard");
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload) throw new Error(payload?.error || "Could not load live dashboard data.");
      const json = payload as DashboardData;
      setData(json);
      setTasks(json.todayTasks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load live dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchDashboard();
  }, [fetchDashboard]);

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus = task.completed ? "Todo" : "Done";
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed, status: nextStatus } : t)));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: task.completed, status: task.status } : t)));
    }
  };

  const todayLabel = mounted
    ? new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  const revenueTrend = data?.revenueTrend || [];
  const lastMonth = revenueTrend[revenueTrend.length - 1]?.value ?? 0;
  const prevMonth = revenueTrend[revenueTrend.length - 2]?.value ?? 0;
  const revenueDeltaPct = prevMonth > 0 ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100) : null;

  const funnel = data?.funnel || [];
  const recentLeads = data?.recentLeads || [];
  const activeDeals = data?.activeDeals || [];
  const projectProgress = data?.projectProgress || [];
  const teamPerformance = data?.teamPerformance || [];
  const activityTimeline = data?.activityTimeline || [];

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
          {/* Greeting & Date Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Good Morning, {firstName}!{" "}
                <span className="text-2xl animate-wave">👋</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Here&apos;s what&apos;s happening with your business today.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <div className="flex items-center gap-4">
                <div className="text-left md:text-right">
                  <p className="text-xs font-semibold text-slate-800">
                    {todayLabel}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center md:justify-end gap-1">
                    Make it a productive day! 🚀
                  </p>
                </div>
                <button
                  onClick={fetchDashboard}
                  className="bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-3">
              <span className="flex-1">{error}</span>
              <button onClick={fetchDashboard} className="text-red-700 hover:text-red-900 font-semibold underline underline-offset-2 cursor-pointer">
                Retry
              </button>
            </div>
          )}

          {/* Row 1: KPI Cards (5 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {/* Total Leads */}
            {canView("Leads") && <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Total Leads</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {loading ? "—" : (data?.kpi.totalLeads ?? 0).toLocaleString()}
                </h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {loading ? "Loading…" : `+${data?.kpi.leadsThisMonth ?? 0} this month`}
                </span>
              </div>
            </div>}

            {/* Active Deals */}
            {canView("Deals") && <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Active Deals</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? "—" : data?.kpi.activeDeals ?? 0}</h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {loading ? "Loading…" : `${formatCurrency(data?.kpi.pipelineValue ?? 0)} pipeline`}
                </span>
              </div>
            </div>}

            {/* Won Revenue */}
            {canView("Payments") && <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Won Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {loading ? "—" : formatCurrency(data?.kpi.wonRevenueThisMonth ?? 0)}
                </h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">This month</span>
              </div>
            </div>}

            {/* Active Projects */}
            {canView("Projects") && <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Box className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">
                  Active Projects
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? "—" : data?.kpi.activeProjects ?? 0}</h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Currently in progress</span>
              </div>
            </div>}

            {/* Team Members */}
            {canView("Users") && <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">
                  Team Members
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? "—" : data?.kpi.teamMembers ?? 0}</h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Active across the workspace
                </span>
              </div>
            </div>}
          </div>

          {/* Row 2: Charts & Today's Tasks (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5">
            {/* 1. Revenue Overview (5 cols) */}
            {canView("Payments") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 xl:col-span-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Revenue Overview
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatCurrency(lastMonth)}
                    </span>
                    {revenueDeltaPct !== null && (
                      <span className={`flex items-center text-xs font-bold ${revenueDeltaPct >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {revenueDeltaPct >= 0 ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                        {Math.abs(revenueDeltaPct)}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Won revenue, last 6 months
                  </p>
                </div>
              </div>

              <div className="h-56 w-full mt-4 relative">
                {mounted && revenueTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueTrend}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="revenueGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        dy={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        tickFormatter={(v) => `${v / 1000}K`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          fontSize: "12px",
                        }}
                        formatter={(val) => [
                          `$${Number(val).toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#revenueGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-50/50 rounded-xl" />
                )}
              </div>
            </div>}

            {/* 2. Lead Conversion Funnel (4 cols) */}
            {canView("Leads") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 xl:col-span-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Lead Conversion Funnel
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                {/* Left: SVG Trapezoid Funnel */}
                <div className="w-full max-w-[220px] sm:max-w-none sm:w-1/2 flex items-center justify-center">
                  <FunnelGraphic />
                </div>

                {/* Right: Funnel Data Rows */}
                <div className="w-full sm:w-1/2 space-y-2">
                  {funnel.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-bold text-slate-800">
                          {item.value}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium">
                        {item.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>}

            {/* 3. Today's Tasks (3 cols) */}
            {canView("Tasks") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 md:col-span-2 xl:col-span-3 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Today&apos;s Tasks
                </h3>
                <Link
                  href="/projects/tasks"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>

              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center flex-1">
                  <Inbox className="w-7 h-7 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400">Nothing due today.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          task.completed
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300 bg-white group-hover:border-blue-400"
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3" />}
                      </div>

                      {/* Icon */}
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
                        <FileText className="w-3.5 h-3.5" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            task.completed
                              ? "line-through text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> {task.time}
                        </p>
                      </div>

                      {/* Tag Badge */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 bg-blue-50 text-blue-600 border border-blue-100">
                        {task.tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>}
          </div>

          {/* Row 3: Recent Leads, Active Deals, Project Progress (3 Equal Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {/* 1. Recent Leads */}
            {canView("Leads") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Recent Leads</h3>
                <a
                  href="/leads"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              {recentLeads.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No leads yet.</p>
              ) : (
              <div className="space-y-3.5">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads?lead=${lead.id}`}
                    className="flex items-center justify-between p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarBg(lead.name)}`}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                          {lead.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {lead.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusStyles[lead.status] || statusStyles.New}`}
                      >
                        {lead.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {lead.time}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              )}
            </div>}

            {/* 2. Active Deals */}
            {canView("Deals") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Active Deals</h3>
                <Link
                  href="/deals"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>
              {activeDeals.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No active deals.</p>
              ) : (
              <div className="space-y-3.5">
                {activeDeals.map((deal, i) => {
                  const Icon = dealIcons[i % dealIcons.length];
                  return (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {deal.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {deal.desc}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(deal.value)}
                        </span>
                        <div className="flex flex-col items-end gap-1 w-20">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold text-center w-full truncate capitalize ${stageStyles[deal.stage] || "bg-slate-100 text-slate-500 border border-slate-200"}`}
                          >
                            {deal.stage}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {deal.probability}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>}

            {/* 3. Project Progress */}
            {canView("Projects") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Project Progress
                </h3>
                <Link
                  href="/projects"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>
              {projectProgress.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No active projects.</p>
              ) : (
              <div className="space-y-4">
                {projectProgress.map((project) => (
                  <div
                    key={project.id}
                    className="p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FolderKanban className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {project.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {project.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 shrink-0">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden ml-10 max-w-[calc(100%-40px)]">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>}
          </div>

          {/* Row 4: Team Performance, Activity Timeline, Promotional Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5">
            {/* 1. Team Performance (5 cols) */}
            {canView("Performance") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 md:col-span-2 xl:col-span-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Team Performance
                </h3>
                <Link href="/team/performance" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
              </div>
              {teamPerformance.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No performance data yet.</p>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="pb-2.5 font-medium">Team Member</th>
                      <th className="pb-2.5 font-medium">Role</th>
                      <th className="pb-2.5 font-medium">Qualified Leads</th>
                      <th className="pb-2.5 font-medium">Deals Won</th>
                      <th className="pb-2.5 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teamPerformance.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-900 flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${getAvatarBg(member.name)}`}>
                            {getInitials(member.name)}
                          </div>
                          <span>{member.name}</span>
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                            {member.role}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-600">{member.leads}</td>
                        <td className="py-2.5 text-slate-600">{member.deals}</td>
                        <td className="py-2.5 font-bold text-slate-900 text-right">
                          {formatCurrency(member.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>}

            {/* 2. Activity Timeline (4 cols) */}
            {canView("Activities") && <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 xl:col-span-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Activity Timeline
                </h3>
                <Link href="/activities" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
              </div>
              {activityTimeline.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No recent activity.</p>
              ) : (
              <div className="space-y-3.5 relative">
                {activityTimeline.map((item) => {
                  const config = activityIcons[item.type] || activityIcons.Other;
                  const Icon = config.icon;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ${config.bg}`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">
                          {item.action}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block">
                          {item.time}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.by}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>}

            {/* 3. Promotional Card: Turn Opportunities Into Success (3 cols) */}
            {canView("Reports") && <div className="bg-gradient-to-br from-[#e8f1ff] via-[#f0f4ff] to-[#f5f0ff] rounded-2xl border border-blue-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 xl:col-span-3 flex flex-col justify-between relative overflow-hidden">
              {/* 3D Isometric Pastel Cubes Graphic */}
              <div className="absolute top-3 right-3 pointer-events-none opacity-90">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  {/* Top isometric cube */}
                  <path
                    d="M50 15L75 28L50 41L25 28L50 15Z"
                    fill="#93c5fd"
                  />
                  <path
                    d="M25 28L50 41V65L25 52V28Z"
                    fill="#60a5fa"
                  />
                  <path
                    d="M75 28L50 41V65L75 52V28Z"
                    fill="#3b82f6"
                  />
                  {/* Bottom layered shadow cube */}
                  <path
                    d="M50 48L75 61L50 74L25 61L50 48Z"
                    fill="#d8b4fe"
                    opacity="0.85"
                  />
                  <path
                    d="M25 61L50 74V95L25 82V61Z"
                    fill="#c084fc"
                    opacity="0.9"
                  />
                  <path
                    d="M75 61L50 74V95L75 82V61Z"
                    fill="#a855f7"
                    opacity="0.95"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug max-w-[170px]">
                  Turn Opportunities Into Success
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Manage leads, close deals, deliver projects and grow your
                  business — all in one place.
                </p>
                <div className="mt-4">
                  <Link href="/reports" className="inline-flex bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all shadow-sm shadow-blue-500/25 items-center gap-1.5 cursor-pointer">
                    View Reports <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-blue-200/50 flex items-start gap-2">
                <span className="text-2xl text-blue-400 font-serif leading-none inline-block">
                  &ldquo;
                </span>
                <div>
                  <p className="text-xs italic text-slate-700">
                    &ldquo;A better process leads to a brighter future.&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                    — CMP CRM, Your Growth Partner
                  </p>
                </div>
              </div>
            </div>}
          </div>

          {!hasDashboardWidgets && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
              No dashboard widgets are enabled for your role. Ask an administrator to update your permissions.
            </div>
          )}
        </div>
    </>
  );
}
