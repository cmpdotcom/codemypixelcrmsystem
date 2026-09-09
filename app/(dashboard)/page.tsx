"use client";

import React, { useState, useEffect } from "react";
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
  LayoutDashboard,
  Users,
  Activity,
  Briefcase,
  Users2,
  UserPlus,
  FolderKanban,
  CheckSquare,
  Flag,
  Bug,
  Rocket,
  UserCheck,
  Code,
  BarChart2,
  CreditCard,
  DollarSign,
  FileText,
  Settings,
  Link as LinkIcon,
  Zap,
  Search,
  Bell,
  Grid,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowUp,
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
  CheckCircle2,
} from "lucide-react";

// --- Data Definitions ---

const revenueData = [
  { name: "Jan", value: 20000 },
  { name: "Feb", value: 30000 },
  { name: "Mar", value: 45000 },
  { name: "Apr", value: 50000 },
  { name: "May", value: 65000 },
  { name: "Jun", value: 80000 },
  { name: "Jul", value: 92000 },
  { name: "Aug", value: 125000 },
  { name: "Sep", value: 95000 },
  { name: "Oct", value: 105000 },
  { name: "Nov", value: 110000 },
  { name: "Dec", value: 120000 },
];

const funnelData = [
  { name: "New Leads", value: "1,248", percentage: "100%", color: "#3b82f6" },
  { name: "Contacted", value: "862", percentage: "69%", color: "#38bdf8" },
  { name: "Qualified", value: "430", percentage: "34%", color: "#34d399" },
  { name: "Meetings", value: "210", percentage: "17%", color: "#fbbf24" },
  { name: "Proposals", value: "86", percentage: "7%", color: "#fb923c" },
  { name: "Won", value: "32", percentage: "2.6%", color: "#c084fc" },
];

const todayTasks = [
  {
    id: 1,
    title: "Call with ABC Ltd.",
    time: "10:00 AM",
    tag: "Call",
    tagColor: "bg-blue-50 text-blue-600 border border-blue-100",
    icon: Phone,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    completed: false,
  },
  {
    id: 2,
    title: "Project requirement review",
    time: "11:30 AM",
    tag: "Project",
    tagColor: "bg-sky-50 text-sky-600 border border-sky-100",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    completed: false,
  },
  {
    id: 3,
    title: "Follow up with John",
    time: "01:00 PM",
    tag: "Follow-up",
    tagColor: "bg-teal-50 text-teal-600 border border-teal-100",
    icon: MessageCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    completed: false,
  },
  {
    id: 4,
    title: "Send proposal to TechCorp",
    time: "03:00 PM",
    tag: "Email",
    tagColor: "bg-purple-50 text-purple-600 border border-purple-100",
    icon: Mail,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50",
    completed: false,
  },
  {
    id: 5,
    title: "UI design review",
    time: "04:30 PM",
    tag: "Development",
    tagColor: "bg-blue-50 text-blue-600 border border-blue-100",
    icon: Monitor,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
    completed: false,
  },
];

const recentLeads = [
  {
    initials: "AC",
    name: "ABC Technologies",
    desc: "Software Development",
    status: "Qualified",
    time: "2 min ago",
    avatarBg: "bg-blue-100 text-blue-700",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    initials: "GT",
    name: "Global Tech Ltd.",
    desc: "Custom ERP",
    status: "Contacted",
    time: "12 min ago",
    avatarBg: "bg-sky-100 text-sky-700",
    statusStyle: "bg-sky-50 text-sky-600 border border-sky-100",
  },
  {
    initials: "SM",
    name: "Skyline Media",
    desc: "Website Development",
    status: "New",
    time: "1 hour ago",
    avatarBg: "bg-emerald-100 text-emerald-700",
    statusStyle: "bg-rose-50 text-rose-500 border border-rose-100",
  },
  {
    initials: "BL",
    name: "BrightLink Solutions",
    desc: "Mobile App",
    status: "Follow-up",
    time: "3 hours ago",
    avatarBg: "bg-orange-100 text-orange-700",
    statusStyle: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  {
    initials: "NP",
    name: "NextGen Pvt. Ltd.",
    desc: "CRM Development",
    status: "Not Interested",
    time: "5 hours ago",
    avatarBg: "bg-purple-100 text-purple-700",
    statusStyle: "bg-red-50 text-red-500 border border-red-100",
  },
];

const activeDeals = [
  {
    icon: Briefcase,
    iconBg: "bg-blue-50 text-blue-600",
    name: "ABC Manufacturing",
    desc: "ERP Development",
    value: "$25,000",
    stage: "Negotiation",
    prob: "70%",
    stageStyle: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  {
    icon: Monitor,
    iconBg: "bg-orange-50 text-orange-500",
    name: "TechCorp Global",
    desc: "Website Redesign",
    value: "$15,000",
    stage: "Proposal",
    prob: "50%",
    stageStyle: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    icon: Smartphone,
    iconBg: "bg-sky-50 text-sky-600",
    name: "Skyline Media",
    desc: "Mobile App",
    value: "$40,000",
    stage: "Contract Sent",
    prob: "80%",
    stageStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    icon: Database,
    iconBg: "bg-purple-50 text-purple-600",
    name: "NextGen Solutions",
    desc: "CRM Implementation",
    value: "$30,000",
    stage: "Discovery",
    prob: "40%",
    stageStyle: "bg-purple-50 text-purple-600 border border-purple-100",
  },
  {
    icon: Target,
    iconBg: "bg-rose-50 text-rose-500",
    name: "BrightLink Ltd.",
    desc: "Custom Software",
    value: "$12,000",
    stage: "Meeting",
    prob: "60%",
    stageStyle: "bg-rose-50 text-rose-500 border border-rose-100",
  },
];

const projectProgress = [
  {
    icon: FolderKanban,
    name: "ABC ERP",
    desc: "Development",
    progress: 75,
  },
  {
    icon: LayoutDashboard,
    name: "TechCorp Website",
    desc: "Design",
    progress: 40,
  },
  {
    icon: Smartphone,
    name: "Skyline Mobile App",
    desc: "QA",
    progress: 60,
  },
  {
    icon: Database,
    name: "NextGen CRM",
    desc: "Development",
    progress: 20,
  },
  {
    icon: Rocket,
    name: "BrightLink Platform",
    desc: "Deployment",
    progress: 90,
  },
];

const teamPerformance = [
  {
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    name: "Ali Khan",
    role: "Setter",
    leads: "120",
    deals: "—",
    won: "—",
    revenue: "—",
    roleStyle: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    name: "Sara Ahmed",
    role: "Setter",
    leads: "98",
    deals: "—",
    won: "—",
    revenue: "—",
    roleStyle: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    name: "Usman Tariq",
    role: "Closer",
    leads: "—",
    deals: "18",
    won: "8",
    revenue: "$72,000",
    roleStyle: "bg-purple-50 text-purple-600 border border-purple-100",
  },
  {
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    name: "Fatima Noor",
    role: "Closer",
    leads: "—",
    deals: "15",
    won: "6",
    revenue: "$53,000",
    roleStyle: "bg-purple-50 text-purple-600 border border-purple-100",
  },
  {
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    name: "Bilal Khan",
    role: "Developer",
    leads: "—",
    deals: "—",
    won: "12",
    revenue: "—",
    roleStyle: "bg-teal-50 text-teal-600 border border-teal-100",
  },
];

const activityTimeline = [
  {
    icon: Phone,
    action: "Call with ABC Ltd.",
    time: "10:32 AM",
    by: "Ahmed Raza",
    iconBg: "bg-emerald-500",
  },
  {
    icon: Mail,
    action: "Proposal sent to TechCorp",
    time: "11:15 AM",
    by: "Sara Ahmed",
    iconBg: "bg-blue-500",
  },
  {
    icon: FileText,
    action: "Contract signed - Skyline Media",
    time: "01:45 PM",
    by: "Usman Tariq",
    iconBg: "bg-purple-500",
  },
  {
    icon: Check,
    action: "Project created - NextGen CRM",
    time: "03:20 PM",
    by: "System",
    iconBg: "bg-emerald-500",
  },
  {
    icon: UserPlus,
    action: "New lead assigned to Ali",
    time: "04:10 PM",
    by: "System",
    iconBg: "bg-amber-500",
  },
  {
    icon: CreditCard,
    action: "Payment received - $10,000",
    time: "05:30 PM",
    by: "System",
    iconBg: "bg-pink-500",
  },
];

// --- Subcomponents ---

// Funnel Graphic (SVG Polygon Trapezoid Layers)
const FunnelGraphic = () => {
  // 6 layers: top widest to bottom narrowest
  // Total width: 220, height: 180
  const layers = [
    { topW: 200, botW: 172, y1: 0, y2: 24, fill: "#3b82f6" }, // blue
    { topW: 168, botW: 140, y1: 28, y2: 52, fill: "#38bdf8" }, // sky
    { topW: 136, botW: 108, y1: 56, y2: 80, fill: "#34d399" }, // emerald
    { topW: 104, botW: 76, y1: 84, y2: 108, fill: "#fbbf24" }, // amber
    { topW: 72, botW: 48, y1: 112, y2: 136, fill: "#fb923c" }, // orange
    { topW: 44, botW: 30, y1: 140, y2: 164, fill: "#c084fc" }, // violet
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
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState(todayTasks);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <>
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
          {/* Greeting & Date Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Good Morning, Ahmed!{" "}
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
                    Monday, 10 March 2025
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center md:justify-end gap-1">
                    Make it a productive day! 🚀
                  </p>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                  This Month
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 1: KPI Cards (5 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Leads */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Total Leads</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  1,248
                </h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="flex items-center font-bold text-emerald-600">
                  <ArrowUp className="w-3 h-3 mr-0.5" /> 12%
                </span>
                <span className="text-slate-400 text-[11px]">
                  +134 this month
                </span>
              </div>
            </div>

            {/* Active Deals */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Active Deals</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">86</h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="flex items-center font-bold text-emerald-600">
                  <ArrowUp className="w-3 h-3 mr-0.5" /> 8%
                </span>
                <span className="text-slate-400 text-[11px]">
                  $320,000 pipeline
                </span>
              </div>
            </div>

            {/* Won Revenue */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">Won Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  $125,000
                </h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="flex items-center font-bold text-emerald-600">
                  <ArrowUp className="w-3 h-3 mr-0.5" /> 24%
                </span>
                <span className="text-slate-400 text-[11px]">This month</span>
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Box className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">
                  Active Projects
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">27</h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="flex items-center font-bold text-emerald-600">
                  <ArrowUp className="w-3 h-3 mr-0.5" /> 10%
                </span>
                <span className="text-slate-400 text-[11px]">18 on track</span>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">
                  Team Members
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">42</h3>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="flex items-center font-bold text-emerald-600">
                  <ArrowUp className="w-3 h-3 mr-0.5" /> 5%
                </span>
                <span className="text-slate-400 text-[11px]">
                  Across all departments
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Charts & Today's Tasks (3 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. Revenue Overview (5 cols) */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 lg:col-span-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Revenue Overview
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      $125,000
                    </span>
                    <span className="flex items-center text-xs font-bold text-emerald-600">
                      <ArrowUp className="w-3 h-3 mr-0.5" /> 24%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Total revenue this month
                  </p>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                  Monthly
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Area Chart with Highlighted $125K Dot at August */}
              <div className="h-56 w-full mt-4 relative">
                {/* Visual Pill Indicator over August ($125K) */}
                <div
                  className="absolute pointer-events-none z-10 flex flex-col items-center"
                  style={{ left: "62%", top: "18%" }}
                >
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
                    $125K
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shadow mt-0.5"></div>
                </div>

                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
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
                        ticks={[0, 50000, 100000, 150000, 200000]}
                        domain={[0, 200000]}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          fontSize: "12px",
                        }}
                        formatter={(val: any) => [
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
            </div>

            {/* 2. Lead Conversion Funnel (4 cols) */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 lg:col-span-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Lead Conversion Funnel
                </h3>
                <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                  This Month
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                {/* Left: SVG Trapezoid Funnel */}
                <div className="w-1/2 flex items-center justify-center">
                  <FunnelGraphic />
                </div>

                {/* Right: Funnel Data Rows */}
                <div className="w-1/2 space-y-2">
                  {funnelData.map((item, idx) => (
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
            </div>

            {/* 3. Today's Tasks (3 cols) - Placed in Row 2 directly matching the design! */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 lg:col-span-3 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Today&apos;s Tasks
                </h3>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </a>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const Icon = task.icon;
                  return (
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
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${task.iconBg} ${task.iconColor}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
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
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${task.tagColor}`}
                      >
                        {task.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Recent Leads, Active Deals, Project Progress (3 Equal Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Recent Leads */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Recent Leads</h3>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="space-y-3.5">
                {recentLeads.map((lead, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${lead.avatarBg}`}
                      >
                        {lead.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {lead.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {lead.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.statusStyle}`}
                      >
                        {lead.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {lead.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Active Deals */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Active Deals</h3>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </a>
              </div>
              <div className="space-y-3.5">
                {activeDeals.map((deal, i) => {
                  const Icon = deal.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${deal.iconBg}`}
                        >
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
                          {deal.value}
                        </span>
                        <div className="flex flex-col items-end gap-1 w-20">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold text-center w-full truncate ${deal.stageStyle}`}
                          >
                            {deal.stage}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {deal.prob}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Project Progress */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Project Progress
                </h3>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {projectProgress.map((project, i) => {
                  const Icon = project.icon;
                  return (
                    <div
                      key={i}
                      className="p-1 -mx-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {project.name}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {project.desc}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
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
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 4: Team Performance, Activity Timeline, Promotional Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. Team Performance (5 cols) */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 lg:col-span-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Team Performance
                </h3>
                <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                  This Month
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="pb-2.5 font-medium">Team Member</th>
                      <th className="pb-2.5 font-medium">Role</th>
                      <th className="pb-2.5 font-medium">Leads</th>
                      <th className="pb-2.5 font-medium">Deals</th>
                      <th className="pb-2.5 font-medium">Won</th>
                      <th className="pb-2.5 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teamPerformance.map((member, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-900 flex items-center gap-2">
                          <img
                            src={member.img}
                            alt={member.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-100"
                          />
                          <span>{member.name}</span>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${member.roleStyle}`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-600">{member.leads}</td>
                        <td className="py-2.5 text-slate-600">{member.deals}</td>
                        <td className="py-2.5 text-slate-600">{member.won}</td>
                        <td className="py-2.5 font-bold text-slate-900 text-right">
                          {member.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Activity Timeline (4 cols) */}
            <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 lg:col-span-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Activity Timeline
                </h3>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </a>
              </div>
              <div className="space-y-3.5 relative">
                {activityTimeline.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ${item.iconBg}`}
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
            </div>

            {/* 3. Promotional Card: Turn Opportunities Into Success (3 cols) */}
            <div className="bg-gradient-to-br from-[#e8f1ff] via-[#f0f4ff] to-[#f5f0ff] rounded-2xl border border-blue-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 lg:col-span-3 flex flex-col justify-between relative overflow-hidden">
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
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all shadow-sm shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer">
                    View Reports <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-blue-200/50 flex items-start gap-2">
                <span className="text-2xl text-blue-400 font-serif leading-none inline-block">
                  “
                </span>
                <div>
                  <p className="text-xs italic text-slate-700">
                    &ldquo;A better process leads to a brighter future.&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                    — Your CRM, Your Growth Partner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
