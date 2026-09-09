"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Bug,
  FileText,
  Activity,
  DollarSign,
  Settings,
  Plus,
  MoreHorizontal,
  Calendar,
  LayoutDashboard,
  List,
  ListChecks,
  Target,
  ShieldCheck,
  Folder,
  Download,
  TrendingUp,
  Archive,
  Trash2,
  Circle,
  CircleDot,
  Flag,
  Paperclip,
  MessageSquare,
  GitPullRequest,
  Zap,
} from "lucide-react";

// --- Project Header Data ---
const project = {
  name: "ABC ERP Implementation",
  client: "ABC Technologies",
  status: "Development",
  progress: 78,
  health: "On Track",
  deadline: "Sep 25, 2026",
};

// --- Tab Definitions ---
const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "milestones", label: "Milestones", icon: Target },
  { id: "requirements", label: "Requirements", icon: CheckCircle },
  { id: "team", label: "Team", icon: Users },
  { id: "qa", label: "QA", icon: Bug },
  { id: "files", label: "Files", icon: FileText },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "financials", label: "Financials", icon: DollarSign },
  { id: "settings", label: "Settings", icon: Settings },
];

// --- Overview Tab Data ---
const overviewStats = [
  { label: "Progress", value: "78%", icon: TrendingUp, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
  { label: "Days Remaining", value: "15", icon: Clock, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
  { label: "Tasks", value: "84", icon: ListChecks, iconColor: "text-slate-600", iconBg: "bg-slate-100" },
  { label: "Completed", value: "61", icon: CheckCircle2, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
  { label: "Overdue", value: "4", icon: AlertTriangle, iconColor: "text-rose-500", iconBg: "bg-rose-50" },
  { label: "Team Members", value: "6", icon: Users, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
];

const timeline = [
  { label: "Start", date: "Sep 01, 2025", status: "completed" },
  { label: "Requirements", date: "Sep 15, 2025", status: "completed" },
  { label: "Design", date: "Oct 10, 2025", status: "completed" },
  { label: "Development", date: "Jan 2026 – Sep 2026", status: "current" },
  { label: "QA", date: "Sep 18, 2026", status: "pending" },
  { label: "UAT", date: "Sep 22, 2026", status: "pending" },
  { label: "Deployment", date: "Sep 25, 2026", status: "pending" },
  { label: "Deadline", date: "Sep 25, 2026", status: "pending" },
];

const recentActivity = [
  { user: "Ali Khan", action: "completed task", target: "API Authentication Module", time: "2 hours ago", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { user: "Fatima Noor", action: "reported bug", target: "Payroll calculation rounding error", time: "5 hours ago", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" },
  { user: "Usman Tariq", action: "updated milestone", target: "Core Development now 72%", time: "Yesterday", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
  { user: "Sara Ahmed", action: "uploaded file", target: "QA-Report-Phase2.pdf", time: "Yesterday", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" },
  { user: "Ali Khan", action: "moved task to Code Review", target: "Inventory Stock Module", time: "2 days ago", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
];

// --- Tasks Tab Data ---
const taskColumns = [
  {
    id: "backlog",
    title: "Backlog",
    count: 2,
    headerBg: "bg-slate-50 text-slate-600",
    tasks: [
      { id: "t1", name: "Multi-currency support", module: "Accounting", priority: "Low", priorityColor: "bg-emerald-500", assignee: "UT", assigneeBg: "bg-indigo-100 text-indigo-700", due: "Sep 30" },
      { id: "t2", name: "Audit log export", module: "Core", priority: "Medium", priorityColor: "bg-amber-500", assignee: "FN", assigneeBg: "bg-sky-100 text-sky-700", due: "Oct 02" },
    ],
  },
  {
    id: "todo",
    title: "Todo",
    count: 3,
    headerBg: "bg-blue-50 text-blue-700",
    tasks: [
      { id: "t3", name: "Purchase order approval workflow", module: "Inventory", priority: "High", priorityColor: "bg-rose-500", assignee: "AK", assigneeBg: "bg-blue-100 text-blue-700", due: "Sep 20" },
      { id: "t4", name: "Employee onboarding form", module: "HR", priority: "Medium", priorityColor: "bg-amber-500", assignee: "SA", assigneeBg: "bg-purple-100 text-purple-700", due: "Sep 22" },
      { id: "t5", name: "Ledger entry validation", module: "Accounting", priority: "High", priorityColor: "bg-rose-500", assignee: "UT", assigneeBg: "bg-indigo-100 text-indigo-700", due: "Sep 24" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    count: 3,
    headerBg: "bg-amber-50 text-amber-700",
    tasks: [
      { id: "t6", name: "Role-based access control", module: "Auth", priority: "High", priorityColor: "bg-rose-500", assignee: "AK", assigneeBg: "bg-blue-100 text-blue-700", due: "Sep 18" },
      { id: "t7", name: "Attendance calendar UI", module: "HR", priority: "Medium", priorityColor: "bg-amber-500", assignee: "FN", assigneeBg: "bg-sky-100 text-sky-700", due: "Sep 19" },
      { id: "t8", name: "Stock adjustment API", module: "Inventory", priority: "Medium", priorityColor: "bg-amber-500", assignee: "UT", assigneeBg: "bg-indigo-100 text-indigo-700", due: "Sep 21" },
    ],
  },
  {
    id: "review",
    title: "Code Review",
    count: 1,
    headerBg: "bg-purple-50 text-purple-700",
    tasks: [
      { id: "t9", name: "Password reset flow", module: "Auth", priority: "Medium", priorityColor: "bg-amber-500", assignee: "SA", assigneeBg: "bg-purple-100 text-purple-700", due: "Sep 17" },
    ],
  },
  {
    id: "qa",
    title: "QA",
    count: 1,
    headerBg: "bg-teal-50 text-teal-700",
    tasks: [
      { id: "t10", name: "Employee list pagination", module: "HR", priority: "Low", priorityColor: "bg-emerald-500", assignee: "FN", assigneeBg: "bg-sky-100 text-sky-700", due: "Sep 16" },
    ],
  },
  {
    id: "done",
    title: "Done",
    count: 4,
    headerBg: "bg-emerald-50 text-emerald-700",
    tasks: [
      { id: "t11", name: "User login & JWT", module: "Auth", priority: "High", priorityColor: "bg-rose-500", assignee: "AK", assigneeBg: "bg-blue-100 text-blue-700", due: "Done" },
      { id: "t12", name: "Dashboard widgets", module: "Core", priority: "Medium", priorityColor: "bg-amber-500", assignee: "FN", assigneeBg: "bg-sky-100 text-sky-700", due: "Done" },
      { id: "t13", name: "Navigation sidebar", module: "Core", priority: "Low", priorityColor: "bg-emerald-500", assignee: "SA", assigneeBg: "bg-purple-100 text-purple-700", due: "Done" },
      { id: "t14", name: "Database schema setup", module: "Core", priority: "High", priorityColor: "bg-rose-500", assignee: "UT", assigneeBg: "bg-indigo-100 text-indigo-700", due: "Done" },
    ],
  },
];

const allTasks = taskColumns.flatMap((col) =>
  col.tasks.map((t) => ({ ...t, status: col.title }))
);

// --- Milestones Tab Data ---
const milestones = [
  { name: "Requirements", status: "Completed", progress: 100, deadline: "Sep 15, 2025", tasks: "12/12", dotColor: "bg-emerald-500", barColor: "bg-emerald-500" },
  { name: "UI/UX Design", status: "Completed", progress: 100, deadline: "Oct 10, 2025", tasks: "18/18", dotColor: "bg-emerald-500", barColor: "bg-emerald-500" },
  { name: "Core Development", status: "In Progress", progress: 72, deadline: "Sep 10, 2026", tasks: "42/58", dotColor: "bg-blue-500", barColor: "bg-blue-500" },
  { name: "Internal QA", status: "Not Started", progress: 0, deadline: "Sep 18, 2026", tasks: "0/24", dotColor: "bg-slate-300", barColor: "bg-slate-300" },
  { name: "Client UAT", status: "Not Started", progress: 0, deadline: "Sep 22, 2026", tasks: "0/12", dotColor: "bg-slate-300", barColor: "bg-slate-300" },
  { name: "Deployment", status: "Not Started", progress: 0, deadline: "Sep 25, 2026", tasks: "0/8", dotColor: "bg-slate-300", barColor: "bg-slate-300" },
];

// --- Requirements Tab Data ---
const requirementGroups = [
  {
    module: "Authentication",
    moduleColor: "bg-blue-50 text-blue-600 border border-blue-100",
    items: [
      { title: "User Login", done: true, priority: "High", priorityColor: "bg-rose-50 text-rose-600 border border-rose-100", dev: "Ali Khan" },
      { title: "Role Permissions", done: true, priority: "High", priorityColor: "bg-rose-50 text-rose-600 border border-rose-100", dev: "Ali Khan" },
      { title: "Password Reset", done: true, priority: "Medium", priorityColor: "bg-amber-50 text-amber-600 border border-amber-100", dev: "Sara Ahmed" },
    ],
  },
  {
    module: "HR",
    moduleColor: "bg-purple-50 text-purple-600 border border-purple-100",
    items: [
      { title: "Employee Management", done: true, priority: "High", priorityColor: "bg-rose-50 text-rose-600 border border-rose-100", dev: "Fatima Noor" },
      { title: "Attendance", done: true, priority: "Medium", priorityColor: "bg-amber-50 text-amber-600 border border-amber-100", dev: "Fatima Noor" },
      { title: "Payroll", done: false, priority: "High", priorityColor: "bg-rose-50 text-rose-600 border border-rose-100", dev: "Usman Tariq" },
    ],
  },
  {
    module: "Inventory",
    moduleColor: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    items: [
      { title: "Stock Management", done: false, priority: "High", priorityColor: "bg-rose-50 text-rose-600 border border-rose-100", dev: "Usman Tariq" },
      { title: "Purchase Orders", done: false, priority: "Medium", priorityColor: "bg-amber-50 text-amber-600 border border-amber-100", dev: "Usman Tariq" },
    ],
  },
  {
    module: "Accounting",
    moduleColor: "bg-amber-50 text-amber-600 border border-amber-100",
    items: [
      { title: "Ledger", done: false, priority: "High", priorityColor: "bg-rose-50 text-rose-600 border border-rose-100", dev: "Usman Tariq" },
      { title: "Reports", done: false, priority: "Medium", priorityColor: "bg-amber-50 text-amber-600 border border-amber-100", dev: "Fatima Noor" },
    ],
  },
];

// --- Team Tab Data ---
const projectManager = {
  name: "Ali Khan",
  role: "Project Manager",
  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  activeTasks: 3,
};

const teamRoles = [
  {
    role: "Frontend",
    members: [
      { name: "Fatima Noor", role: "Frontend Developer", initials: "FN", bg: "bg-sky-100 text-sky-700", activeTasks: 4, workload: 80 },
      { name: "Sara Ahmed", role: "Frontend Developer", initials: "SA", bg: "bg-purple-100 text-purple-700", activeTasks: 3, workload: 60 },
    ],
  },
  {
    role: "Backend",
    members: [
      { name: "Ali Khan", role: "Backend Developer", initials: "AK", bg: "bg-blue-100 text-blue-700", activeTasks: 5, workload: 100 },
      { name: "Usman Tariq", role: "Backend Developer", initials: "UT", bg: "bg-indigo-100 text-indigo-700", activeTasks: 6, workload: 120 },
    ],
  },
  {
    role: "Mobile",
    members: [
      { name: "Bilal Raza", role: "Mobile Developer", initials: "BR", bg: "bg-emerald-100 text-emerald-700", activeTasks: 2, workload: 40 },
    ],
  },
  {
    role: "QA",
    members: [
      { name: "Hina Ali", role: "QA Tester", initials: "HA", bg: "bg-rose-100 text-rose-700", activeTasks: 3, workload: 70 },
    ],
  },
];

const workloadTable = [
  { name: "Ali Khan", role: "Backend", activeTasks: 5, hours: 38, capacity: 100, barColor: "bg-blue-500" },
  { name: "Usman Tariq", role: "Backend", activeTasks: 6, hours: 46, capacity: 120, barColor: "bg-rose-500" },
  { name: "Fatima Noor", role: "Frontend", activeTasks: 4, hours: 32, capacity: 80, barColor: "bg-emerald-500" },
  { name: "Sara Ahmed", role: "Frontend", activeTasks: 3, hours: 24, capacity: 60, barColor: "bg-emerald-500" },
  { name: "Bilal Raza", role: "Mobile", activeTasks: 2, hours: 16, capacity: 40, barColor: "bg-emerald-500" },
  { name: "Hina Ali", role: "QA", activeTasks: 3, hours: 28, capacity: 70, barColor: "bg-emerald-500" },
];

// --- QA Tab Data ---
const qaStats = [
  { label: "Total Bugs", value: 42, icon: Bug, iconColor: "text-slate-600", iconBg: "bg-slate-100" },
  { label: "Open", value: 12, icon: AlertTriangle, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
  { label: "Critical", value: 2, icon: AlertTriangle, iconColor: "text-rose-500", iconBg: "bg-rose-50" },
  { label: "High", value: 5, icon: Flag, iconColor: "text-orange-500", iconBg: "bg-orange-50" },
  { label: "Medium", value: 4, icon: Flag, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
  { label: "Low", value: 1, icon: Flag, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
  { label: "Verified", value: 30, icon: CheckCircle2, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
];

const bugs = [
  { id: "BUG-001", title: "Payroll calculation rounding error", module: "HR", severity: "Critical", severityColor: "bg-rose-50 text-rose-600 border border-rose-100", assigned: "Usman Tariq", status: "Open" },
  { id: "BUG-002", title: "Login fails on expired token", module: "Auth", severity: "High", severityColor: "bg-orange-50 text-orange-600 border border-orange-100", assigned: "Ali Khan", status: "In Progress" },
  { id: "BUG-003", title: "Stock count not updating in real-time", module: "Inventory", severity: "High", severityColor: "bg-orange-50 text-orange-600 border border-orange-100", assigned: "Usman Tariq", status: "Open" },
  { id: "BUG-004", title: "Employee list pagination broken", module: "HR", severity: "Medium", severityColor: "bg-amber-50 text-amber-600 border border-amber-100", assigned: "Fatima Noor", status: "In Progress" },
  { id: "BUG-005", title: "Date picker timezone offset", module: "Core", severity: "Medium", severityColor: "bg-amber-50 text-amber-600 border border-amber-100", assigned: "Sara Ahmed", status: "Resolved" },
  { id: "BUG-006", title: "Typo in dashboard label", module: "Core", severity: "Low", severityColor: "bg-emerald-50 text-emerald-600 border border-emerald-100", assigned: "Sara Ahmed", status: "Verified" },
];

// --- Files Tab Data ---
const fileFolders = [
  { name: "Requirements", count: 8, icon: FileText, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
  { name: "Design", count: 14, icon: Folder, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
  { name: "Contracts", count: 3, icon: FileText, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
  { name: "Technical", count: 11, icon: FileText, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
  { name: "QA Reports", count: 6, icon: FileText, iconColor: "text-rose-600", iconBg: "bg-rose-50" },
];

const files = [
  { name: "SRS-Document-v3.pdf", size: "2.4 MB", uploadedBy: "Ali Khan", date: "Sep 12, 2025", folder: "Requirements" },
  { name: "UI-Mockups-Final.fig", size: "18.2 MB", uploadedBy: "Sara Ahmed", date: "Oct 08, 2025", folder: "Design" },
  { name: "Master-Service-Agreement.pdf", size: "1.1 MB", uploadedBy: "Ali Khan", date: "Sep 01, 2025", folder: "Contracts" },
  { name: "API-Specification.docx", size: "845 KB", uploadedBy: "Usman Tariq", date: "Nov 15, 2025", folder: "Technical" },
  { name: "QA-Report-Phase2.pdf", size: "3.6 MB", uploadedBy: "Hina Ali", date: "Sep 09, 2026", folder: "QA Reports" },
  { name: "Database-Schema.png", size: "1.8 MB", uploadedBy: "Usman Tariq", date: "Nov 20, 2025", folder: "Technical" },
  { name: "Brand-Guidelines.pdf", size: "5.2 MB", uploadedBy: "Sara Ahmed", date: "Oct 02, 2025", folder: "Design" },
];

// --- Activity Tab Data ---
const activityFeed = [
  { user: "Ali Khan", action: "completed task", target: "API Authentication Module", time: "Sep 10, 2026 2:15 PM", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", icon: CheckCircle2, iconBg: "bg-emerald-50 text-emerald-600" },
  { user: "Fatima Noor", action: "reported bug", target: "Payroll calculation rounding error", time: "Sep 10, 2026 9:30 AM", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80", icon: Bug, iconBg: "bg-rose-50 text-rose-600" },
  { user: "Usman Tariq", action: "updated milestone", target: "Core Development now at 72%", time: "Sep 09, 2026 4:45 PM", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", icon: Target, iconBg: "bg-blue-50 text-blue-600" },
  { user: "Sara Ahmed", action: "uploaded file", target: "QA-Report-Phase2.pdf", time: "Sep 09, 2026 11:20 AM", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80", icon: Paperclip, iconBg: "bg-sky-50 text-sky-600" },
  { user: "Ali Khan", action: "moved task to Code Review", target: "Inventory Stock Module", time: "Sep 08, 2026 3:10 PM", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", icon: GitPullRequest, iconBg: "bg-purple-50 text-purple-600" },
  { user: "Hina Ali", action: "verified bug fix", target: "BUG-006 Typo in dashboard label", time: "Sep 08, 2026 10:05 AM", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80", icon: ShieldCheck, iconBg: "bg-emerald-50 text-emerald-600" },
  { user: "Usman Tariq", action: "fixed bug", target: "BUG-003 Stock count not updating", time: "Sep 07, 2026 5:30 PM", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", icon: Zap, iconBg: "bg-amber-50 text-amber-600" },
  { user: "Fatima Noor", action: "changed project status to", target: "Development", time: "Sep 06, 2026 9:00 AM", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80", icon: Activity, iconBg: "bg-blue-50 text-blue-600" },
  { user: "John Carter", action: "client feedback on", target: "Dashboard widgets layout", time: "Sep 05, 2026 2:40 PM", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", icon: MessageSquare, iconBg: "bg-indigo-50 text-indigo-600" },
  { user: "Ali Khan", action: "assigned task to", target: "Sara Ahmed — Password reset flow", time: "Sep 04, 2026 11:15 AM", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", icon: Users, iconBg: "bg-slate-100 text-slate-600" },
];

// --- Financials Tab Data ---
const financialStats = [
  { label: "Contract Value", value: "$30,000", icon: DollarSign, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
  { label: "Received", value: "$15,000", icon: CheckCircle2, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
  { label: "Outstanding", value: "$15,000", icon: Clock, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
  { label: "Estimated Cost", value: "$12,000", icon: TrendingUp, iconColor: "text-slate-600", iconBg: "bg-slate-100" },
  { label: "Actual Cost", value: "$9,500", icon: TrendingUp, iconColor: "text-purple-600", iconBg: "bg-purple-50" },
  { label: "Estimated Profit", value: "$18,000", icon: DollarSign, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
];

const payments = [
  { label: "1st Payment", amount: "$10,000", date: "Sep 15, 2025", status: "Paid", statusColor: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  { label: "2nd Payment", amount: "$10,000", date: "Jan 15, 2026", status: "Paid", statusColor: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  { label: "Final Payment", amount: "$10,000", date: "Sep 25, 2026", status: "Pending", statusColor: "bg-amber-50 text-amber-600 border border-amber-100" },
];

// --- Settings Tab Data ---
const statusOptions = ["Planning", "Requirements", "Design", "Development", "QA", "UAT", "Deployment", "Completed"];
const priorityOptions = ["Low", "Medium", "High", "Critical"];

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [taskView, setTaskView] = useState<"board" | "list">("board");
  const [checkedReqs, setCheckedReqs] = useState<Record<string, boolean>>({});

  const toggleReq = (key: string, current: boolean) => {
    setCheckedReqs((prev) => ({ ...prev, [key]: !current }));
  };

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1600px] mx-auto w-full pb-12 space-y-5">
      {/* Project Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {project.name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">{project.client}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
                <CircleDot className="w-3 h-3" />
                {project.status}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200/80 text-xs font-semibold px-2.5 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                {project.progress}%
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {project.health}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200/80 text-xs font-semibold px-2.5 py-1 rounded-lg">
                <Calendar className="w-3 h-3" />
                {project.deadline}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
              <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Actions</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {overviewStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">{stat.label}</p>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Project Timeline */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-900">Project Timeline</h3>
                <span className="text-xs text-slate-400">8 phases</span>
              </div>
              <div className="relative pl-2">
                {timeline.map((item, idx) => {
                  const isLast = idx === timeline.length - 1;
                  return (
                    <div key={idx} className="flex items-start gap-3 pb-5 relative">
                      {!isLast && (
                        <div className="absolute left-[11px] top-5 bottom-0 w-px bg-slate-200" />
                      )}
                      <div className="relative z-10 shrink-0 mt-0.5">
                        {item.status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {item.status === "current" && <CircleDot className="w-5 h-5 text-blue-500" />}
                        {item.status === "pending" && <Circle className="w-5 h-5 text-slate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold ${item.status === "current" ? "text-blue-600" : item.status === "completed" ? "text-slate-900" : "text-slate-500"}`}>
                            {item.label}
                            {item.status === "current" && (
                              <span className="ml-2 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">
                                CURRENT
                              </span>
                            )}
                          </p>
                          <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                <button className="text-xs text-blue-600 font-medium hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <img src={act.img} alt={act.user} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">
                        <span className="font-semibold text-slate-900">{act.user}</span> {act.action}{" "}
                        <span className="font-medium text-blue-600">{act.target}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-5">
          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Tasks Board</h3>
            <div className="bg-white border border-slate-200/80 rounded-xl p-1 flex items-center gap-1 shadow-sm">
              <button
                onClick={() => setTaskView("board")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  taskView === "board" ? "bg-blue-50 text-blue-600 border border-blue-100" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setTaskView("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  taskView === "list" ? "bg-blue-50 text-blue-600 border border-blue-100" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>

          {taskView === "board" ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {taskColumns.map((col) => (
                <div key={col.id} className="min-w-[260px] flex-1">
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 ${col.headerBg}`}>
                    <span className="text-xs font-bold">{col.title}</span>
                    <span className="text-xs font-bold bg-white/60 px-1.5 py-0.5 rounded-md">{col.count}</span>
                  </div>
                  <div className="space-y-2.5">
                    {col.tasks.map((task) => (
                      <div key={task.id} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-3 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">{task.name}</p>
                          <MoreHorizontal className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200/80 px-1.5 py-0.5 rounded-md">
                            {task.module}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${task.priorityColor}`} title={`${task.priority} priority`} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${task.assigneeBg}`}>
                            {task.assignee}
                          </div>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {task.due}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Task</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Module</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Priority</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Assignee</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {allTasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-semibold text-slate-900">{task.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200/80 px-1.5 py-0.5 rounded-md">{task.module}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{task.status}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className={`w-2 h-2 rounded-full ${task.priorityColor}`} />
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${task.assigneeBg}`}>
                          {task.assignee}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{task.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="space-y-4">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.status === "Completed" ? "bg-emerald-50" : m.status === "In Progress" ? "bg-blue-50" : "bg-slate-100"}`}>
                    {m.status === "Completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : m.status === "In Progress" ? (
                      <CircleDot className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        m.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                        m.status === "In Progress" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {m.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{m.deadline}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <ListChecks className="w-3 h-3" />{m.tasks} tasks
                      </span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-64 shrink-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-slate-900">{m.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.barColor}`} style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "requirements" && (
        <div className="space-y-4">
          {requirementGroups.map((group, gIdx) => (
            <div key={gIdx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${group.moduleColor}`}>{group.module}</span>
                <span className="text-xs text-slate-400">
                  {group.items.filter((i) => i.done).length}/{group.items.length} complete
                </span>
              </div>
              <div className="space-y-2">
                {group.items.map((item, iIdx) => {
                  const key = `${gIdx}-${iIdx}`;
                  const isChecked = checkedReqs[key] ?? item.done;
                  return (
                    <div key={iIdx} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50/70 transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleReq(key, isChecked)}
                          className="shrink-0 cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                        <span className={`text-sm font-medium ${isChecked ? "text-slate-400 line-through" : "text-slate-900"}`}>
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${item.priorityColor}`}>
                          {item.priority}
                        </span>
                        <span className="text-xs text-slate-500 hidden sm:inline">{item.dev}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-5">
          {/* Project Manager */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Project Manager</h3>
            <div className="flex items-center gap-4">
              <img src={projectManager.img} alt={projectManager.name} className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <p className="text-sm font-bold text-slate-900">{projectManager.name}</p>
                <p className="text-xs text-slate-500">{projectManager.role}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium mt-1">
                  <ListChecks className="w-3 h-3" />{projectManager.activeTasks} active tasks
                </span>
              </div>
            </div>
          </div>

          {/* Team by Role */}
          {teamRoles.map((role, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">{role.role}</h3>
                <span className="text-xs text-slate-400">{role.members.length} {role.members.length === 1 ? "member" : "members"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {role.members.map((m, mIdx) => (
                  <div key={mIdx} className="border border-slate-200/80 rounded-xl p-3.5 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${m.bg}`}>
                        {m.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-500">{m.activeTasks} active tasks</span>
                      <span className={`text-[11px] font-bold ${m.workload > 100 ? "text-rose-600" : "text-slate-700"}`}>{m.workload}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.workload > 100 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(m.workload, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Workload Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Team Workload</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Developer</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Active Tasks</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Hours</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {workloadTable.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{row.name}</span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">{row.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.activeTasks}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.hours}h</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.barColor}`} style={{ width: `${Math.min(row.capacity, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${row.capacity > 100 ? "text-rose-600" : "text-slate-700"}`}>{row.capacity}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "qa" && (
        <div className="space-y-5">
          {/* QA Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3.5">
            {qaStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">{stat.label}</p>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bug List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Bug List</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Report Bug</span>
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Bug ID</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Title</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Module</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Severity</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Assigned</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((bug) => (
                  <tr key={bug.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 text-xs font-bold text-slate-700">{bug.id}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-900">{bug.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200/80 px-1.5 py-0.5 rounded-md">{bug.module}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${bug.severityColor}`}>{bug.severity}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{bug.assigned}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        bug.status === "Open" ? "bg-amber-50 text-amber-600" :
                        bug.status === "In Progress" ? "bg-blue-50 text-blue-600" :
                        bug.status === "Resolved" ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
                      }`}>{bug.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "files" && (
        <div className="space-y-5">
          {/* File Folders */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {fileFolders.map((folder, idx) => {
              const Icon = folder.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${folder.iconBg} ${folder.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{folder.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{folder.count} files</p>
                </div>
              );
            })}
          </div>

          {/* File List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent Files</h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">Upload</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Filename</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Folder</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Size</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Uploaded By</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{file.folder}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{file.size}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{file.uploadedBy}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{file.date}</td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Project Activity</h3>
          <div className="relative pl-2">
            {activityFeed.map((item, idx) => {
              const Icon = item.icon;
              const isLast = idx === activityFeed.length - 1;
              return (
                <div key={idx} className="flex items-start gap-3 pb-5 relative">
                  {!isLast && <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200" />}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start gap-2.5">
                      <img src={item.img} alt={item.user} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-700 leading-snug">
                          <span className="font-semibold text-slate-900">{item.user}</span> {item.action}{" "}
                          <span className="font-medium text-blue-600">{item.target}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "financials" && (
        <div className="space-y-5">
          {/* Financial Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {financialStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">{stat.label}</p>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-900">Payment Schedule</h3>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                Partially Paid
              </span>
            </div>
            <div className="space-y-3">
              {payments.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === "Paid" ? "bg-emerald-50" : "bg-amber-50"}`}>
                      {p.status === "Paid" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{p.label}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />{p.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{p.amount}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${p.statusColor}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Received</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-900">$15,000 / $30,000</span>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "50%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-5">
          {/* Project Settings Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Project Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Project Name</label>
                <input type="text" defaultValue="ABC ERP Implementation" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Client</label>
                <input type="text" defaultValue="ABC Technologies" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Project Manager</label>
                <input type="text" defaultValue="Ali Khan" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Team</label>
                <input type="text" defaultValue="6 members" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Priority</label>
                <select defaultValue="High" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Budget</label>
                <input type="text" defaultValue="$30,000" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Start Date</label>
                <input type="text" defaultValue="Sep 01, 2025" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Deadline</label>
                <input type="text" defaultValue="Sep 25, 2026" className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  defaultValue="Comprehensive ERP implementation covering Authentication, HR, Inventory, and Accounting modules with web and mobile interfaces."
                  className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors cursor-pointer">
                Cancel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Status Management</h3>
            <p className="text-xs text-slate-500 mb-4">Update the current status of this project.</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    s === project.status
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-rose-600 mb-1">Danger Zone</h3>
            <p className="text-xs text-slate-500 mb-4">Irreversible and destructive actions.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer">
                <Archive className="w-3.5 h-3.5" />
                <span>Archive Project</span>
              </button>
              <button className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
