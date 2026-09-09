"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Plus,
  Download,
  CalendarDays,
  MoreHorizontal,
  Check,
  Building2,
  X,
  Target,
  Inbox,
  ShieldCheck,
  Trophy,
  Filter,
  Columns,
  MapPin,
  Clock,
  Edit2,
  ArrowUpRight,
  ArrowUp,
  FileSpreadsheet,
} from "lucide-react";

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
    </svg>
  );
}

// --- KPI Stats Data ---
const kpiStats = [
  {
    title: "Total Leads",
    value: "1,248",
    change: "↑ 12%",
    subtext: "vs last month",
    icon: Target,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "New Leads",
    value: "320",
    change: "↑ 18%",
    subtext: "This month",
    icon: Inbox,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    title: "Contacted",
    value: "562",
    change: "↑ 14%",
    subtext: "This month",
    icon: Phone,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    title: "Qualified",
    value: "210",
    change: "↑ 22%",
    subtext: "This month",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "Converted",
    value: "86",
    change: "↑ 30%",
    subtext: "This month",
    icon: Trophy,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
];

// --- Mock Leads Data ---
const initialLeads = [
  {
    id: "LD-10291",
    name: "John Carter",
    company: "ABC Technologies",
    initials: "JC",
    avatarBg: "bg-blue-100 text-blue-700",
    email: "john@abc.com",
    phone: "+1 415 823 4567",
    location: "San Francisco, USA",
    linkedin: "linkedin.com/in/johncarter",
    source: "LinkedIn",
    sourceStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    service: "Custom ERP",
    status: "New",
    statusStyle: "bg-rose-50 text-rose-500 border border-rose-100",
    setter: "Ali Khan",
    setterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    created: "Mar 10, 2025",
    createdFull: "Mar 10, 2025, 10:32 AM",
    lastContact: "Mar 10, 2025, 02:15 PM",
    nextFollowUp: "Mar 12, 2025, 11:00 AM",
    budget: "$20,000 – $50,000",
    timeline: "1 – 3 months",
    companySize: "50–200 employees",
    industry: "Manufacturing",
    recentActivities: [
      {
        icon: Phone,
        iconBg: "bg-emerald-50 text-emerald-500",
        title: "Call made by Ali Khan",
        time: "Mar 10, 02:15 PM",
        desc: "Discussed initial requirements. Client is interested.",
      },
      {
        icon: Mail,
        iconBg: "bg-blue-50 text-blue-500",
        title: "Email sent",
        time: "Mar 10, 11:30 AM",
        desc: "Sent company profile and case studies.",
      },
      {
        icon: FileText,
        iconBg: "bg-purple-50 text-purple-500",
        title: "Note added",
        time: "Mar 10, 10:45 AM",
        desc: "Client requested a demo next week.",
      },
    ],
  },
  {
    id: "LD-10290",
    name: "Sarah Mitchell",
    company: "Global Tech Ltd.",
    initials: "SM",
    avatarBg: "bg-sky-100 text-sky-700",
    email: "sarah@globaltech.com",
    phone: "+44 7700 900123",
    location: "London, UK",
    linkedin: "linkedin.com/in/sarahmitchell",
    source: "Website",
    sourceStyle: "bg-sky-50 text-sky-600 border border-sky-100",
    service: "Website",
    status: "Contacted",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    setter: "Fatima Noor",
    setterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    created: "Mar 10, 2025",
    createdFull: "Mar 10, 2025, 09:15 AM",
    lastContact: "Mar 10, 2025, 11:30 AM",
    nextFollowUp: "Mar 13, 2025, 02:00 PM",
    budget: "$15,000 – $25,000",
    timeline: "2 months",
    companySize: "20–50 employees",
    industry: "E-commerce",
    recentActivities: [
      {
        icon: Mail,
        iconBg: "bg-blue-50 text-blue-500",
        title: "Proposal sent by Fatima Noor",
        time: "Mar 10, 11:30 AM",
        desc: "Sent proposal and pricing details.",
      },
    ],
  },
  {
    id: "LD-10289",
    name: "Michael Brown",
    company: "Bright Solutions",
    initials: "MB",
    avatarBg: "bg-amber-100 text-amber-700",
    email: "michael@bright.com",
    phone: "+1 321 555 7890",
    location: "Austin, TX, USA",
    linkedin: "linkedin.com/in/michaelbrown",
    source: "Referral",
    sourceStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    service: "Mobile App",
    status: "Qualified",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    setter: "Usman Tariq",
    setterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    created: "Mar 9, 2025",
    createdFull: "Mar 9, 2025, 01:20 PM",
    lastContact: "Mar 9, 2025, 04:45 PM",
    nextFollowUp: "Mar 14, 2025, 10:00 AM",
    budget: "$40,000 – $60,000",
    timeline: "3 – 4 months",
    companySize: "100–300 employees",
    industry: "Logistics",
    recentActivities: [
      {
        icon: Phone,
        iconBg: "bg-emerald-50 text-emerald-500",
        title: "Introductory Call",
        time: "Mar 9, 04:45 PM",
        desc: "Reviewed mobile specifications and requirements.",
      },
    ],
  },
  {
    id: "LD-10288",
    name: "Emma Wilson",
    company: "Skyline Media",
    initials: "EW",
    avatarBg: "bg-emerald-100 text-emerald-700",
    email: "emma@skyline.com",
    phone: "+61 412 345 678",
    location: "Sydney, Australia",
    linkedin: "linkedin.com/in/emmawilson",
    source: "Instagram",
    sourceStyle: "bg-pink-50 text-pink-500 border border-pink-100",
    service: "Website",
    status: "Meeting",
    statusStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    setter: "Sara Ahmed",
    setterImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    created: "Mar 9, 2025",
    createdFull: "Mar 9, 2025, 10:45 AM",
    lastContact: "Mar 9, 2025, 03:00 PM",
    nextFollowUp: "Mar 11, 2025, 04:00 PM",
    budget: "$12,000 – $18,000",
    timeline: "1 month",
    companySize: "10–20 employees",
    industry: "Media & Design",
    recentActivities: [
      {
        icon: Calendar,
        iconBg: "bg-purple-50 text-purple-500",
        title: "Meeting Scheduled",
        time: "Mar 9, 03:00 PM",
        desc: "Product demonstration scheduled with the executive team.",
      },
    ],
  },
  {
    id: "LD-10287",
    name: "David Lee",
    company: "NextGen Co.",
    initials: "DL",
    avatarBg: "bg-slate-100 text-slate-700",
    email: "david@nextgen.com",
    phone: "+1 646 555 1212",
    location: "New York, USA",
    linkedin: "linkedin.com/in/davidlee",
    source: "Cold Call",
    sourceStyle: "bg-slate-100 text-slate-600 border border-slate-200",
    service: "CRM",
    status: "Not Interested",
    statusStyle: "bg-red-50 text-red-500 border border-red-100",
    setter: "Ali Khan",
    setterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    created: "Mar 8, 2025",
    createdFull: "Mar 8, 2025, 02:10 PM",
    lastContact: "Mar 8, 2025, 04:00 PM",
    nextFollowUp: "—",
    budget: "$25,000",
    timeline: "Indefinite",
    companySize: "50–100 employees",
    industry: "FinTech",
    recentActivities: [
      {
        icon: Phone,
        iconBg: "bg-red-50 text-red-500",
        title: "Cold Call follow-up",
        time: "Mar 8, 04:00 PM",
        desc: "Client currently using an in-house tool and not looking to switch.",
      },
    ],
  },
  {
    id: "LD-10286",
    name: "Sophia Garcia",
    company: "Innovate Ltd.",
    initials: "SG",
    avatarBg: "bg-purple-100 text-purple-700",
    email: "sophia@innovate.com",
    phone: "+34 600 123 456",
    location: "Madrid, Spain",
    linkedin: "linkedin.com/in/sophiagarcia",
    source: "Google Ads",
    sourceStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    service: "ERP",
    status: "Nurture",
    statusStyle: "bg-purple-50 text-purple-600 border border-purple-100",
    setter: "Fatima Noor",
    setterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    created: "Mar 8, 2025",
    createdFull: "Mar 8, 2025, 11:10 AM",
    lastContact: "Mar 8, 2025, 01:30 PM",
    nextFollowUp: "Mar 18, 2025, 10:00 AM",
    budget: "$35,000 – $50,000",
    timeline: "3 – 6 months",
    companySize: "80–150 employees",
    industry: "Manufacturing",
    recentActivities: [
      {
        icon: Mail,
        iconBg: "bg-blue-50 text-blue-500",
        title: "Nurture email campaign",
        time: "Mar 8, 01:30 PM",
        desc: "Added to quarterly enterprise newsletter.",
      },
    ],
  },
  {
    id: "LD-10285",
    name: "Daniel Kim",
    company: "FutureWorks",
    initials: "DK",
    avatarBg: "bg-purple-100 text-purple-700",
    email: "daniel@futureworks.com",
    phone: "+82 10 1234 5678",
    location: "Seoul, South Korea",
    linkedin: "linkedin.com/in/danielkim",
    source: "Facebook",
    sourceStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    service: "Mobile App",
    status: "Qualified",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    setter: "Usman Tariq",
    setterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    created: "Mar 7, 2025",
    createdFull: "Mar 7, 2025, 05:45 PM",
    lastContact: "Mar 8, 2025, 09:30 AM",
    nextFollowUp: "Mar 15, 2025, 03:00 PM",
    budget: "$30,000 – $45,000",
    timeline: "2 – 3 months",
    companySize: "30–70 employees",
    industry: "SaaS",
    recentActivities: [
      {
        icon: MessageCircle,
        iconBg: "bg-emerald-50 text-emerald-500",
        title: "Chat message via WhatsApp",
        time: "Mar 8, 09:30 AM",
        desc: "Clarified technical stack requirements.",
      },
    ],
  },
  {
    id: "LD-10284",
    name: "Olivia Martinez",
    company: "Core Systems",
    initials: "OM",
    avatarBg: "bg-indigo-100 text-indigo-700",
    email: "olivia@core.com",
    phone: "+1 213 555 9876",
    location: "Los Angeles, CA, USA",
    linkedin: "linkedin.com/in/oliviamartinez",
    source: "Website",
    sourceStyle: "bg-sky-50 text-sky-600 border border-sky-100",
    service: "Custom ERP",
    status: "Proposal",
    statusStyle: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    setter: "Sara Ahmed",
    setterImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    created: "Mar 7, 2025",
    createdFull: "Mar 7, 2025, 03:30 PM",
    lastContact: "Mar 7, 2025, 06:15 PM",
    nextFollowUp: "Mar 11, 2025, 01:00 PM",
    budget: "$50,000 – $80,000",
    timeline: "4 – 6 months",
    companySize: "150–400 employees",
    industry: "Healthcare",
    recentActivities: [
      {
        icon: FileText,
        iconBg: "bg-indigo-50 text-indigo-500",
        title: "Detailed Scope Document sent",
        time: "Mar 7, 06:15 PM",
        desc: "Sent complete proposal and architecture diagram.",
      },
    ],
  },
  {
    id: "LD-10283",
    name: "James Anderson",
    company: "Vector Inc.",
    initials: "JA",
    avatarBg: "bg-blue-100 text-blue-700",
    email: "james@vector.com",
    phone: "+1 305 555 4321",
    location: "Miami, FL, USA",
    linkedin: "linkedin.com/in/jamesanderson",
    source: "WhatsApp",
    sourceStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    service: "Website",
    status: "Contacted",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    setter: "Ali Khan",
    setterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    created: "Mar 6, 2025",
    createdFull: "Mar 6, 2025, 12:00 PM",
    lastContact: "Mar 6, 2025, 02:40 PM",
    nextFollowUp: "Mar 12, 2025, 02:30 PM",
    budget: "$10,000 – $15,000",
    timeline: "1 month",
    companySize: "10–30 employees",
    industry: "Real Estate",
    recentActivities: [
      {
        icon: Phone,
        iconBg: "bg-blue-50 text-blue-500",
        title: "Call by Ali Khan",
        time: "Mar 6, 02:40 PM",
        desc: "Initial meeting at client office.",
      },
    ],
  },
  {
    id: "LD-10282",
    name: "Isabella Thomas",
    company: "Prime Digital",
    initials: "IT",
    avatarBg: "bg-pink-100 text-pink-700",
    email: "isabella@prime.com",
    phone: "+1 617 555 7654",
    location: "Boston, MA, USA",
    linkedin: "linkedin.com/in/isabellathomas",
    source: "Referral",
    sourceStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    service: "CRM",
    status: "New",
    statusStyle: "bg-rose-50 text-rose-500 border border-rose-100",
    setter: "Fatima Noor",
    setterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    created: "Mar 6, 2025",
    createdFull: "Mar 6, 2025, 10:15 AM",
    lastContact: "Mar 6, 2025, 11:00 AM",
    nextFollowUp: "Mar 13, 2025, 11:30 AM",
    budget: "$20,000 – $30,000",
    timeline: "2 months",
    companySize: "40–90 employees",
    industry: "Retail",
    recentActivities: [
      {
        icon: Mail,
        iconBg: "bg-emerald-50 text-emerald-500",
        title: "Welcome email sent",
        time: "Mar 6, 11:00 AM",
        desc: "Follow up scheduled for next week.",
      },
    ],
  },
];

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState("All Leads");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState(initialLeads[0]);
  const [selectedRows, setSelectedRows] = useState<string[]>(["LD-10291"]);
  const [selectAll, setSelectAll] = useState(false);
  const [detailsTab, setDetailsTab] = useState("Overview");

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(initialLeads.map((r) => r.id));
      setSelectAll(true);
    }
  };

  const filteredLeads = initialLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);

    if (activeTab === "All Leads") return matchesSearch;
    return matchesSearch && lead.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="flex h-screen bg-[#f4f7fc] font-sans selection:bg-blue-100 text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-white/95 backdrop-blur-xl border-r border-slate-100 flex flex-col h-screen sticky top-0 custom-scrollbar overflow-y-auto hidden lg:flex shrink-0 z-30">
        {/* Brand Header */}
        <div className="p-5 pb-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl h-9 w-9 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                NexaCRM
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide">
                Sell. Deliver. Grow.
              </p>
            </div>
          </Link>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-3 space-y-5">
          {/* Main Dashboard Link */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Sales Section */}
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Sales
            </h3>
            <div className="space-y-0.5">
              {/* Active Leads Link */}
              <Link
                href="/leads"
                className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm relative border-l-4 border-blue-600 shadow-sm shadow-blue-500/5 transition-all"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Leads</span>
              </Link>

              <Link
                href="/activities"
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
              >
                <Activity className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Activities</span>
              </Link>

              <Link
                href="/deals"
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
              >
                <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Deals</span>
              </Link>

              <Link
                href="/clients"
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
              >
                <Users2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Clients</span>
              </Link>

              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
              >
                <UserPlus className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Follow-ups</span>
              </Link>
            </div>
          </div>

          {/* Delivery Section */}
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Delivery
            </h3>
            <div className="space-y-0.5">
              {[
                { icon: FolderKanban, label: "Projects" },
                { icon: CheckSquare, label: "Tasks" },
                { icon: Flag, label: "Milestones" },
                { icon: Bug, label: "Bugs / QA" },
                { icon: Rocket, label: "Deployments" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Team
            </h3>
            <div className="space-y-0.5">
              {[
                { icon: UserPlus, label: "Setters" },
                { icon: UserCheck, label: "Closers" },
                { icon: Code, label: "Developers" },
                { icon: BarChart2, label: "Performance" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Finance Section */}
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Finance
            </h3>
            <div className="space-y-0.5">
              {[
                { icon: CreditCard, label: "Payments" },
                { icon: DollarSign, label: "Commissions" },
                { icon: FileText, label: "Reports" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* System Section */}
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              System
            </h3>
            <div className="space-y-0.5">
              {[
                { icon: Users, label: "Users" },
                { icon: Settings, label: "Settings" },
                { icon: LinkIcon, label: "Integrations" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upgrade Banner in Sidebar */}
        <div className="p-3 mt-auto">
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100/80 rounded-2xl p-3.5 flex items-center gap-3 relative overflow-hidden">
            <div className="bg-blue-600 text-white rounded-xl p-2 shrink-0 shadow-sm shadow-blue-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Upgrade to Pro</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                Get more features and grow faster.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
        {/* Header Bar */}
        <header className="sticky top-0 z-20 bg-[#f4f7fc]/80 backdrop-blur-xl px-8 py-3.5 flex items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search leads, clients, deals..."
              className="block w-full pl-10 pr-12 py-2 bg-white/90 hover:bg-white border border-slate-200/60 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="inline-flex items-center border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-slate-50">
                ⌘ K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 bg-white rounded-full border border-slate-200/60 shadow-sm hover:shadow transition-all cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <button className="p-2 text-slate-500 hover:text-slate-700 bg-white rounded-full border border-slate-200/60 shadow-sm hover:shadow transition-all cursor-pointer">
              <Grid className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 cursor-pointer">
              <img
                className="h-9 w-9 rounded-full border border-white shadow-sm object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Ahmed Raza"
              />
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-900">Ahmed Raza</p>
                <p className="text-[10px] text-slate-400 font-medium">Sales Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-12">
          {/* Top Title Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Leads
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage, track and convert your leads into valuable clients.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer">
                <Download className="w-4 h-4 text-slate-500" />
                <span>Import Leads</span>
              </button>

              <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Add Lead</span>
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
                      <span className="font-bold text-emerald-600">{kpi.change}</span>
                      <span className="text-slate-400">{kpi.subtext}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main 2-Column Workspace Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left/Center Leads Table Container (8 cols) */}
            <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
              {/* Category Status Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 overflow-x-auto custom-scrollbar">
                <div className="flex items-center gap-1 pb-1 sm:pb-0">
                  {[
                    { label: "All Leads", count: "1,248" },
                    { label: "New", count: "320" },
                    { label: "Contacted", count: "562" },
                    { label: "Qualified", count: "210" },
                    { label: "Not Interested", count: "76" },
                    { label: "Lost", count: "52" },
                    { label: "Nurture", count: "28" },
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
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Bar + Columns & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads by name, company, email or phone..."
                    className="block w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                    <Columns className="w-3.5 h-3.5 text-slate-400" />
                    <span>Columns</span>
                  </button>

                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>Filters</span>
                    <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      2
                    </span>
                  </button>
                </div>
              </div>

              {/* Secondary Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="relative">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Sources</span>
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
                    <span>All Countries</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="relative">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <span>All Setters</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="relative">
                  <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span>Created Date</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("All Leads");
                    setSearchQuery("");
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Leads Table */}
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
                      <th className="py-3 px-3 font-medium">Name / Company</th>
                      <th className="py-3 px-3 font-medium">Contact</th>
                      <th className="py-3 px-3 font-medium">Source</th>
                      <th className="py-3 px-3 font-medium">Service</th>
                      <th className="py-3 px-3 font-medium">Status</th>
                      <th className="py-3 px-3 font-medium">Setter</th>
                      <th className="py-3 px-3 font-medium">Created</th>
                      <th className="py-3 px-2 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLeads.map((lead) => {
                      const isSelected = selectedRows.includes(lead.id);
                      const isDetailActive = selectedLead.id === lead.id;

                      return (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isDetailActive
                              ? "bg-blue-50/40"
                              : isSelected
                              ? "bg-blue-50/20"
                              : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-3" onClick={(e) => toggleSelectRow(lead.id, e)}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Lead ID */}
                          <td className="py-3 px-2 font-medium text-slate-500">
                            {lead.id}
                          </td>

                          {/* Name / Company */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${lead.avatarBg}`}
                              >
                                {lead.initials}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                  {lead.name}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {lead.company}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-3 px-3">
                            <div>
                              <p className="text-slate-700 font-medium">{lead.email}</p>
                              <p className="text-[10px] text-slate-400">{lead.phone}</p>
                            </div>
                          </td>

                          {/* Source */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.sourceStyle}`}
                            >
                              {lead.source}
                            </span>
                          </td>

                          {/* Service */}
                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {lead.service}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.statusStyle}`}
                            >
                              {lead.status}
                            </span>
                          </td>

                          {/* Setter */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={lead.setterImg}
                                alt={lead.setter}
                                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                              />
                              <span className="font-medium text-slate-800">
                                {lead.setter}
                              </span>
                            </div>
                          </td>

                          {/* Created Date */}
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                            {lead.created}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
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
                  <span className="font-bold text-slate-800">1,248</span> leads
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

            {/* Right Column: Active Lead Details Panel (4 cols) */}
            <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
              {/* Header: ID, Status, Cycle navigation */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50">
                    <X className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-900">
                    {selectedLead.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedLead.statusStyle}`}
                  >
                    {selectedLead.status}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-1 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Panel Tabs */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100">
                {["Overview", "Activities", "Notes", "Files"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailsTab(tab)}
                    className={`pb-2 transition-colors relative cursor-pointer ${
                      detailsTab === tab
                        ? "text-blue-600 font-bold"
                        : "hover:text-slate-900"
                    }`}
                  >
                    {tab}
                    {detailsTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Lead Profile Banner */}
              <div className="flex items-start justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${selectedLead.avatarBg}`}
                  >
                    {selectedLead.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {selectedLead.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedLead.company}
                    </p>
                  </div>
                </div>

                <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1 transition-colors cursor-pointer">
                  <span>Edit</span>
                </button>
              </div>

              {/* Contact Icons Row */}
              <div className="space-y-2 py-1 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">
                      {selectedLead.email}
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">
                      {selectedLead.phone}
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">
                      {selectedLead.location}
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                      {selectedLead.linkedin}
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Detailed Key-Value Specs */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Source</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedLead.sourceStyle}`}
                  >
                    {selectedLead.source}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Service Interested</span>
                  <span className="font-semibold text-slate-800">
                    {selectedLead.service}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Budget</span>
                  <span className="font-semibold text-slate-800">
                    {selectedLead.budget}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Timeline</span>
                  <span className="font-semibold text-slate-800">
                    {selectedLead.timeline}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Company Size</span>
                  <span className="font-semibold text-slate-800">
                    {selectedLead.companySize}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Industry</span>
                  <span className="font-semibold text-slate-800">
                    {selectedLead.industry}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Assigned Setter</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <img
                      src={selectedLead.setterImg}
                      alt={selectedLead.setter}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{selectedLead.setter}</span>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Created Date</span>
                  <span className="text-slate-600 font-medium">
                    {selectedLead.createdFull}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Last Contact</span>
                  <span className="text-slate-600 font-medium">
                    {selectedLead.lastContact}
                  </span>
                </div>

                <div className="flex justify-between py-1 items-center">
                  <span className="text-slate-400">Next Follow-up</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/70 px-2 py-0.5 rounded text-[11px] font-bold">
                    {selectedLead.nextFollowUp}
                  </span>
                </div>
              </div>

              {/* Recent Activities Section */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    Recent Activities
                  </h4>
                  <a
                    href="/activities"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </a>
                </div>

                <div className="space-y-3">
                  {selectedLead.recentActivities &&
                    selectedLead.recentActivities.map((act, i) => {
                      const Icon = act.icon;
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${act.iconBg}`}
                          >
                            <Icon className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {act.title}
                              </p>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {act.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {act.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Bottom Add Activity Action Button */}
              <div className="pt-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <span>Add Activity</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Scrollbars */}
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
    </div>
  );
}
