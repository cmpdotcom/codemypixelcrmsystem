"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  Building2,
  Users,
  Users2,
  ShieldCheck,
  Target,
  Share2,
  GitBranch,
  Briefcase,
  Activity,
  Bell,
  Users as UsersIcon,
  FolderKanban,
  CheckSquare,
  DollarSign,
  Tag,
  Layers,
  Mail,
  ChevronDown,
} from "lucide-react";

const settingsNav = [
  {
    title: "General",
    items: [
      { icon: Settings, label: "General", href: "/settings/general" },
      { icon: Building2, label: "Company Profile", href: "/settings/company" },
    ],
  },
  {
    title: "People & Access",
    items: [
      { icon: Users, label: "Users", href: "/settings/users" },
      { icon: Users2, label: "Teams", href: "/settings/teams" },
      { icon: ShieldCheck, label: "Roles & Permissions", href: "/settings/roles" },
    ],
  },
  {
    title: "Sales",
    items: [
      { icon: Target, label: "Lead Settings", href: "/settings/leads" },
      { icon: Share2, label: "Lead Sources", href: "/settings/lead-sources" },
      { icon: GitBranch, label: "Lead Assignment", href: "/settings/lead-assignment" },
      { icon: Briefcase, label: "Deal Pipelines", href: "/settings/pipelines" },
      { icon: Layers, label: "Deal Stages", href: "/settings/deal-stages" },
      { icon: Activity, label: "Activity Types", href: "/settings/activity-types" },
      { icon: Bell, label: "Follow-Up Settings", href: "/settings/follow-up-settings" },
    ],
  },
  {
    title: "Customers",
    items: [
      { icon: UsersIcon, label: "Client Settings", href: "/settings/client-settings" },
      { icon: Tag, label: "Tags", href: "/settings/tags" },
      { icon: Layers, label: "Custom Fields", href: "/settings/custom-fields" },
    ],
  },
  {
    title: "Delivery",
    items: [
      { icon: FolderKanban, label: "Project Settings", href: "/settings/project-settings" },
      { icon: CheckSquare, label: "Task Settings", href: "/settings/task-settings" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: DollarSign, label: "Commission Rules", href: "/settings/commissions" },
    ],
  },
  {
    title: "Communication",
    items: [
      { icon: Bell, label: "Notifications", href: "/settings/notifications" },
    ],
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 lg:w-64 bg-white border-r border-slate-200 flex-col h-full shrink-0 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-slate-200 px-5 flex items-center">
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-none">Settings</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            CRM Configuration
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-4 space-y-5">
        {settingsNav.map((section, si) => (
          <div key={si}>
            <h3 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
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
    </aside>
  );
}

// Phones / small tablets: the settings sections collapse into a single picker
export function SettingsMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const current = settingsNav.flatMap((section) => section.items).find((item) => item.href === pathname);

  return (
    <div className="md:hidden shrink-0 bg-white border-b border-slate-200 px-4 py-3">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Settings</label>
      <div className="relative">
        <select
          value={current?.href ?? ""}
          onChange={(event) => router.push(event.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-9 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {!current && <option value="" disabled>Choose a section…</option>}
          {settingsNav.map((section) => (
            <optgroup key={section.title} label={section.title}>
              {section.items.map((item) => (
                <option key={item.href} value={item.href}>{item.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
