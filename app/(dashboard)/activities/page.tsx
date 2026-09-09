"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Plus,
  Download,
  CalendarDays,
  MoreHorizontal,
  Check,
  Video,
  MessageSquare,
  Sliders,
  Sprout,
  Building2,
  FileText,
} from "lucide-react";

// --- Data & Mock State ---

const kpiStats = [
  {
    title: "Total Activities",
    value: "1,248",
    change: "↑ 18%",
    subtext: "vs last month",
    icon: Phone,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Calls",
    value: "432",
    change: "↑ 12%",
    subtext: "vs last month",
    icon: Phone,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    title: "Emails",
    value: "286",
    change: "↑ 25%",
    subtext: "vs last month",
    icon: Mail,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
  {
    title: "WhatsApp",
    value: "312",
    change: "↑ 20%",
    subtext: "vs last month",
    icon: MessageCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    title: "Meetings",
    value: "156",
    change: "↑ 20%",
    subtext: "vs last month",
    icon: Calendar,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50",
  },
  {
    title: "Notes",
    value: "62",
    change: "↑ 8%",
    subtext: "vs last month",
    icon: FileText,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
];

const activityRows = [
  {
    id: "AC-10421",
    type: "Call",
    direction: "Outbound",
    icon: Phone,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    company: "ABC Technologies",
    contact: "John Carter",
    description: "Discussed project requirements...",
    user: "Ali Khan",
    userImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    date: "Mar 10, 2025",
    time: "02:15 PM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10420",
    type: "Email",
    direction: "Sent",
    icon: Mail,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    company: "Global Tech Ltd.",
    contact: "Sarah Mitchell",
    description: "Sent proposal and pricing details.",
    user: "Fatima Noor",
    userImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    date: "Mar 10, 2025",
    time: "11:30 AM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10419",
    type: "WhatsApp",
    direction: "Inbound",
    icon: MessageCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    company: "Skyline Media",
    contact: "Emma Wilson",
    description: "Client asked about timeline.",
    user: "Usman Tariq",
    userImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    date: "Mar 10, 2025",
    time: "10:45 AM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10418",
    type: "Meeting",
    direction: "Online (Zoom)",
    icon: Calendar,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    company: "NextGen Co.",
    contact: "David Lee",
    description: "Product demo with the team.",
    user: "Sara Ahmed",
    userImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    date: "Mar 9, 2025",
    time: "04:00 PM",
    status: "Scheduled",
    statusStyle: "bg-sky-50 text-sky-600 border border-sky-100",
  },
  {
    id: "AC-10417",
    type: "Note",
    direction: "Internal",
    icon: FileText,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    company: "BrightLink Ltd.",
    contact: "Michael Brown",
    description: "Client is interested in ERP...",
    user: "Ali Khan",
    userImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    date: "Mar 9, 2025",
    time: "01:20 PM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10416",
    type: "Call",
    direction: "Inbound",
    icon: Phone,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    company: "Innovate Ltd.",
    contact: "Sophia Garcia",
    description: "Discussed budget and next steps.",
    user: "Fatima Noor",
    userImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    date: "Mar 9, 2025",
    time: "11:10 AM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10415",
    type: "Email",
    direction: "Received",
    icon: Mail,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    company: "FutureWorks",
    contact: "Daniel Kim",
    description: "Received revised requirements.",
    user: "Usman Tariq",
    userImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    date: "Mar 8, 2025",
    time: "05:45 PM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10414",
    type: "WhatsApp",
    direction: "Outbound",
    icon: MessageCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    company: "Core Systems",
    contact: "Olivia Martinez",
    description: "Shared case studies and portfolio.",
    user: "Sara Ahmed",
    userImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    date: "Mar 8, 2025",
    time: "03:30 PM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10413",
    type: "Meeting",
    direction: "In Person",
    icon: Calendar,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    company: "Vector Inc.",
    contact: "James Anderson",
    description: "Initial meeting at client office.",
    user: "Ali Khan",
    userImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    date: "Mar 7, 2025",
    time: "12:00 PM",
    status: "Completed",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  {
    id: "AC-10412",
    type: "Note",
    direction: "Internal",
    icon: FileText,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    company: "Prime Digital",
    contact: "Isabella Thomas",
    description: "Follow up next week.",
    user: "Fatima Noor",
    userImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    date: "Mar 7, 2025",
    time: "10:15 AM",
    status: "Pending",
    statusStyle: "bg-amber-50 text-amber-600 border border-amber-100",
  },
];

const todaysActivitiesList = [
  {
    id: 1,
    time: "10:00 AM",
    title: "Call with ABC Technologies",
    subtitle: "Discuss project requirements",
    icon: Phone,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    completed: false,
  },
  {
    id: 2,
    time: "11:30 AM",
    title: "Send proposal to Global Tech",
    subtitle: "Email the pricing and timeline",
    icon: Mail,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    completed: false,
  },
  {
    id: 3,
    time: "02:00 PM",
    title: "Demo with Skyline Media",
    subtitle: "Product demonstration (Zoom)",
    icon: Video,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    completed: true,
  },
  {
    id: 4,
    time: "04:00 PM",
    title: "Follow up with NextGen Co.",
    subtitle: "Check their decision",
    icon: MessageCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    completed: false,
  },
];

// --- Activities Page Component ---

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState("All Activities");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [todayTasks, setTodayTasks] = useState(todaysActivitiesList);

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(activityRows.map((r) => r.id));
      setSelectAll(true);
    }
  };

  const toggleTodayTask = (id: number) => {
    setTodayTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <>
      {/* Activities Workspace Content */}
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
          {/* Top Title Bar & Log Activity Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Activities
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Track all communications and interactions in one place.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Log Activity</span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
              </button>
            </div>
          </div>

          {/* Row of 6 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
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
                      <span className="font-bold text-emerald-600">{kpi.change}</span>
                      <span className="text-slate-400">{kpi.subtext}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main 2-Column Split Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols on XL): Tabs, Filters & Activities Table */}
            <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
              {/* Category Filter Tabs & Export Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                  {[
                    { label: "All Activities", count: "1,248" },
                    { label: "Calls", count: "432" },
                    { label: "Emails", count: "286" },
                    { label: "WhatsApp", count: "312" },
                    { label: "Meetings", count: "156" },
                    { label: "Notes", count: "62" },
                  ].map((tab, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(tab.label)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.label
                          ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          activeTab === tab.label
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Export</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Filter Dropdowns Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="relative">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Users</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="relative">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Activity Types</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="relative">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Leads / Clients</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="relative">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Statuses</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Date Picker Input Button */}
                <div className="relative flex-1 min-w-[200px]">
                  <button className="w-full bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mar 1, 2025 – Mar 31, 2025</span>
                    </div>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors cursor-pointer">
                  Reset
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100 bg-slate-50/50">
                    <tr>
                      <th className="py-3 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-2 font-medium">#</th>
                      <th className="py-3 px-3 font-medium">Activity</th>
                      <th className="py-3 px-3 font-medium">Related To</th>
                      <th className="py-3 px-3 font-medium">Description</th>
                      <th className="py-3 px-3 font-medium">User</th>
                      <th className="py-3 px-3 font-medium">Date & Time</th>
                      <th className="py-3 px-3 font-medium">Status</th>
                      <th className="py-3 px-2 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activityRows.map((row) => {
                      const Icon = row.icon;
                      const isSelected = selectedRows.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isSelected ? "bg-blue-50/30" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(row.id)}
                              className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* ID */}
                          <td className="py-3 px-2 font-medium text-slate-500">
                            {row.id}
                          </td>

                          {/* Activity */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.iconBg} ${row.iconColor}`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{row.type}</p>
                                <p className="text-[10px] text-slate-400">
                                  {row.direction}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Related To */}
                          <td className="py-3 px-3">
                            <div>
                              <p className="font-semibold text-slate-800 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-blue-500" />
                                <span>{row.company}</span>
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {row.contact}
                              </p>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">
                            {row.description}
                          </td>

                          {/* User */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={row.userImg}
                                alt={row.user}
                                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                              />
                              <span className="font-medium text-slate-800">
                                {row.user}
                              </span>
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="py-3 px-3 text-slate-700">
                            <div>
                              <p className="font-medium text-slate-800">{row.date}</p>
                              <p className="text-[10px] text-slate-400">{row.time}</p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.statusStyle}`}
                            >
                              {row.status}
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-3 px-2 text-center">
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
                  <span className="font-bold text-slate-800">1,248</span> activities
                </p>

                <div className="flex items-center gap-1">
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
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs hover:bg-slate-50">
                    <span>10 / page</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols on XL): Mini Calendar, Today's Activities, Quick Log, Quote */}
            <div className="xl:col-span-4 space-y-5">
              {/* 1. Mini Calendar Card */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">March 2025</h3>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day Header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-slate-700">
                  {/* Previous month muted */}
                  <span className="text-slate-300 py-1">23</span>
                  <span className="text-slate-300 py-1">24</span>
                  <span className="text-slate-300 py-1">25</span>
                  <span className="text-slate-300 py-1">26</span>
                  <span className="text-slate-300 py-1">27</span>
                  <span className="text-slate-300 py-1">28</span>
                  <span className="py-1">1</span>

                  {/* Week 1 */}
                  <span className="py-1">2</span>
                  <span className="py-1">3</span>
                  <span className="py-1">4</span>
                  <span className="py-1">5</span>
                  <span className="py-1">6</span>
                  <span className="py-1 relative">
                    7
                    <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                  </span>
                  <span className="py-1">8</span>

                  {/* Week 2 (Selected Date 10) */}
                  <span className="py-1 relative">
                    9
                    <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                  </span>
                  <span className="py-1">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center shadow-xs">
                      10
                    </span>
                  </span>
                  <span className="py-1">11</span>
                  <span className="py-1 relative">
                    12
                    <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                  </span>
                  <span className="py-1">13</span>
                  <span className="py-1 relative">
                    14
                    <span className="w-1 h-1 rounded-full bg-purple-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                  </span>
                  <span className="py-1">15</span>

                  {/* Week 3 */}
                  <span className="py-1">16</span>
                  <span className="py-1">17</span>
                  <span className="py-1 relative">
                    18
                    <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                  </span>
                  <span className="py-1">19</span>
                  <span className="py-1">20</span>
                  <span className="py-1">21</span>
                  <span className="py-1">22</span>

                  {/* Week 4 */}
                  <span className="py-1">23</span>
                  <span className="py-1">24</span>
                  <span className="py-1">25</span>
                  <span className="py-1">26</span>
                  <span className="py-1">27</span>
                  <span className="py-1">28</span>
                  <span className="py-1">29</span>

                  {/* Week 5 */}
                  <span className="py-1 relative">
                    30
                    <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                  </span>
                  <span className="py-1">31</span>
                  <span className="text-slate-300 py-1">1</span>
                  <span className="text-slate-300 py-1">2</span>
                  <span className="text-slate-300 py-1">3</span>
                  <span className="text-slate-300 py-1">4</span>
                  <span className="text-slate-300 py-1">5</span>
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-4 mt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Activities</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Meetings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Follow-ups</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Others</span>
                  </div>
                </div>
              </div>

              {/* 2. Today's Activities Card */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Today&apos;s Activities
                  </h3>
                  <a
                    href="#"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </a>
                </div>

                <div className="space-y-3">
                  {todayTasks.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div
                        key={act.id}
                        onClick={() => toggleTodayTask(act.id)}
                        className="flex items-center gap-2.5 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 w-14">
                          {act.time}
                        </span>

                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${act.iconBg} ${act.iconColor}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${
                              act.completed
                                ? "line-through text-slate-400"
                                : "text-slate-800"
                            }`}
                          >
                            {act.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {act.subtitle}
                          </p>
                        </div>

                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                            act.completed
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 bg-white group-hover:border-blue-400"
                          }`}
                        >
                          {act.completed && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Quick Log Activity 8-Icon Grid */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3.5">
                  Quick Log Activity
                </h3>

                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { label: "Call", icon: Phone, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Email", icon: Mail, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "WhatsApp", icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Meeting", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "Note", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Task", icon: CheckSquare, color: "text-rose-500", bg: "bg-rose-50" },
                    { label: "SMS", icon: MessageSquare, color: "text-sky-500", bg: "bg-sky-50" },
                    { label: "Others", icon: Sliders, color: "text-indigo-500", bg: "bg-indigo-50" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={i}
                        className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 group-hover:scale-105 transition-transform ${item.bg} ${item.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Bottom Motivational Sprout Quote Card */}
              <div className="bg-gradient-to-br from-[#eaf3ff] via-[#f1f5fe] to-[#f8f0ff] rounded-2xl border border-blue-100/70 p-4 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-700 italic leading-snug font-medium">
                    &ldquo;Every interaction is an opportunity to build a stronger relationship.&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    — CMP CRM
                  </p>
                </div>
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
