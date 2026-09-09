"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronLeft,
} from "lucide-react";

const navSections = [
  {
    title: null,
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/" }],
  },
  {
    title: "Sales",
    items: [
      { icon: Users, label: "Leads", href: "/leads" },
      { icon: Activity, label: "Activities", href: "/activities" },
      { icon: Briefcase, label: "Deals", href: "/deals" },
      { icon: Users2, label: "Clients", href: "/clients" },
      { icon: UserPlus, label: "Follow-ups", href: "/follow-ups" },
    ],
  },
  {
    title: "Delivery",
    items: [
      { icon: FolderKanban, label: "Projects", href: "#" },
      { icon: CheckSquare, label: "Tasks", href: "#" },
      { icon: Flag, label: "Milestones", href: "#" },
      { icon: Bug, label: "Bugs / QA", href: "#" },
      { icon: Rocket, label: "Deployments", href: "#" },
    ],
  },
  {
    title: "Team",
    items: [
      { icon: UserPlus, label: "Setters", href: "#" },
      { icon: UserCheck, label: "Closers", href: "#" },
      { icon: Code, label: "Developers", href: "#" },
      { icon: BarChart2, label: "Performance", href: "#" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: CreditCard, label: "Payments", href: "#" },
      { icon: DollarSign, label: "Commissions", href: "#" },
      { icon: FileText, label: "Reports", href: "#" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: Users, label: "Users", href: "#" },
      { icon: Settings, label: "Settings", href: "#" },
      { icon: LinkIcon, label: "Integrations", href: "#" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 custom-scrollbar overflow-y-auto hidden lg:flex shrink-0 z-30">
      {/* Brand Header - fixed height matching top header exactly */}
      <div className="h-16 shrink-0 bg-white border-b border-slate-200 px-5 flex items-center justify-between">
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
        {navSections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {section.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isDashboard = item.href === "/";
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors group ${
                      isActive
                        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Banner in Sidebar */}
      <div className="p-3 mt-auto">
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100/80 rounded-2xl p-3.5 flex items-center gap-3 relative overflow-hidden">
          <div className="bg-blue-600 text-white rounded-xl p-2 shrink-0 shadow-sm shadow-blue-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Upgrade to Pro</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
              Unlock more power for your team.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
