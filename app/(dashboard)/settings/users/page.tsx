"use client";

import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import {
  FormCard,
  Badge,
} from "@/components/SettingsUI";

interface User {
  name: string;
  email: string;
  role: string;
  team: string;
  status: "Active" | "Inactive";
  lastActive: string;
  roleColor: "blue" | "green" | "amber" | "purple" | "rose" | "slate";
}

const users: User[] = [
  {
    name: "Ahmed Raza",
    email: "ahmed.raza@crm.com",
    role: "Super Admin",
    team: "Sales Team",
    status: "Active",
    lastActive: "2 mins ago",
    roleColor: "purple",
  },
  {
    name: "Sara Ahmed",
    email: "sara.ahmed@crm.com",
    role: "Sales Manager",
    team: "Sales Team",
    status: "Active",
    lastActive: "1 hour ago",
    roleColor: "blue",
  },
  {
    name: "Ali Khan",
    email: "ali.khan@crm.com",
    role: "Setter",
    team: "Setter Team",
    status: "Active",
    lastActive: "5 mins ago",
    roleColor: "amber",
  },
  {
    name: "Mike David",
    email: "mike.david@crm.com",
    role: "Closer",
    team: "Closer Team",
    status: "Active",
    lastActive: "Just now",
    roleColor: "green",
  },
  {
    name: "John Smith",
    email: "john.smith@crm.com",
    role: "Developer",
    team: "Dev Team",
    status: "Inactive",
    lastActive: "3 days ago",
    roleColor: "slate",
  },
  {
    name: "Lisa Wang",
    email: "lisa.wang@crm.com",
    role: "QA",
    team: "Dev Team",
    status: "Active",
    lastActive: "10 mins ago",
    roleColor: "rose",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-slate-500",
];

export default function UsersSettingsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Users"
        description="Manage CRM users and their access"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64"
            />
          </div>
          <select className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
            <option>All Roles</option>
            <option>Super Admin</option>
            <option>Sales Manager</option>
            <option>Setter</option>
            <option>Closer</option>
            <option>Developer</option>
            <option>QA</option>
          </select>
          <select className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
            <option>All Teams</option>
            <option>Sales Team</option>
            <option>Setter Team</option>
            <option>Closer Team</option>
            <option>Dev Team</option>
          </select>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add User
        </button>
      </div>

      {/* Users Table */}
      <FormCard title="All Users" description={`${users.length} users in your workspace`}>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                  User
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                  Role
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                  Team
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                  Status
                </th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                  Last Active
                </th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, idx) => (
                <tr key={user.email} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${avatarColors[idx % avatarColors.length]}`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge label={user.role} color={user.roleColor} />
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-xs text-slate-600">{user.team}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge
                      label={user.status}
                      color={user.status === "Active" ? "green" : "slate"}
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-xs text-slate-500">
                      {user.lastActive}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Edit
                      </button>
                      <button className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors">
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </div>
  );
}
