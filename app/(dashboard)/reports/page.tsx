"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Loader2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  Wallet,
  Target,
  Trophy,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { useSettings } from "@/components/SettingsProvider";

interface KPI {
  totalRevenue: number;
  collected: number;
  receivables: number;
  pipelineValue: number;
  totalDeals: number;
  wonDeals: number;
  winRate: string;
  totalLeads: number;
  conversionRate: string;
  totalTasks: number;
  completedTasks: number;
  totalActivities: number;
  commissionsPaid: number;
  totalProjects: number;
  openBugs: number;
}

interface ChartPoint {
  name: string;
  value: number;
}

interface TrendPoint {
  label: string;
  revenue: number;
  collected: number;
  deals: number;
  leads: number;
}

interface LeaderRow {
  name: string;
  role: string;
  revenue: number;
  deals: number;
  commissions: number;
  tasks: number;
}

interface TopDeal {
  title: string;
  company: string;
  value: number;
  closer: string | null;
}

interface ReportData {
  kpi: KPI;
  revenueTrend: TrendPoint[];
  dealsByStage: ChartPoint[];
  dealValueByStage: ChartPoint[];
  leadsBySource: ChartPoint[];
  leadsByStatus: ChartPoint[];
  tasksByStatus: ChartPoint[];
  bugsBySeverity: ChartPoint[];
  projectsByHealth: ChartPoint[];
  paymentsByStatus: ChartPoint[];
  teamLeaderboard: LeaderRow[];
  topDeals: TopDeal[];
}

const PERIODS = [
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "12m", label: "Last 12 Months" },
  { value: "all", label: "All Time" },
];

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#06b6d4", "#84cc16", "#f97316"];
const STATUS_COLORS: Record<string, string> = {
  Done: "#10b981", "In Progress": "#3b82f6", Todo: "#94a3b8", Backlog: "#cbd5e1",
  "Code Review": "#8b5cf6", QA: "#06b6d4", Revision: "#f59e0b", Blocked: "#f43f5e",
  Paid: "#10b981", Pending: "#3b82f6", Partial: "#f59e0b", Overdue: "#f43f5e", Refunded: "#94a3b8",
  "on-track": "#10b981", "at-risk": "#f59e0b", critical: "#f43f5e",
  Critical: "#f43f5e", High: "#f97316", Medium: "#f59e0b", Low: "#10b981",
};

const ROLE_STYLES: Record<string, string> = {
  Closer: "bg-purple-50 text-purple-600 border border-purple-100",
  Setter: "bg-sky-50 text-sky-600 border border-sky-100",
  Developer: "bg-indigo-50 text-indigo-600 border border-indigo-100",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 3).toUpperCase();
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="h-[240px] w-full">{children}</div>
    </div>
  );
}

export default function ReportsPage() {
  const { money: fmt, moneyCompact: fmtK } = useSettings();
  const [period, setPeriod] = useState("all");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/reports?period=${period}`);
      if (!res.ok) throw new Error("Failed to load report");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    setLoading(true);
    fetchReport();
  }, [fetchReport]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Generating report...</span>
      </div>
    );
  }

  const kpi = data?.kpi;

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reports &amp; Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-module business intelligence — revenue, sales pipeline, delivery, and team performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                period === p.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {p.label}
            </button>
          ))}
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

      {loading && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing…
        </div>
      )}

      {/* KPI Cards */}
      {kpi && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { label: "Total Revenue", value: fmt(kpi.totalRevenue), sub: `${kpi.wonDeals} deals won`, icon: DollarSign, style: "bg-emerald-50 text-emerald-600" },
            { label: "Collected", value: fmt(kpi.collected), sub: `${fmt(kpi.receivables)} receivable`, icon: Wallet, style: "bg-blue-50 text-blue-600" },
            { label: "Pipeline Value", value: fmt(kpi.pipelineValue), sub: `${kpi.totalDeals} total deals`, icon: Briefcase, style: "bg-purple-50 text-purple-600" },
            { label: "Win Rate", value: kpi.winRate, sub: "of closed deals", icon: Target, style: "bg-amber-50 text-amber-600" },
            { label: "Leads", value: String(kpi.totalLeads), sub: `${kpi.conversionRate} qualified`, icon: Users, style: "bg-sky-50 text-sky-600" },
            { label: "Tasks Done", value: String(kpi.completedTasks), sub: `of ${kpi.totalTasks} tasks`, icon: CheckCircle2, style: "bg-indigo-50 text-indigo-600" },
          ].map((card) => (
            <div key={card.label} className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${card.style}`}>
                <card.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-[11px] font-medium text-slate-500">{card.label}</p>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 leading-tight">{card.value}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {data && (
        <>
          {/* Revenue Trend + Deal Value by Stage */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChartCard title="Revenue & Collections Trend" subtitle="Won deal revenue vs collected payments per month">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={fmtK} />
                  <RechartsTooltip formatter={(val?: any) => [fmt(Number(val || 0)), ""]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue Won" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="collected" name="Collected" stroke="#10b981" fill="url(#colGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Deal Value by Stage" subtitle="Total dollar value sitting in each pipeline stage">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dealValueByStage} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={fmtK} />
                  <RechartsTooltip formatter={(val?: any) => [fmt(Number(val || 0)), "Value"]} />
                  <Bar dataKey="value" name="Deal Value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Pie charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <ChartCard title="Leads by Source" subtitle="Acquisition channel split">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.leadsBySource} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {data.leadsBySource.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Tasks by Status" subtitle="Delivery workload distribution">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.tasksByStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {data.tasksByStatus.map((t, i) => (
                      <Cell key={i} fill={STATUS_COLORS[t.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Payments by Status" subtitle="Invoice collection split">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.paymentsByStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {data.paymentsByStatus.map((p, i) => (
                      <Cell key={i} fill={STATUS_COLORS[p.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Project Health" subtitle="Delivery risk distribution">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.projectsByHealth} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {data.projectsByHealth.map((p, i) => (
                      <Cell key={i} fill={STATUS_COLORS[p.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Team Leaderboard + Top Deals */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Team Leaderboard */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-500" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Team Leaderboard</h3>
                  <p className="text-[11px] text-slate-400">Revenue won, deals closed, tasks completed</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
                    <tr>
                      <th className="py-2.5 px-2 font-medium">#</th>
                      <th className="py-2.5 px-3 font-medium">Member</th>
                      <th className="py-2.5 px-3 font-medium">Role</th>
                      <th className="py-2.5 px-3 font-medium text-right">Revenue</th>
                      <th className="py-2.5 px-3 font-medium text-right">Won</th>
                      <th className="py-2.5 px-3 font-medium text-right">Tasks</th>
                      <th className="py-2.5 px-3 font-medium text-right">Paid Comm.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.teamLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400">No team activity in this period.</td>
                      </tr>
                    ) : (
                      data.teamLeaderboard.map((m, i) => (
                        <tr key={m.name} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-2">
                            <span className={`inline-flex w-5 h-5 rounded-md items-center justify-center text-[10px] font-extrabold ${
                              i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "text-slate-400"
                            }`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[9px] font-extrabold shrink-0">
                                {getInitials(m.name)}
                              </div>
                              <span className="font-bold text-slate-900">{m.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold ${ROLE_STYLES[m.role] || "bg-slate-100 text-slate-500"}`}>
                              {m.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">{fmt(m.revenue)}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">{m.deals}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">{m.tasks}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">{fmt(m.commissions)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Won Deals */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Top Won Deals</h3>
                  <p className="text-[11px] text-slate-400">Highest value closed deals</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {data.topDeals.length === 0 ? (
                  <p className="text-center py-10 text-slate-400 text-xs">No won deals in this period.</p>
                ) : (
                  data.topDeals.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3">
                      <span className={`inline-flex w-6 h-6 rounded-lg items-center justify-center text-[10px] font-extrabold shrink-0 ${
                        i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{d.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {d.company} {d.closer ? `· ${d.closer}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-600 shrink-0">{fmt(d.value)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Quick stats footer */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-base font-extrabold text-slate-900">{kpi?.totalActivities ?? 0}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Activities</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-extrabold text-slate-900">{kpi?.totalProjects ?? 0}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-extrabold text-slate-900">{kpi?.openBugs ?? 0}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Open Bugs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leads by Status + Bugs by Severity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChartCard title="Leads by Status" subtitle="Pipeline lead funnel distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.leadsByStatus} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} width={80} />
                  <RechartsTooltip />
                  <Bar dataKey="value" name="Leads" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Bugs by Severity" subtitle="QA defect distribution across projects">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.bugsBySeverity} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="value" name="Bugs" radius={[4, 4, 0, 0]}>
                    {data.bugsBySeverity.map((b, i) => (
                      <Cell key={i} fill={STATUS_COLORS[b.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
