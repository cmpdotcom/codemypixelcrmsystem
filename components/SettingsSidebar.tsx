"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar">
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
