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
  ChevronsLeft,
  ChevronsRight,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Plus,
  Download,
  MoreHorizontal,
  Check,
  Building2,
  Filter,
  Columns,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  Handshake,
  Gem,
  AlertCircle,
  Globe,
  MessageSquare,
  Box,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

// --- KPI Stats Data ---
const kpiStats = [
  {
    title: "Total Clients",
    value: "284",
    change: "↑ 12%",
    isPositive: true,
    subtext: "vs last month",
    icon: Users2,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Active Clients",
    value: "186",
    change: "↑ 18%",
    isPositive: true,
    subtext: "With ongoing projects",
    icon: Handshake,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    title: "Total Revenue",
    value: "$1,250,000",
    change: "↑ 24%",
    isPositive: true,
    subtext: "From all clients",
    icon: Gem,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "Pending Payments",
    value: "$320,000",
    change: "↓ 8%",
    isPositive: false,
    subtext: "Across 42 clients",
    icon: Clock,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
];

// --- Clients Mock Data ---
const initialClients = [
  {
    id: 1,
    company: "ABC Technologies",
    tagline: "Technology Solutions for a Better Tomorrow",
    location: "San Francisco, USA",
    address: "123 Market Street, San Francisco, CA 94105, USA",
    website: "www.abctechnologies.com",
    email: "info@abctechnologies.com",
    phone: "+1 415 823 4567",
    initials: "ABC",
    avatarBg: "bg-blue-100 text-blue-700",
    industry: "Technology",
    industryStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    companySize: "50–200 employees",
    clientSince: "Jan 15, 2024",
    contactName: "John Carter",
    contactRole: "CEO",
    contactEmail: "john@abctechnologies.com",
    contactImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    projectsCount: 3,
    openDeals: 2,
    outstanding: "$25K",
    revenue: "$125,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 10, 2025 2:15 PM",
    recentActivities: [
      {
        icon: Video,
        iconBg: "bg-purple-50 text-purple-600",
        title: "Meeting with John Carter",
        desc: "Discussed project roadmap for Phase 2",
        time: "Mar 10, 2025 2:15 PM",
      },
      {
        icon: FileText,
        iconBg: "bg-blue-50 text-blue-600",
        title: "Proposal sent",
        desc: "Sent revised proposal for additional modules",
        time: "Mar 9, 2025 11:30 AM",
      },
      {
        icon: CheckCircle2,
        iconBg: "bg-emerald-50 text-emerald-600",
        title: "Payment received",
        desc: "$25,000 received via bank transfer",
        time: "Mar 5, 2025 4:20 PM",
      },
      {
        icon: Flag,
        iconBg: "bg-sky-50 text-sky-600",
        title: "Project milestone completed",
        desc: "Phase 1 development completed",
        time: "Mar 3, 2025 10:15 AM",
      },
    ],
  },
  {
    id: 2,
    company: "Global Tech Ltd.",
    tagline: "Global Enterprise IT & Cloud Solutions",
    location: "London, UK",
    address: "45 Canary Wharf, London, E14 5AB, UK",
    website: "www.globaltech.co.uk",
    email: "contact@globaltech.co.uk",
    phone: "+44 7700 900123",
    initials: "GT",
    avatarBg: "bg-sky-100 text-sky-700",
    industry: "IT Services",
    industryStyle: "bg-sky-50 text-sky-600 border border-sky-100",
    companySize: "200–500 employees",
    clientSince: "Apr 10, 2023",
    contactName: "Sarah Mitchell",
    contactRole: "Managing Director",
    contactImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    projectsCount: 2,
    openDeals: 1,
    outstanding: "$15K",
    revenue: "$85,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 9, 2025 11:30 AM",
    recentActivities: [
      {
        icon: FileText,
        iconBg: "bg-blue-50 text-blue-600",
        title: "Quarterly review sent",
        desc: "Shared Q1 analytics and SLA deliverables",
        time: "Mar 9, 2025 11:30 AM",
      },
    ],
  },
  {
    id: 3,
    company: "Skyline Media",
    tagline: "Creative Digital Marketing & Web Studio",
    location: "Toronto, Canada",
    address: "88 Bay Street, Toronto, ON M5J 2R8, Canada",
    website: "www.skylinemedia.ca",
    email: "hello@skylinemedia.ca",
    phone: "+1 416 555 0199",
    initials: "SM",
    avatarBg: "bg-emerald-100 text-emerald-700",
    industry: "Marketing",
    industryStyle: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    companySize: "20–50 employees",
    clientSince: "Jun 22, 2024",
    contactName: "Emma Wilson",
    contactRole: "Founder",
    contactImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    projectsCount: 1,
    openDeals: 1,
    outstanding: "$10K",
    revenue: "$45,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 9, 2025 10:45 AM",
    recentActivities: [
      {
        icon: Phone,
        iconBg: "bg-emerald-50 text-emerald-600",
        title: "Strategy Call",
        desc: "Agreed on launch date for Mobile App redesign",
        time: "Mar 9, 2025 10:45 AM",
      },
    ],
  },
  {
    id: 4,
    company: "BrightLink Solutions",
    tagline: "Advanced Industrial Automation & Systems",
    location: "Berlin, Germany",
    address: "Friedrichstraße 120, 10117 Berlin, Germany",
    website: "www.brightlink-solutions.de",
    email: "info@brightlink-solutions.de",
    phone: "+49 30 1234 5678",
    initials: "BC",
    avatarBg: "bg-rose-100 text-rose-700",
    industry: "Manufacturing",
    industryStyle: "bg-amber-50 text-amber-600 border border-amber-100",
    companySize: "100–300 employees",
    clientSince: "Feb 05, 2023",
    contactName: "Michael Brown",
    contactRole: "Operations Head",
    contactImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    projectsCount: 4,
    openDeals: 3,
    outstanding: "$40K",
    revenue: "$210,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 8, 2025 4:20 PM",
    recentActivities: [
      {
        icon: CheckCircle2,
        iconBg: "bg-emerald-50 text-emerald-600",
        title: "Milestone Signed Off",
        desc: "Factory floor CRM integration approved",
        time: "Mar 8, 2025 4:20 PM",
      },
    ],
  },
  {
    id: 5,
    company: "NextGen Co.",
    tagline: "FinTech Platform & Real-Time Trading Software",
    location: "New York, USA",
    address: "Wall Street Plaza, New York, NY 10005, USA",
    website: "www.nextgenco.io",
    email: "support@nextgenco.io",
    phone: "+1 212 555 9820",
    initials: "NP",
    avatarBg: "bg-slate-900 text-white",
    industry: "Finance",
    industryStyle: "bg-purple-50 text-purple-600 border border-purple-100",
    companySize: "50–150 employees",
    clientSince: "Aug 14, 2023",
    contactName: "David Lee",
    contactRole: "CTO",
    contactImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    projectsCount: 2,
    openDeals: 1,
    outstanding: "$18K",
    revenue: "$90,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 8, 2025 1:10 PM",
    recentActivities: [
      {
        icon: Video,
        iconBg: "bg-purple-50 text-purple-600",
        title: "API Architecture Meeting",
        desc: "Finalized webhook specifications with tech lead",
        time: "Mar 8, 2025 1:10 PM",
      },
    ],
  },
  {
    id: 6,
    company: "Innovate Ltd.",
    tagline: "Healthcare AI & Clinical Research Tools",
    location: "Sydney, Australia",
    address: "200 George St, Sydney NSW 2000, Australia",
    website: "www.innovateltd.com.au",
    email: "contact@innovateltd.com.au",
    phone: "+61 2 9876 5432",
    initials: "IL",
    avatarBg: "bg-orange-100 text-orange-700",
    industry: "Healthcare",
    industryStyle: "bg-teal-50 text-teal-600 border border-teal-100",
    companySize: "30–80 employees",
    clientSince: "Oct 11, 2024",
    contactName: "Sophia Garcia",
    contactRole: "CEO",
    contactImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    projectsCount: 1,
    openDeals: 0,
    outstanding: "$0",
    revenue: "$38,000",
    status: "Inactive",
    statusStyle: "bg-rose-50 text-rose-500 border border-rose-100",
    lastActivity: "Mar 7, 2025 3:45 PM",
    recentActivities: [
      {
        icon: Mail,
        iconBg: "bg-blue-50 text-blue-600",
        title: "Re-engagement email sent",
        desc: "Sent new product roadmap update",
        time: "Mar 7, 2025 3:45 PM",
      },
    ],
  },
  {
    id: 7,
    company: "Core Systems",
    tagline: "Higher Education Portals & LMS Solutions",
    location: "Dubai, UAE",
    address: "Dubai Internet City, Building 3, Dubai, UAE",
    website: "www.coresystems.ae",
    email: "hello@coresystems.ae",
    phone: "+971 4 123 4567",
    initials: "CS",
    avatarBg: "bg-cyan-100 text-cyan-700",
    industry: "Education",
    industryStyle: "bg-sky-50 text-sky-600 border border-sky-100",
    companySize: "300–800 employees",
    clientSince: "Nov 01, 2022",
    contactName: "Daniel Kim",
    contactRole: "Director",
    contactImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    projectsCount: 5,
    openDeals: 2,
    outstanding: "$65K",
    revenue: "$320,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 7, 2025 12:00 PM",
    recentActivities: [
      {
        icon: CheckCircle2,
        iconBg: "bg-emerald-50 text-emerald-600",
        title: "Invoice Cleared",
        desc: "Received $45,000 for Stage 3 delivery",
        time: "Mar 7, 2025 12:00 PM",
      },
    ],
  },
  {
    id: 8,
    company: "FutureWorks",
    tagline: "Commercial Property Asset Management Software",
    location: "Singapore",
    address: "1 Raffles Place, #20-01, Singapore 048616",
    website: "www.futureworks.sg",
    email: "info@futureworks.sg",
    phone: "+65 6789 0123",
    initials: "FW",
    avatarBg: "bg-purple-100 text-purple-700",
    industry: "Real Estate",
    industryStyle: "bg-pink-50 text-pink-600 border border-pink-100",
    companySize: "80–200 employees",
    clientSince: "Dec 05, 2023",
    contactName: "Olivia Martinez",
    contactRole: "Owner",
    contactImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    projectsCount: 2,
    openDeals: 1,
    outstanding: "$12K",
    revenue: "$75,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 6, 2025 5:30 PM",
    recentActivities: [
      {
        icon: Phone,
        iconBg: "bg-emerald-50 text-emerald-600",
        title: "Maintenance follow-up",
        desc: "Confirmed system renewal for 2025",
        time: "Mar 6, 2025 5:30 PM",
      },
    ],
  },
  {
    id: 9,
    company: "Vector Inc.",
    tagline: "Global Supply Chain Tracking & Telematics",
    location: "Tokyo, Japan",
    address: "Roppongi Hills Mori Tower, Tokyo, Japan",
    website: "www.vector-inc.jp",
    email: "support@vector-inc.jp",
    phone: "+81 3 5555 1234",
    initials: "VI",
    avatarBg: "bg-indigo-900 text-white",
    industry: "Logistics",
    industryStyle: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    companySize: "150–400 employees",
    clientSince: "May 19, 2023",
    contactName: "James Anderson",
    contactRole: "CEO",
    contactImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    projectsCount: 3,
    openDeals: 1,
    outstanding: "$20K",
    revenue: "$110,000",
    status: "Active",
    statusStyle: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    lastActivity: "Mar 6, 2025 10:15 AM",
    recentActivities: [
      {
        icon: FileText,
        iconBg: "bg-blue-50 text-blue-600",
        title: "Contract renewal sent",
        desc: "Submitted annual enterprise support plan",
        time: "Mar 6, 2025 10:15 AM",
      },
    ],
  },
  {
    id: 10,
    company: "Prime Digital",
    tagline: "Omnichannel Retail & Headless Commerce",
    location: "Paris, France",
    address: "15 Rue de la Paix, 75002 Paris, France",
    website: "www.primedigital.fr",
    email: "bonjour@primedigital.fr",
    phone: "+33 1 42 68 55 00",
    initials: "PD",
    avatarBg: "bg-rose-500 text-white",
    industry: "E-commerce",
    industryStyle: "bg-sky-50 text-sky-600 border border-sky-100",
    companySize: "40–90 employees",
    clientSince: "Jan 10, 2025",
    contactName: "Isabella Thomas",
    contactRole: "Founder",
    contactImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    projectsCount: 1,
    openDeals: 1,
    outstanding: "$15K",
    revenue: "$50,000",
    status: "Prospect",
    statusStyle: "bg-blue-50 text-blue-600 border border-blue-100",
    lastActivity: "Mar 5, 2025 4:10 PM",
    recentActivities: [
      {
        icon: Video,
        iconBg: "bg-purple-50 text-purple-600",
        title: "Discovery Workshop",
        desc: "Demonstrated headless commerce connectors",
        time: "Mar 5, 2025 4:10 PM",
      },
    ],
  },
];

function Video({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(initialClients[0]);
  const [selectedRows, setSelectedRows] = useState<number[]>([1]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const toggleSelectRow = (id: number, e: React.MouseEvent) => {
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
      setSelectedRows(initialClients.map((c) => c.id));
      setSelectAll(true);
    }
  };

  const filteredClients = initialClients.filter((c) => {
    return (
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-3 space-y-5">
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
              <Link
                href="/leads"
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium transition-colors group"
              >
                <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
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

              {/* Active Clients Link */}
              <Link
                href="/clients"
                className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm relative border-l-4 border-blue-600 shadow-sm shadow-blue-500/5 transition-all"
              >
                <Users2 className="w-4 h-4 text-blue-600" />
                <span>Clients</span>
              </Link>

              <Link
                href="/follow-ups"
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
              placeholder="Search clients, contacts, deals, or projects..."
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
        <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12">
          {/* Main 2-Column Split Workspace */}
          <div className="flex flex-col xl:flex-row gap-5 items-start">
            {/* Left Column: Title, 4 KPIs, Filters, Table (Takes rest of width) */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Top Title Bar & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Clients
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your clients, build stronger relationships, and grow your business.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Import Clients</span>
                  </button>

                  <button className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Client</span>
                  </button>
                </div>
              </div>

              {/* Row of 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
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
                placeholder="Search clients by name, email, industry, or contact..."
                className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <button className="bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer">
                  <span>All Industries</span>
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
                  <span>All Statuses</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

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

              {/* Clients Table Card */}
              <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 space-y-4">
              {/* Table */}
              <div className="overflow-x-auto">
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
                      <th className="py-3 px-2 font-medium w-8">#</th>
                      <th className="py-3 px-3 font-medium">Company / Client</th>
                      <th className="py-3 px-3 font-medium">Industry</th>
                      <th className="py-3 px-3 font-medium">Contact Person</th>
                      <th className="py-3 px-2 font-medium text-center">Projects</th>
                      <th className="py-3 px-3 font-medium">Total Revenue</th>
                      <th className="py-3 px-3 font-medium">Status</th>
                      <th className="py-3 px-3 font-medium">Last Activity</th>
                      <th className="py-3 px-2 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredClients.map((client) => {
                      const isSelected = selectedRows.includes(client.id);
                      const isDetailActive = selectedClient.id === client.id;

                      return (
                        <tr
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isDetailActive
                              ? "bg-blue-50/40"
                              : isSelected
                              ? "bg-blue-50/20"
                              : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td
                            className="py-3 px-3"
                            onClick={(e) => toggleSelectRow(client.id, e)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Row # */}
                          <td className="py-3 px-2 font-medium text-slate-400">
                            {client.id}
                          </td>

                          {/* Company / Client */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${client.avatarBg}`}
                              >
                                {client.initials}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                  {client.company}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {client.location}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Industry */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${client.industryStyle}`}
                            >
                              {client.industry}
                            </span>
                          </td>

                          {/* Contact Person */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={client.contactImg}
                                alt={client.contactName}
                                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-semibold text-slate-800 leading-tight">
                                  {client.contactName}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {client.contactRole}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Projects Count */}
                          <td className="py-3 px-2 text-center font-bold text-slate-700">
                            {client.projectsCount}
                          </td>

                          {/* Total Revenue */}
                          <td className="py-3 px-3 font-extrabold text-slate-900">
                            {client.revenue}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${client.statusStyle}`}
                            >
                              {client.status}
                            </span>
                          </td>

                          {/* Last Activity */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <p className="font-medium text-slate-700 text-xs leading-tight">
                              {client.lastActivity.split(/(?<=2025)\s+/)[0] || client.lastActivity}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {client.lastActivity.split(/(?<=2025)\s+/)[1] || ""}
                            </p>
                          </td>

                          {/* Actions */}
                          <td
                            className="py-3 px-2 text-center"
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
                  <span className="font-bold text-slate-800">284</span> clients
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

            {/* Right Column: Selected Client Detailed Slide Panel */}
            <div className="w-full xl:w-[380px] 2xl:w-[410px] shrink-0 bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.02)] p-5 space-y-4">
              {/* Header: Avatar, Name, Tagline, Status & Menu */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${selectedClient.avatarBg}`}
                  >
                    {selectedClient.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {selectedClient.company}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {selectedClient.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedClient.statusStyle}`}
                  >
                    {selectedClient.status}
                  </span>
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panel Tabs */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100 overflow-x-auto pb-1">
                {["Overview", "Contacts", "Deals", "Projects", "Payments", "Files"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 whitespace-nowrap transition-colors relative cursor-pointer ${
                        activeTab === tab
                          ? "text-blue-600 font-bold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  )
                )}
              </div>

              {/* 2-Column Info Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1 text-xs">
                {/* Left col */}
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Globe className="w-3 h-3" /> Website
                    </span>
                    <a
                      href={`https://${selectedClient.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline truncate block mt-0.5"
                    >
                      {selectedClient.website}
                    </a>
                  </div>

                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Mail className="w-3 h-3" /> Email
                    </span>
                    <p className="font-medium text-slate-800 truncate mt-0.5">
                      {selectedClient.email}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3" /> Phone
                    </span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {selectedClient.phone}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3" /> Address
                    </span>
                    <p className="font-medium text-slate-700 leading-snug mt-0.5">
                      {selectedClient.address}
                    </p>
                  </div>
                </div>

                {/* Right col */}
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Building2 className="w-3 h-3" /> Industry
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {selectedClient.industry}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3" /> Company Size
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {selectedClient.companySize}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" /> Client Since
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {selectedClient.clientSince}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <DollarSign className="w-3 h-3" /> Total Revenue
                    </span>
                    <p className="font-extrabold text-slate-900 mt-0.5">
                      {selectedClient.revenue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats: 4 Cards */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  Quick Stats
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {/* Projects */}
                  <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                    <div className="w-6 h-6 mx-auto rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                      <Box className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {selectedClient.projectsCount}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Projects
                    </span>
                  </div>

                  {/* Open Deals */}
                  <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                    <div className="w-6 h-6 mx-auto rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {selectedClient.openDeals}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Open Deals
                    </span>
                  </div>

                  {/* Total Revenue */}
                  <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                    <div className="w-6 h-6 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                      <BarChart2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 block">
                      $125K
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Total Revenue
                    </span>
                  </div>

                  {/* Outstanding */}
                  <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                    <div className="w-6 h-6 mx-auto rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {selectedClient.outstanding}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Outstanding
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-900">
                    Recent Activity
                  </h4>
                  <Link
                    href="/activities"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {selectedClient.recentActivities &&
                    selectedClient.recentActivities.map((act: any, i: number) => {
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

              {/* Primary Contact Card */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  Primary Contact
                </h4>
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={selectedClient.contactImg}
                        alt={selectedClient.contactName}
                        className="w-10 h-10 rounded-full object-cover border border-white shadow-xs shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                          {selectedClient.contactName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {selectedClient.contactRole}
                        </p>
                      </div>
                    </div>

                    <button className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200/80 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>

                  <div className="mt-3 pl-12 space-y-1 text-xs text-slate-500 font-medium">
                    <p className="text-blue-600 hover:underline cursor-pointer">{selectedClient.contactEmail || selectedClient.email}</p>
                    <p className="text-slate-700">{selectedClient.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
}
