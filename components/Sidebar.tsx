"use client";

import { useEffect, useState } from "react";
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
  Inbox,
  GitMerge,
  ChevronLeft,
  X,
} from "lucide-react";

type NavItem = { icon: typeof LayoutDashboard; label: string; href: string; module: string | null; match?: string };

const navSections: { title: string | null; items: NavItem[] }[] = [
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
      { icon: Settings, label: "Settings", href: "/settings/general", module: "Settings", match: "/settings" },
      { icon: LinkIcon, label: "Integrations", href: "/integrations", module: "Integrations" },
    ],
  },
];


function findActiveHref(pathname: string, items: NavItem[]) {
  let best: NavItem | null = null;
  for (const item of items) {
    const prefix = item.match ?? item.href;
    const matches = prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`);
    if (matches && (!best || prefix.length > (best.match ?? best.href).length)) best = item;
  }
  return best?.href ?? null;
}

export function Sidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
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
  const activeHref = findActiveHref(pathname, visibleSections.flatMap((section) => section.items));

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onClose]);

  const renderContent = (isCollapsed: boolean, isMobile: boolean) => (
    <>
      {/* Brand Header - fixed, never scrolls */}
      <div className="h-16 shrink-0 bg-white border-b border-slate-200 px-5 flex items-center justify-between">
        <Link
          href="/"
          onClick={(e) => {
            if (isCollapsed) {
              e.preventDefault();
              setCollapsed(false);
            } else if (isMobile) {
              onClose?.();
            }
          }}
          className="flex items-center gap-2.5 group min-w-0"
        >
          <Image
            src={logoUrl}
            alt={companyName}
            width={36}
            height={36}
            unoptimized={logoUrl.startsWith("http")}
            className="rounded-xl shadow-sm group-hover:scale-105 transition-transform shrink-0 object-contain"
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none whitespace-nowrap truncate">
                {companyName}
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide whitespace-nowrap">
                Sell. Deliver. Grow.
              </p>
            </div>
          )}
        </Link>
        {isMobile ? (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        ) : !isCollapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections - only this part scrolls */}
      <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto custom-scrollbar">
        {visibleSections.map((section, si) => (
          <div key={si}>
            {section.title && !isCollapsed && (
              <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">
                {section.title}
              </h3>
            )}
            {section.title && isCollapsed && (
              <div className="border-b border-slate-100 my-1.5" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={isMobile ? onClose : undefined}
                    title={isCollapsed ? item.label : undefined}
                    style={
                      isActive
                        ? { backgroundColor: primaryBg, color: primaryHex, borderLeftColor: primaryHex }
                        : undefined
                    }
                    className={`flex items-center gap-3 px-3 ${isMobile ? "py-2.5" : "py-2"} rounded-xl text-sm font-medium transition-colors group border-l-[3px] ${
                      isActive
                        ? "shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      style={isActive ? { color: primaryHex } : undefined}
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? ""
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </>
  );

  return (
    <>
      {/* Desktop / large laptop sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-60"
        } bg-white border-r border-slate-200 flex-col h-dvh shrink-0 hidden lg:flex z-30 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {renderContent(collapsed, false)}
      </aside>

      {/* Phone / tablet drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          {renderContent(false, true)}
        </aside>
      </div>
    </>
  );
}
