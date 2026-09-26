"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSettings } from "@/components/SettingsProvider";
import { hasPermission } from "@/lib/permissions";
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
  Inbox,
  GitMerge,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navSections = [
  {
    title: null,
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/", module: "Dashboard" },
      { icon: Inbox, label: "My Work", href: "/my-work", module: null },
      { icon: GitMerge, label: "Workflow", href: "/workflow", module: "Workflow" },
    ],
  },
  {
    title: "Sales",
    items: [
      { icon: Users, label: "Leads", href: "/leads", module: "Leads" },
      { icon: Activity, label: "Activities", href: "/activities", module: "Activities" },
      { icon: Briefcase, label: "Deals", href: "/deals", module: "Deals" },
      { icon: Users2, label: "Clients", href: "/clients", module: "Clients" },
      { icon: UserPlus, label: "Follow-ups", href: "/follow-ups", module: "Follow-ups" },
    ],
  },
  {
    title: "Delivery",
    items: [
      { icon: FolderKanban, label: "Projects", href: "/projects", module: "Projects" },
      { icon: CheckSquare, label: "Tasks", href: "/projects/tasks", module: "Tasks" },
      { icon: Flag, label: "Milestones", href: "/projects/milestones", module: "Milestones" },
      { icon: Bug, label: "Bugs / QA", href: "/qa", module: "QA" },
      { icon: Rocket, label: "Deployments", href: "/deployments", module: "Deployments" },
    ],
  },
  {
    title: "Team",
    items: [
      { icon: UserPlus, label: "Setters", href: "/team/setters", module: "Setters" },
      { icon: UserCheck, label: "Closers", href: "/team/closers", module: "Closers" },
      { icon: Code, label: "Developers", href: "/team/developers", module: "Developers" },
      { icon: BarChart2, label: "Performance", href: "/team/performance", module: "Performance" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: CreditCard, label: "Payments", href: "/payments", module: "Payments" },
      { icon: DollarSign, label: "Commissions", href: "/commissions", module: "Commissions" },
      { icon: FileText, label: "Reports", href: "/reports", module: "Reports" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: Users, label: "Users", href: "/users", module: "Users" },
      { icon: Settings, label: "Settings", href: "/settings", module: "Settings" },
      { icon: LinkIcon, label: "Integrations", href: "/integrations", module: "Integrations" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  const { companyName, logoUrl, primaryHex, primaryBg } = useSettings();
  const [collapsed, setCollapsed] = useState(false);
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.module === null || sessionStatus === "loading" || !session?.user?.roleName || session?.user?.roleName === "Super Admin" || hasPermission(session?.user?.permissions, item.module, "view")),
    }))
    .filter((section) => section.items.length > 0);

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
            src={logoUrl}
            alt={companyName}
            width={36}
            height={36}
            unoptimized={logoUrl.startsWith("http")}
            className="rounded-xl shadow-sm group-hover:scale-105 transition-transform shrink-0 object-contain"
          />
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                {companyName}
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
        {visibleSections.map((section, si) => (
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
                    style={
                      isActive
                        ? { backgroundColor: primaryBg, color: primaryHex, borderLeftColor: primaryHex }
                        : undefined
                    }
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors group border-l-[3px] ${
                      isActive
                        ? "shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      style={isActive ? { color: primaryHex } : undefined}
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? ""
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
