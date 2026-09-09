"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Phone,
  Mail,
  Calendar,
  Clock,
  Plus,
  MoreHorizontal,
  Check,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  MessageCircle,
  Video,
  Target,
  FileSpreadsheet,
} from "lucide-react";

// --- WhatsApp Custom Icon ---
function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2c-5.523 0-10 4.477-10 10 0 1.768.461 3.498 1.336 5.025L2 22l5.143-1.348A9.957 9.957 0 0 0 12.031 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.25a8.21 8.21 0 0 1-4.188-1.144l-.3-.178-3.111.816.83-3.031-.196-.312a8.225 8.225 0 0 1-1.266-4.401c0-4.549 3.702-8.25 8.231-8.25 4.549 0 8.25 3.701 8.25 8.25 0 4.549-3.701 8.25-8.25 8.25zm4.516-6.184c-.247-.124-1.463-.722-1.69-.805-.227-.082-.392-.124-.557.124-.165.247-.64 1.113-.784 1.278-.144.165-.289.185-.536.062-.247-.124-1.044-.385-1.988-1.227-.735-.656-1.232-1.466-1.376-1.713-.144-.247-.015-.381.108-.504.111-.111.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.34-.763-1.835-.2-.482-.404-.417-.557-.425l-.474-.008c-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062s.887 2.392 1.01 2.557c.124.165 1.742 2.66 4.221 3.73.59.254 1.051.406 1.411.52.593.188 1.133.162 1.559.098.476-.071 1.463-.598 1.669-1.175.206-.577.206-1.072.144-1.175-.062-.103-.227-.165-.474-.289z" />
    </svg>
  );
}

// --- KPI Stats Data ---
const kpiStats = [
  {
    title: "Total Follow-Ups",
    value: "156",
    change: "↑ 12%",
    isPositive: true,
    subtext: "vs last week",
    icon: Calendar,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    title: "Due Today",
    value: "24",
    change: "↑ 33%",
    isPositive: true,
    subtext: "Take action now",
    icon: Clock,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
  {
    title: "Upcoming",
    value: "58",
    change: "↑ 18%",
    isPositive: true,
    subtext: "Next 7 days",
    icon: ShieldCheck,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Overdue",
    value: "12",
    change: "↓ 20%",
    isPositive: false,
    subtext: "Need attention",
    icon: AlertCircle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    title: "Completed",
    value: "68",
    change: "↑ 28%",
    isPositive: true,
    subtext: "This month",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
];

// --- Follow-ups Table Data (10 exact rows from screenshot) ---
const followUpsData = [
  {
    id: "FU-10291",
    subjectTitle: "Discuss proposal",
    subjectDesc: "Go over final proposal and...",
    company: "ABC Technologies",
    companyInitial: "ABC",
    companyInitialBg: "bg-blue-100 text-blue-700",
    relatedRef: "Deal #DL-1082",
    type: "Call",
    typeIcon: Phone,
    typeStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
    assigneeName: "Ali Khan",
    assigneeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 10, 2025",
    dueTime: "11:00 AM",
    status: "Due Today",
    statusStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
    priority: "High",
    priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
  },
  {
    id: "FU-10290",
    subjectTitle: "Follow up on requirements",
    subjectDesc: "Check if client has reviewed...",
    company: "Global Tech Ltd.",
    companyInitial: "GT",
    companyInitialBg: "bg-teal-100 text-teal-700",
    relatedRef: "Lead #LD-2291",
    type: "Email",
    typeIcon: Mail,
    typeStyle: "bg-blue-50 text-blue-600 border border-blue-100/60",
    assigneeName: "Fatima Noor",
    assigneeImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 10, 2025",
    dueTime: "02:30 PM",
    status: "Due Today",
    statusStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
    priority: "High",
    priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
  },
  {
    id: "FU-10289",
    subjectTitle: "Demo meeting",
    subjectDesc: "Product demonstration for...",
    company: "Skyline Media",
    companyInitial: "SM",
    companyInitialBg: "bg-emerald-100 text-emerald-700",
    relatedRef: "Deal #DL-1076",
    type: "Meeting",
    typeIcon: Video,
    typeStyle: "bg-purple-50 text-purple-600 border border-purple-100/60",
    assigneeName: "Usman Tariq",
    assigneeImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 10, 2025",
    dueTime: "04:00 PM",
    status: "Due Today",
    statusStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100/70",
  },
  {
    id: "FU-10288",
    subjectTitle: "Check payment status",
    subjectDesc: "Confirm first installment...",
    company: "BrightLink Solutions",
    companyInitial: "BC",
    companyInitialBg: "bg-rose-100 text-rose-700",
    relatedRef: "Client #CL-332",
    type: "Call",
    typeIcon: Phone,
    typeStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
    assigneeName: "Sara Ahmed",
    assigneeImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 11, 2025",
    dueTime: "10:00 AM",
    status: "Upcoming",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100/70",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100/70",
  },
  {
    id: "FU-10287",
    subjectTitle: "Send revised quotation",
    subjectDesc: "Share updated pricing...",
    company: "NextGen Co.",
    companyInitial: "NP",
    companyInitialBg: "bg-slate-800 text-white",
    relatedRef: "Lead #LD-1074",
    type: "Email",
    typeIcon: Mail,
    typeStyle: "bg-blue-50 text-blue-600 border border-blue-100/60",
    assigneeName: "Ali Khan",
    assigneeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 11, 2025",
    dueTime: "01:00 PM",
    status: "Upcoming",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100/70",
    priority: "High",
    priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
  },
  {
    id: "FU-10286",
    subjectTitle: "Follow up after meeting",
    subjectDesc: "Client was interested in ERP...",
    company: "Innovate Ltd.",
    companyInitial: "IL",
    companyInitialBg: "bg-amber-100 text-amber-700",
    relatedRef: "Lead #LD-2260",
    type: "WhatsApp",
    typeIcon: WhatsAppIcon,
    typeStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
    assigneeName: "Fatima Noor",
    assigneeImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 12, 2025",
    dueTime: "11:30 AM",
    status: "Upcoming",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100/70",
    priority: "Low",
    priorityStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100/70",
  },
  {
    id: "FU-10285",
    subjectTitle: "Schedule next meeting",
    subjectDesc: "Discuss technical details...",
    company: "Core Systems",
    companyInitial: "CS",
    companyInitialBg: "bg-cyan-100 text-cyan-700",
    relatedRef: "Deal #DL-1071",
    type: "Meeting",
    typeIcon: Video,
    typeStyle: "bg-purple-50 text-purple-600 border border-purple-100/60",
    assigneeName: "Usman Tariq",
    assigneeImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 12, 2025",
    dueTime: "03:00 PM",
    status: "Upcoming",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100/70",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100/70",
  },
  {
    id: "FU-10284",
    subjectTitle: "Contract signing follow up",
    subjectDesc: "Check if the legal team has...",
    company: "FutureWorks",
    companyInitial: "FW",
    companyInitialBg: "bg-purple-100 text-purple-700",
    relatedRef: "Client #CL-331",
    type: "Call",
    typeIcon: Phone,
    typeStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
    assigneeName: "Sara Ahmed",
    assigneeImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 13, 2025",
    dueTime: "11:00 AM",
    status: "Overdue",
    statusStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
    priority: "High",
    priorityStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
  },
  {
    id: "FU-10283",
    subjectTitle: "Client feedback",
    subjectDesc: "Get feedback on the delivered...",
    company: "Vector Inc.",
    companyInitial: "VI",
    companyInitialBg: "bg-indigo-900 text-white",
    relatedRef: "Project #PR-090",
    type: "Email",
    typeIcon: Mail,
    typeStyle: "bg-blue-50 text-blue-600 border border-blue-100/60",
    assigneeName: "Ali Khan",
    assigneeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 13, 2025",
    dueTime: "04:00 PM",
    status: "Overdue",
    statusStyle: "bg-rose-50 text-rose-600 border border-rose-100/70",
    priority: "Medium",
    priorityStyle: "bg-amber-50 text-amber-600 border border-amber-100/70",
  },
  {
    id: "FU-10282",
    subjectTitle: "Renewal discussion",
    subjectDesc: "Discuss annual contract renewal...",
    company: "Prime Digital",
    companyInitial: "PD",
    companyInitialBg: "bg-rose-600 text-white",
    relatedRef: "Client #CL-329",
    type: "Call",
    typeIcon: Phone,
    typeStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
    assigneeName: "Fatima Noor",
    assigneeImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    dueDate: "Mar 14, 2025",
    dueTime: "10:30 AM",
    status: "Upcoming",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100/70",
    priority: "Low",
    priorityStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100/70",
  },
];

export default function FollowUpsPage() {
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Today's Follow-up check state
  const [checkedTasks, setCheckedTasks] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(followUpsData.map((f) => f.id));
      setSelectAll(true);
    }
  };

  const toggleRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleTodayTask = (index: number) => {
    if (checkedTasks.includes(index)) {
      setCheckedTasks(checkedTasks.filter((t) => t !== index));
    } else {
      setCheckedTasks([...checkedTasks, index]);
    }
  };

  const filteredData = followUpsData.filter((item) => {
    if (selectedTab === "Today" && item.status !== "Due Today") return false;
    if (selectedTab === "Upcoming" && item.status !== "Upcoming") return false;
    if (selectedTab === "Overdue" && item.status !== "Overdue") return false;
    if (
      searchQuery &&
      !item.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.assigneeName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Content Body */}
      <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12">
          {/* Main 2-Column Split Workspace */}
          <div className="flex flex-col xl:flex-row gap-5 items-start">
            {/* Left Column (flex-1 min-w-0): Header, KPIs, Tabs, Filters, Table */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Top Title Bar & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Follow-Ups
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Never miss an opportunity. Keep track of all your follow-ups and stay ahead.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Calendar</span>
                  </button>

                  <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Follow-up</span>
                  </button>
                </div>
              </div>

              {/* Row of 5 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {kpiStats.map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}
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

              {/* Filter Tabs Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { name: "All", count: "156", icon: true, badgeBg: "bg-blue-600 text-white" },
                  { name: "Today", count: "24", badgeBg: "bg-rose-100 text-rose-600" },
                  { name: "Upcoming", count: "58", badgeBg: "bg-blue-100 text-blue-600" },
                  { name: "Overdue", count: "12", badgeBg: "bg-rose-100 text-rose-600" },
                  { name: "Completed", count: "68", badgeBg: "bg-slate-100 text-slate-600" },
                ].map((tab) => {
                  const isActive = selectedTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => setSelectedTab(tab.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-white border border-blue-500/40 text-blue-600 shadow-2xs"
                          : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {tab.icon && <CheckSquare className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{tab.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? "bg-blue-600 text-white" : tab.badgeBg
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Filter Dropdowns Bar */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-3 space-y-3">
                {/* Search & Top Action */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[280px] relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search follow-ups by name, client, deal, or notes..."
                      className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <span>Filters</span>
                      <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        2
                      </span>
                    </button>

                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Dropdown Filters & Date Range */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Types</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Users</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Statuses</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Priorities</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Date Range Picker */}
                  <div className="ml-auto flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mar 1, 2025 – Mar 31, 2025</span>
                  </div>
                </div>
              </div>

              {/* Main Table Card */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
                      <tr>
                        <th className="py-3 px-2 sm:px-2.5 w-8">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                            className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-1.5 sm:px-2 font-medium w-8">#</th>
                        <th className="py-3 px-2 sm:px-2.5 font-medium">Subject</th>
                        <th className="py-3 px-2 sm:px-2.5 font-medium">Related To</th>
                        <th className="py-3 px-2 sm:px-2.5 font-medium">Type</th>
                        <th className="py-3 px-2 sm:px-2.5 font-medium">Assigned To</th>
                        <th className="py-3 px-2 sm:px-2.5 font-medium">Due Date & Time</th>
                        <th className="py-3 px-2 sm:px-2.5 font-medium">Status</th>
                        <th className="py-3 px-2 sm:px-2.5 font-medium">Priority</th>
                        <th className="py-3 px-1.5 sm:px-2 font-medium text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredData.map((item) => {
                        const isChecked = selectedRows.includes(item.id);
                        const TypeIcon = item.typeIcon;

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                              isChecked ? "bg-blue-50/30" : ""
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-3 px-2 sm:px-2.5" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleRow(item.id)}
                                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                              />
                            </td>

                            {/* ID */}
                            <td className="py-3 px-1.5 sm:px-2 font-medium text-slate-400 text-[11px] whitespace-nowrap">
                              {item.id}
                            </td>

                            {/* Subject */}
                            <td className="py-3 px-2 sm:px-2.5">
                              <p className="font-bold text-slate-900 leading-tight">
                                {item.subjectTitle}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                                {item.subjectDesc}
                              </p>
                            </td>

                            {/* Related To */}
                            <td className="py-3 px-2 sm:px-2.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${item.companyInitialBg}`}
                                >
                                  {item.companyInitial}
                                </div>
                                <div className="truncate max-w-[140px]">
                                  <p className="font-semibold text-slate-800 leading-tight truncate">
                                    {item.company}
                                  </p>
                                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                    {item.relatedRef}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Type */}
                            <td className="py-3 px-2 sm:px-2.5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${item.typeStyle}`}
                              >
                                <TypeIcon className="w-3 h-3" />
                                <span>{item.type}</span>
                              </span>
                            </td>

                            {/* Assigned To */}
                            <td className="py-3 px-2 sm:px-2.5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.assigneeImg}
                                  alt={item.assigneeName}
                                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                                />
                                <span className="font-semibold text-slate-700">
                                  {item.assigneeName}
                                </span>
                              </div>
                            </td>

                            {/* Due Date & Time */}
                            <td className="py-3 px-2 sm:px-2.5 whitespace-nowrap">
                              <p className="font-medium text-slate-800 leading-tight">
                                {item.dueDate}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {item.dueTime}
                              </p>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-2 sm:px-2.5 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.statusStyle}`}
                              >
                                {item.status}
                              </span>
                            </td>

                            {/* Priority */}
                            <td className="py-3 px-2 sm:px-2.5 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${item.priorityStyle}`}
                              >
                                {item.priority}
                              </span>
                            </td>

                            {/* Actions */}
                            <td
                              className="py-3 px-1.5 sm:px-2 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-800">1</span> to{" "}
                    <span className="font-bold text-slate-800">10</span> of{" "}
                    <span className="font-bold text-slate-800">156</span> follow-ups
                  </p>

                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs">
                      1
                    </button>
                    <button className="w-7 h-7 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                      2
                    </button>
                    <button className="w-7 h-7 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                      3
                    </button>
                    <button className="w-7 h-7 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                      4
                    </button>
                    <button className="w-7 h-7 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                      5
                    </button>
                    <button className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                      <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs hover:bg-slate-50">
                      <span>10 / page</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mini Calendar, Today's Follow-Ups, Statistics, Motivational Card */}
            <div className="w-full xl:w-[330px] 2xl:w-[345px] shrink-0 space-y-4">
              {/* 1. Mini Calendar Card */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">March 2025</h3>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {/* Previous Month Days */}
                  {["23", "24", "25", "26", "27", "28"].map((d, i) => (
                    <span key={`prev-${i}`} className="py-1 text-slate-300">
                      {d}
                    </span>
                  ))}

                  {/* Day 1 */}
                  <span className="py-1 text-slate-700 font-medium">1</span>

                  {/* Days 2 - 8 */}
                  {["2", "3", "4"].map((d) => (
                    <span key={d} className="py-1 text-slate-700 font-medium">
                      {d}
                    </span>
                  ))}
                  {/* 5 with blue dot */}
                  <div className="py-1 flex flex-col items-center justify-center">
                    <span className="text-slate-700 font-medium leading-none">5</span>
                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-1" />
                  </div>
                  {/* 6 with blue dot */}
                  <div className="py-1 flex flex-col items-center justify-center">
                    <span className="text-slate-700 font-medium leading-none">6</span>
                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-1" />
                  </div>
                  {/* 7, 8 */}
                  {["7", "8"].map((d) => (
                    <span key={d} className="py-1 text-slate-700 font-medium">
                      {d}
                    </span>
                  ))}

                  {/* Days 9 - 15 */}
                  <span className="py-1 text-slate-700 font-medium">9</span>
                  {/* 10 - Active Today Date */}
                  <div className="py-0.5 flex flex-col items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      10
                    </span>
                  </div>
                  {/* 11, 12 */}
                  {["11", "12"].map((d) => (
                    <span key={d} className="py-1 text-slate-700 font-medium">
                      {d}
                    </span>
                  ))}
                  {/* 13 with red dot */}
                  <div className="py-1 flex flex-col items-center justify-center">
                    <span className="text-slate-700 font-medium leading-none">13</span>
                    <span className="w-1 h-1 rounded-full bg-rose-500 mt-1" />
                  </div>
                  {/* 14, 15 */}
                  {["14", "15"].map((d) => (
                    <span key={d} className="py-1 text-slate-700 font-medium">
                      {d}
                    </span>
                  ))}

                  {/* Days 16 - 22 */}
                  {["16", "17", "18", "19", "20", "21", "22"].map((d) => (
                    <span key={d} className="py-1 text-slate-700 font-medium">
                      {d}
                    </span>
                  ))}

                  {/* Days 23 - 29 */}
                  {["23", "24", "25", "26", "27", "28", "29"].map((d) => (
                    <span key={d} className="py-1 text-slate-700 font-medium">
                      {d}
                    </span>
                  ))}

                  {/* Days 30, 31 & Next month */}
                  {["30", "31"].map((d) => (
                    <span key={d} className="py-1 text-slate-700 font-medium">
                      {d}
                    </span>
                  ))}
                  {["1", "2", "3", "4", "5"].map((d, i) => (
                    <span key={`next-${i}`} className="py-1 text-slate-300">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Overdue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Upcoming</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>

              {/* 2. Today's Follow-Ups Card */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Follow-Ups</h3>
                  <button className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      time: "11:00 AM",
                      icon: Phone,
                      iconBg: "bg-emerald-50 text-emerald-600",
                      title: "Call with ABC Technologies",
                      desc: "Discuss proposal and pricing",
                    },
                    {
                      time: "02:30 PM",
                      icon: Mail,
                      iconBg: "bg-blue-50 text-blue-600",
                      title: "Email to Global Tech Ltd.",
                      desc: "Send revised proposal",
                    },
                    {
                      time: "04:00 PM",
                      icon: Video,
                      iconBg: "bg-purple-50 text-purple-600",
                      title: "Meeting with Skyline Media",
                      desc: "Product demonstration",
                    },
                  ].map((task, idx) => {
                    const TaskIcon = task.icon;
                    const isChecked = checkedTasks.includes(idx);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap w-16">
                            {task.time}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${task.iconBg}`}
                          >
                            <TaskIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <p
                              className={`text-xs font-semibold text-slate-800 truncate ${
                                isChecked ? "line-through text-slate-400" : ""
                              }`}
                            >
                              {task.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {task.desc}
                            </p>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTodayTask(idx)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer shrink-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Follow-Up Statistics Donut Card */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Follow-Up Statistics</h3>

                <div className="flex items-center justify-between gap-4">
                  {/* Donut Graphic */}
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Circle 1: Completed 44% (Emerald) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray="238.76"
                        strokeDashoffset="0"
                      />
                      {/* Circle 2: Upcoming 37% (Blue) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        strokeDasharray="238.76"
                        strokeDashoffset="105"
                      />
                      {/* Circle 3: Due Today 15% (Purple) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#a855f7"
                        strokeWidth="12"
                        strokeDasharray="238.76"
                        strokeDashoffset="193"
                      />
                      {/* Circle 4: Overdue 8% (Rose/Red) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#f43f5e"
                        strokeWidth="12"
                        strokeDasharray="238.76"
                        strokeDashoffset="229"
                      />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-extrabold text-slate-900 leading-none">
                        156
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Total
                      </span>
                    </div>
                  </div>

                  {/* Legend breakdown */}
                  <div className="space-y-2.5 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                        <span className="text-slate-600 font-medium">Due Today</span>
                      </div>
                      <span className="font-bold text-slate-900">24 (15%)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="text-slate-600 font-medium">Upcoming</span>
                      </div>
                      <span className="font-bold text-slate-900">58 (37%)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-slate-600 font-medium">Overdue</span>
                      </div>
                      <span className="font-bold text-slate-900">12 (8%)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-slate-600 font-medium">Completed</span>
                      </div>
                      <span className="font-bold text-slate-900">68 (44%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Motivational Card */}
              <div className="bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white rounded-2xl border border-blue-100/80 p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-200/60 flex items-center justify-center shrink-0 text-blue-600">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 italic leading-snug">
                    &ldquo;Consistent follow-ups create extraordinary results.&rdquo;
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    — Sales Success
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Global Custom Scrollbar Styling */}
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
