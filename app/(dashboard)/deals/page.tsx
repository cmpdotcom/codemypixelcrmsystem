"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Plus,
  Filter,
  Columns,
  Box,
  ShoppingBag,
  Trophy,
  X,
  Percent,
  Video,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  TrendingUp,
  Kanban,
  List,
  LineChart,
  Tag,
  ArrowRight,
} from "lucide-react";

// --- Metric KPI Cards Data ---
const kpiStats = [
  {
    title: "Total Deals",
    value: "86",
    change: "↑ 12%",
    isPositive: true,
    subtext: "vs last month",
    icon: Box,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    title: "Pipeline Value",
    value: "$320,000",
    change: "↑ 18%",
    isPositive: true,
    subtext: "vs last month",
    icon: ShoppingBag,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "Won Deals",
    value: "24",
    change: "↑ 33%",
    isPositive: true,
    subtext: "vs last month",
    icon: Trophy,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    title: "Lost Deals",
    value: "12",
    change: "↓ 8%",
    isPositive: false,
    subtext: "vs last month",
    icon: X,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
  {
    title: "Win Rate",
    value: "27.9%",
    change: "↑ 6%",
    isPositive: true,
    subtext: "vs last month",
    icon: Percent,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
  },
];

// --- 6 Kanban Pipeline Columns & Deals Data ---
const initialPipeline = {
  qualified: {
    id: "qualified",
    title: "Qualified",
    count: 12,
    value: "$85,000",
    headerBg: "bg-blue-50/80 text-blue-700 border-blue-100",
    badgeBg: "bg-blue-200/60 text-blue-800",
    deals: [
      {
        id: "d-1",
        name: "ABC Technologies",
        service: "Custom ERP",
        value: "$25,000",
        prob: "70%",
        date: "Mar 15, 2025",
        priority: "High",
        priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
        closerImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        closerName: "Ali Khan",
      },
      {
        id: "d-2",
        name: "Global Tech Ltd.",
        service: "Website Redesign",
        value: "$15,000",
        prob: "60%",
        date: "Mar 18, 2025",
        initials: "GT",
        initialsBg: "bg-sky-100 text-sky-700",
        closerImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        closerName: "Fatima Noor",
      },
      {
        id: "d-3",
        name: "Skyline Media",
        service: "Mobile App",
        value: "$20,000",
        prob: "50%",
        date: "Mar 20, 2025",
        priority: "High",
        priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
        closerImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        closerName: "Ali Khan",
      },
      {
        id: "d-4",
        name: "BrightLink Solutions",
        service: "CRM Implementation",
        value: "$12,000",
        prob: "40%",
        date: "Mar 22, 2025",
        priority: "Medium",
        priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
      },
    ],
  },
  discovery: {
    id: "discovery",
    title: "Discovery",
    count: 10,
    value: "$72,000",
    headerBg: "bg-sky-50/80 text-sky-700 border-sky-100",
    badgeBg: "bg-sky-200/60 text-sky-800",
    deals: [
      {
        id: "d-5",
        name: "NextGen Co.",
        service: "Custom Software",
        value: "$18,000",
        prob: "60%",
        date: "Mar 16, 2025",
        initials: "NG",
        initialsBg: "bg-blue-100 text-blue-700",
        closerImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        closerName: "Fatima Noor",
      },
      {
        id: "d-6",
        name: "Innovate Ltd.",
        service: "ERP Development",
        value: "$22,000",
        prob: "70%",
        date: "Mar 19, 2025",
        initials: "IL",
        initialsBg: "bg-purple-100 text-purple-700",
        closerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        closerName: "Usman Tariq",
      },
      {
        id: "d-7",
        name: "Core Systems",
        service: "System Integration",
        value: "$10,000",
        prob: "50%",
        date: "Mar 25, 2025",
        priority: "Medium",
        priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
      },
      {
        id: "d-8",
        name: "Vector Inc.",
        service: "Web Application",
        value: "$22,000",
        prob: "60%",
        date: "Mar 28, 2025",
        priority: "Low",
        priorityStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      },
    ],
  },
  proposal: {
    id: "proposal",
    title: "Proposal",
    count: 8,
    value: "$95,000",
    headerBg: "bg-purple-50/80 text-purple-700 border-purple-100",
    badgeBg: "bg-purple-200/60 text-purple-800",
    deals: [
      {
        id: "d-9",
        name: "Prime Digital",
        service: "Mobile App",
        value: "$30,000",
        prob: "75%",
        date: "Mar 14, 2025",
        priority: "High",
        priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
        closerImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
        closerName: "Sara Ahmed",
      },
      {
        id: "d-10",
        name: "FutureWorks",
        service: "Custom ERP",
        value: "$25,000",
        prob: "60%",
        date: "Mar 17, 2025",
        priority: "Medium",
        priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
        closerImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        closerName: "Fatima Noor",
      },
      {
        id: "d-11",
        name: "TechCorp",
        service: "Website Development",
        value: "$18,000",
        prob: "50%",
        date: "Mar 21, 2025",
        priority: "Medium",
        priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
      },
      {
        id: "d-12",
        name: "Alpha Solutions",
        service: "CRM Customization",
        value: "$22,000",
        prob: "65%",
        date: "Mar 26, 2025",
        priority: "High",
        priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
        closerImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        closerName: "Ali Khan",
      },
    ],
  },
  negotiation: {
    id: "negotiation",
    title: "Negotiation",
    count: 6,
    value: "$78,000",
    headerBg: "bg-amber-50/80 text-amber-700 border-amber-100",
    badgeBg: "bg-amber-200/60 text-amber-800",
    deals: [
      {
        id: "d-13",
        name: "Orbit Media",
        service: "Digital Marketing Platform",
        value: "$28,000",
        prob: "80%",
        date: "Mar 12, 2025",
        initials: "OM",
        initialsBg: "bg-indigo-100 text-indigo-700",
        closerImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
        closerName: "Sara Ahmed",
      },
      {
        id: "d-14",
        name: "BlueSky Inc.",
        service: "Mobile App",
        value: "$20,000",
        prob: "70%",
        date: "Mar 19, 2025",
        initials: "BS",
        initialsBg: "bg-blue-100 text-blue-700",
        closerImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        closerName: "Fatima Noor",
      },
      {
        id: "d-15",
        name: "Zenith Corp.",
        service: "ERP Development",
        value: "$30,000",
        prob: "65%",
        date: "Mar 24, 2025",
        priority: "High",
        priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100",
        closerImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        closerName: "Ali Khan",
      },
    ],
  },
  contract: {
    id: "contract",
    title: "Contract Sent",
    count: 4,
    value: "$55,000",
    headerBg: "bg-teal-50/80 text-teal-700 border-teal-100",
    badgeBg: "bg-teal-200/60 text-teal-800",
    deals: [
      {
        id: "d-16",
        name: "Delta Systems",
        service: "Website Redesign",
        value: "$18,000",
        prob: "90%",
        date: "Mar 10, 2025",
        initials: "DS",
        initialsBg: "bg-sky-100 text-sky-700",
        closerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        closerName: "Usman Tariq",
      },
      {
        id: "d-17",
        name: "Elevate Tech",
        service: "Custom CRM",
        value: "$22,000",
        prob: "80%",
        date: "Mar 15, 2025",
        priority: "Medium",
        priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
      },
      {
        id: "d-18",
        name: "Horizon Ltd.",
        service: "Mobile App",
        value: "$15,000",
        prob: "75%",
        date: "Mar 20, 2025",
        priority: "Medium",
        priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100",
      },
    ],
  },
  won: {
    id: "won",
    title: "Won",
    count: 24,
    value: "$125,000",
    headerBg: "bg-emerald-50/80 text-emerald-700 border-emerald-100",
    badgeBg: "bg-emerald-200/60 text-emerald-800",
    deals: [
      {
        id: "d-19",
        name: "Acme Corp.",
        service: "ERP Development",
        value: "$40,000",
        statusBadge: "Won",
        statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        initials: "A",
        initialsBg: "bg-emerald-500 text-white",
        date: "Feb 28, 2025",
      },
      {
        id: "d-20",
        name: "Global Retail",
        service: "E-commerce Platform",
        value: "$35,000",
        statusBadge: "Won",
        statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        initials: "GR",
        initialsBg: "bg-emerald-500 text-white",
        date: "Feb 25, 2025",
      },
      {
        id: "d-21",
        name: "Metro Systems",
        service: "Custom Software",
        value: "$25,000",
        statusBadge: "Won",
        statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        initials: "MS",
        initialsBg: "bg-teal-500 text-white",
        date: "Feb 20, 2025",
      },
    ],
  },
};

// --- Bottom 3 Cards Data ---
const upcomingActivities = [
  {
    icon: Phone,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    title: "Call with ABC Technologies",
    time: "Mar 10, 2025 02:15 PM",
    btnLabel: "Call",
  },
  {
    icon: Mail,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    title: "Send proposal to NextGen Co.",
    time: "Mar 10, 2025 11:30 AM",
    btnLabel: "Email",
  },
  {
    icon: Video,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    title: "Meeting with Prime Digital",
    time: "Mar 11, 2025 10:00 AM",
    btnLabel: "Join",
  },
];

const forecastData = [
  { month: "Mar 2025", pipeline: 95000, expected: 65000 },
  { month: "Apr 2025", pipeline: 115000, expected: 78000 },
  { month: "May 2025", pipeline: 125000, expected: 86000 },
];

const topClosers = [
  {
    rank: 1,
    name: "Ali Khan",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    deals: 18,
    won: 8,
    revenue: "$72,000",
  },
  {
    rank: 2,
    name: "Fatima Noor",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    deals: 16,
    won: 7,
    revenue: "$53,000",
  },
  {
    rank: 3,
    name: "Usman Tariq",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    deals: 12,
    won: 6,
    revenue: "$38,000",
  },
  {
    rank: 4,
    name: "Sara Ahmed",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    deals: 10,
    won: 3,
    revenue: "$22,000",
  },
];

export default function DealsPage() {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<"kanban" | "list" | "forecast">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [pipeline, setPipeline] = useState(initialPipeline);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Content Body */}
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
          {/* Top Title Bar & Action Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Deals
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Track your sales pipeline, close more deals, and grow revenue.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switcher Segmented Control */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-1 flex items-center gap-1 shadow-2xs">
                <button
                  onClick={() => setCurrentView("kanban")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentView === "kanban"
                      ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>

                <button
                  onClick={() => setCurrentView("list")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentView === "list"
                      ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>

                <button
                  onClick={() => setCurrentView("forecast")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentView === "forecast"
                      ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Forecast</span>
                </button>
              </div>

              {/* Filters Button */}
              <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
                <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {/* Primary + Add Deal Button */}
              <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Add Deal</span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
              </button>
            </div>
          </div>

          {/* Row of 5 Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {kpiStats.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex items-center gap-3.5"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">
                      {kpi.title}
                    </p>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {kpi.value}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      <span
                        className={`font-bold flex items-center ${
                          kpi.isPositive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {kpi.change}
                      </span>
                      <span className="text-slate-400">{kpi.subtext}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search & Filter Dropdowns Bar */}
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[260px] relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals by name, company, or contact..."
                className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                  <span>All Closers</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="relative">
                <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                  <span>All Services</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="relative">
                <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                  <span>All Stages</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="relative">
                <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expected Close Date</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* 6-Column Kanban Pipeline Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-2">
            {Object.values(pipeline).map((col) => {
              return (
                <div
                  key={col.id}
                  className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/70 flex flex-col gap-3 min-w-[210px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900">
                        {col.title}
                      </h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700">
                        {col.count}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-700">
                      {col.value}
                    </span>
                  </div>

                  {/* Deals Cards Stack */}
                  <div className="space-y-2.5">
                    {col.deals.map((deal: any) => (
                      <div
                        key={deal.id}
                        className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                      >
                        {/* Company Name & Probability */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {deal.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {deal.service}
                            </p>
                          </div>
                          {deal.prob && (
                            <span className="text-[11px] font-bold text-slate-500">
                              {deal.prob}
                            </span>
                          )}
                          {deal.statusBadge && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${deal.statusStyle}`}
                            >
                              {deal.statusBadge}
                            </span>
                          )}
                        </div>

                        {/* Value */}
                        <div className="mt-2.5">
                          <span className="text-sm font-extrabold text-slate-900">
                            {deal.value}
                          </span>
                        </div>

                        {/* Card Footer: Date, Tag / Avatar */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{deal.date}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {deal.priority && (
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold ${deal.priorityStyle}`}
                              >
                                {deal.priority}
                              </span>
                            )}
                            {deal.initials && (
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${deal.initialsBg}`}
                              >
                                {deal.initials}
                              </div>
                            )}
                            {deal.closerImg && (
                              <img
                                src={deal.closerImg}
                                alt={deal.closerName || "Closer"}
                                className="w-4 h-4 rounded-full object-cover border border-slate-200"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Deal or View Won Action */}
                  {col.id === "won" ? (
                    <button className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-blue-600 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                      <span>View All Won (24)</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button className="w-full py-1.5 bg-white hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-medium text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Deal</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Row: Upcoming Activities + Deal Forecast + Top Performing Closers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 1. Upcoming Activities (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Upcoming Activities
                </h3>
                <Link
                  href="/activities"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3.5">
                {upcomingActivities.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.iconBg} ${act.iconColor}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {act.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {act.time}
                          </p>
                        </div>
                      </div>

                      <button className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 transition-colors shrink-0 cursor-pointer">
                        {act.btnLabel}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Deal Forecast (Next 3 Months) Bar Chart (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Deal Forecast (Next 3 Months)
                </h3>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Report
                </a>
              </div>

              <div className="h-44 w-full mt-2">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={forecastData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      barGap={6}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        dy={6}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        tickFormatter={(v) => `${v / 1000}K`}
                        ticks={[0, 50000, 100000, 150000]}
                        domain={[0, 150000]}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          fontSize: "11px",
                        }}
                        formatter={(val: any) => [
                          `$${Number(val).toLocaleString()}`,
                          "",
                        ]}
                      />
                      <Bar
                        dataKey="pipeline"
                        name="Pipeline Value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="expected"
                        name="Expected Revenue"
                        fill="#34d399"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-50/50 rounded-xl" />
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  <span>Pipeline Value</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                  <span>Expected Revenue</span>
                </div>
              </div>
            </div>

            {/* 3. Top Performing Closers (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Top Performing Closers
                </h3>
                <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs hover:bg-slate-50">
                  <span>This Month</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="pb-2 font-medium w-6">#</th>
                      <th className="pb-2 font-medium">Closer</th>
                      <th className="pb-2 font-medium text-center">Deals</th>
                      <th className="pb-2 font-medium text-center">Won</th>
                      <th className="pb-2 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topClosers.map((c) => (
                      <tr key={c.rank} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 text-slate-400 font-medium">{c.rank}</td>
                        <td className="py-2.5 font-semibold text-slate-900 flex items-center gap-2">
                          <img
                            src={c.img}
                            alt={c.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                          <span>{c.name}</span>
                        </td>
                        <td className="py-2.5 text-slate-600 text-center font-medium">
                          {c.deals}
                        </td>
                        <td className="py-2.5 text-slate-600 text-center font-medium">
                          {c.won}
                        </td>
                        <td className="py-2.5 font-bold text-slate-900 text-right">
                          {c.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>

      {/* Global Scrollbar styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar {
                width: 5px;
                height: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 9999px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        `,
        }}
      />
    </>
  );
}
