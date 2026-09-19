"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  ShieldCheck,
  Network,
  Crown,
  Mail,
  Calendar,
  Settings,
  Briefcase,
  CheckSquare,
  Activity as ActivityIcon,
  DollarSign,
  Target,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

interface MemberStats {
  leads: number;
  qualifiedLeads: number;
  deals: number;
  wonDeals: number;
  revenue: number;
  tasks: number;
  tasksDone: number;
  activities: number;
  commissions: number;
}

interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  roleColor: string;
  team: string;
  teamDepartment: string | null;
  teamColor: string;
  isTeamLeader: boolean;
  ledTeams: string[];
  status: string;
  lastActive: string | null;
  createdAt: string;
  stats: MemberStats;
}

interface DirectoryKPI {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  teams: number;
  roles: number;
  teamLeaders: number;
}

const ROLE_COLORS: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 border border-blue-100",
  green: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border border-amber-100",
  purple: "bg-purple-50 text-purple-600 border border-purple-100",
  rose: "bg-rose-50 text-rose-600 border border-rose-100",
  slate: "bg-slate-100 text-slate-500 border border-slate-200",
};

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-violet-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-cyan-600",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 3).toUpperCase();
}

function timeAgo(d: string | null) {
  if (!d) return "Never";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function UsersPage() {
  const { money: fmt, formatDate: fmtDate } = useSettings();
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [kpi, setKpi] = useState<DirectoryKPI>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    teams: 0,
    roles: 0,
    teamLeaders: 0,
  });
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [teamOptions, setTeamOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [teamFilter, setTeamFilter] = useState("All Teams");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDirectory = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (roleFilter !== "All Roles") params.set("role", roleFilter);
      if (teamFilter !== "All Teams") params.set("team", teamFilter);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);

      const res = await fetch(`/api/users/directory?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load team directory");
      const data = await res.json();
      setUsers(data.users || []);
      if (data.kpi) setKpi(data.kpi);
      if (data.roleOptions) setRoleOptions(data.roleOptions);
      if (data.teamOptions) setTeamOptions(data.teamOptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, teamFilter, statusFilter]);

  useEffect(() => {
    fetchDirectory();
  }, [fetchDirectory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading team directory...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 xl:p-6 max-w-[1780px] mx-auto w-full pb-12 space-y-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Team Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every team member with live workload stats — leads, deals, tasks, and earnings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/users"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {[
          { label: "Total Members", value: kpi.totalMembers, sub: "Database records", icon: Users, style: "bg-blue-50 text-blue-600" },
          { label: "Active", value: kpi.activeMembers, sub: "Currently enabled", icon: UserCheck, style: "bg-emerald-50 text-emerald-600" },
          { label: "Inactive", value: kpi.inactiveMembers, sub: "Disabled accounts", icon: UserX, style: "bg-rose-50 text-rose-500" },
          { label: "Teams", value: kpi.teams, sub: `${kpi.teamLeaders} with leaders`, icon: Network, style: "bg-purple-50 text-purple-600" },
          { label: "Roles", value: kpi.roles, sub: "Permission profiles", icon: ShieldCheck, style: "bg-amber-50 text-amber-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-3.5 rounded-2xl border border-slate-100/90 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${card.style}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">{card.label}</p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{card.value}</h3>
              <p className="text-[10px] text-slate-400">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members by name or email..."
            className="block w-full pl-9 pr-4 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Roles">All Roles</option>
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Teams">All Teams</option>
            {teamOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(searchQuery || roleFilter !== "All Roles" || teamFilter !== "All Teams" || statusFilter !== "All Statuses") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("All Roles");
                setTeamFilter("All Teams");
                setStatusFilter("All Statuses");
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Member Cards Grid */}
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-12 text-center text-slate-400 text-sm">
          No team members match your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {users.map((user, idx) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-slate-100/90 shadow-sm p-4 hover:shadow-md hover:border-blue-100 transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-white flex items-center justify-center text-xs font-extrabold`}>
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      user.status === "Active" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold text-slate-900 truncate">{user.name}</h3>
                    {user.isTeamLeader && (
                      <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold ${ROLE_COLORS[user.roleColor] || ROLE_COLORS.slate}`}>
                      {user.role}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                      {user.team}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Joined {fmtDate(user.createdAt)} · Active {timeAgo(user.lastActive)}</span>
                </div>
              </div>

              {/* Workload stats */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-100">
                <div className="text-center" title="Leads assigned">
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <Target className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">{user.stats.leads}</p>
                  <p className="text-[9px] text-slate-400 font-medium">Leads</p>
                </div>
                <div className="text-center" title="Deals won / total">
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <Briefcase className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">{user.stats.wonDeals}/{user.stats.deals}</p>
                  <p className="text-[9px] text-slate-400 font-medium">Won</p>
                </div>
                <div className="text-center" title="Tasks done / total">
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <CheckSquare className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">{user.stats.tasksDone}/{user.stats.tasks}</p>
                  <p className="text-[9px] text-slate-400 font-medium">Tasks</p>
                </div>
                <div className="text-center" title="Activities logged">
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <ActivityIcon className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">{user.stats.activities}</p>
                  <p className="text-[9px] text-slate-400 font-medium">Acts</p>
                </div>
              </div>

              {/* Revenue + commissions footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <DollarSign className="w-3 h-3" />
                  {fmt(user.stats.revenue)} revenue
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {fmt(user.stats.commissions)} comm.
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
