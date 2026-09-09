"use client";

import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { Badge } from "@/components/SettingsUI";

interface Team {
  name: string;
  department: string;
  departmentColor: "blue" | "green" | "amber" | "purple" | "rose" | "slate";
  leader: string;
  memberCount: number;
  members: { name: string; color: string }[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const teams: Team[] = [
  {
    name: "Sales Team",
    department: "Sales",
    departmentColor: "blue",
    leader: "Ahmed Raza",
    memberCount: 8,
    members: [
      { name: "Ahmed Raza", color: "bg-blue-500" },
      { name: "Sara Ahmed", color: "bg-emerald-500" },
      { name: "Ali Khan", color: "bg-amber-500" },
      { name: "Mike David", color: "bg-purple-500" },
      { name: "John Doe", color: "bg-rose-500" },
    ],
  },
  {
    name: "Setter Team",
    department: "Sales",
    departmentColor: "blue",
    leader: "Ali Khan",
    memberCount: 4,
    members: [
      { name: "Ali Khan", color: "bg-amber-500" },
      { name: "Sara Ahmed", color: "bg-emerald-500" },
      { name: "John Doe", color: "bg-rose-500" },
      { name: "Jane Roe", color: "bg-indigo-500" },
    ],
  },
  {
    name: "Closer Team",
    department: "Sales",
    departmentColor: "blue",
    leader: "Mike David",
    memberCount: 5,
    members: [
      { name: "Mike David", color: "bg-purple-500" },
      { name: "Ahmed Raza", color: "bg-blue-500" },
      { name: "John Doe", color: "bg-rose-500" },
      { name: "Jane Roe", color: "bg-indigo-500" },
      { name: "Sam Lee", color: "bg-teal-500" },
    ],
  },
  {
    name: "Development Team",
    department: "Delivery",
    departmentColor: "green",
    leader: "John Smith",
    memberCount: 12,
    members: [
      { name: "John Smith", color: "bg-slate-500" },
      { name: "Lisa Wang", color: "bg-rose-500" },
      { name: "Sam Lee", color: "bg-teal-500" },
      { name: "Jane Roe", color: "bg-indigo-500" },
      { name: "Tom Hardy", color: "bg-blue-500" },
    ],
  },
];

export default function TeamsSettingsPage() {
  return (
    <div>
      <SettingsPageHeader
        title="Teams"
        description="Organize users into teams and departments"
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
              placeholder="Search teams..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64"
            />
          </div>
          <select className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
            <option>All Departments</option>
            <option>Sales</option>
            <option>Delivery</option>
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
          Add Team
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teams.map((team) => (
          <div
            key={team.name}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    {team.name}
                  </h3>
                  <Badge label={team.department} color={team.departmentColor} />
                </div>
                <p className="text-xs text-slate-500">
                  Team Leader:{" "}
                  <span className="font-semibold text-slate-700">
                    {team.leader}
                  </span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 10-8 0 4 4 0 008 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Member avatars */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 5).map((member, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ring-2 ring-white ${member.color}`}
                      style={{ zIndex: 5 - i }}
                    >
                      {getInitials(member.name)}
                    </div>
                  ))}
                  {team.memberCount > 5 && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 text-[10px] font-semibold ring-2 ring-white bg-slate-100">
                      +{team.memberCount - 5}
                    </div>
                  )}
                </div>
                <span className="ml-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {team.memberCount}
                  </span>{" "}
                  members
                </span>
              </div>
              <button className="px-3 py-1.5 text-[11px] font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-colors">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
