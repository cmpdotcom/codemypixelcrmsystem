"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronRight,
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
      { icon: FolderKanban, label: "Projects", href: "/projects" },
      { icon: CheckSquare, label: "Tasks", href: "/projects/tasks" },
      { icon: Flag, label: "Milestones", href: "/projects/milestones" },
      { icon: Bug, label: "Bugs / QA", href: "/qa" },
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
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: LinkIcon, label: "Integrations", href: "#" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-60"
      } bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 hidden lg:flex z-30 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Brand Header - fixed, never scrolls */}
      <div className="h-16 shrink-0 bg-white border-b border-slate-200 px-5 flex items-center justify-between">
        <Link
          href="/"
          onClick={(e) => {
            if (collapsed) {
              e.preventDefault();
              setCollapsed(false);
            }
          }}
          className="flex items-center gap-2.5 group"
        >
          <Image
            src="/logo.png"
            alt="CMP CRM"
            width={36}
            height={36}
            className="rounded-xl shadow-sm group-hover:scale-105 transition-transform shrink-0"
          />
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                CMP CRM
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide whitespace-nowrap">
                Sell. Deliver. Grow.
              </p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections - only this part scrolls */}
      <div className="flex-1 px-3 py-3 space-y-5 overflow-y-auto custom-scrollbar">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.title && !collapsed && (
              <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">
                {section.title}
              </h3>
            )}
            {section.title && collapsed && (
              <div className="border-b border-slate-100 my-1.5" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors group border-l-[3px] ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-blue-600 shadow-sm shadow-blue-500/5"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Banner / Expand button */}
      <div className="p-3 mt-auto">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
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
        )}
      </div>
    </aside>
  );
}
