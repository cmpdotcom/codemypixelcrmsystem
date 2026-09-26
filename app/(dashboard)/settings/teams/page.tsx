"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { Badge } from "@/components/SettingsUI";
import {
  Users,
  Plus,
  Search,
  Loader2,
  Trash2,
  Edit2,
  AlertCircle,
  Check,
  X,
  UserCheck,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  department: string;
  color: "blue" | "green" | "amber" | "purple" | "rose" | "slate";
  leader: string;
  leaderId: string | null;
  memberCount: number;
  members: TeamMember[];
}

interface UserOption {
  id: string;
  name: string;
  email: string;
  teamId: string | null;
}

const DEPARTMENTS = ["All Departments", "Sales", "Delivery", "Development", "QA", "DevOps", "Operations", "Marketing", "Finance"];
const COLOR_OPTIONS: Team["color"][] = ["blue", "green", "purple", "amber", "rose", "slate"];

const avatarBgColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-slate-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamsSettingsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [teamForm, setTeamForm] = useState({
    id: "",
    name: "",
    department: "Sales",
    color: "blue" as Team["color"],
    leaderId: "",
    memberIds: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to load teams");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading teams");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, [fetchTeams, fetchUsers]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setTeamForm({
      id: "",
      name: "",
      department: "Sales",
      color: "blue",
      leaderId: "",
      memberIds: [],
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (team: Team) => {
    setModalMode("edit");
    setTeamForm({
      id: team.id,
      name: team.name,
      department: team.department,
      color: team.color,
      leaderId: team.leaderId || "",
      memberIds: team.members.map((m) => m.id),
    });
    setShowModal(true);
  };

  const handleDeleteTeam = async (team: Team) => {
    if (!confirm(`Are you sure you want to delete team "${team.name}"? Members will become unassigned.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/teams/${team.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete team");
      setSuccess(`Team "${team.name}" deleted.`);
      setTimeout(() => setSuccess(null), 3000);
      await fetchTeams();
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: teamForm.name,
            department: teamForm.department,
            color: teamForm.color,
            leaderId: teamForm.leaderId || null,
            memberIds: teamForm.memberIds,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create team");
      } else {
        const res = await fetch(`/api/teams/${teamForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: teamForm.name,
            department: teamForm.department,
            color: teamForm.color,
            leaderId: teamForm.leaderId || null,
            memberIds: teamForm.memberIds,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update team");
      }
      setShowModal(false);
      setSuccess(modalMode === "create" ? "Team created successfully!" : "Team updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      await fetchTeams();
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMemberSelection = (userId: string) => {
    setTeamForm((prev) => {
      const exists = prev.memberIds.includes(userId);
      return {
        ...prev,
        memberIds: exists ? prev.memberIds.filter((id) => id !== userId) : [...prev.memberIds, userId],
      };
    });
  };

  const filteredTeams = teams.filter((t) => {
    const matchesDept = departmentFilter === "All Departments" || t.department === departmentFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase()) ||
      t.leader.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading teams...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Teams"
        description="Organize workspace users into collaborative departments and teams"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teams..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-64 shadow-2xs"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-2xs cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Team
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{team.name}</h3>
                  <Badge label={team.department} color={team.color} />
                </div>
                <p className="text-xs text-slate-500">
                  Team Leader:{" "}
                  <span className="font-semibold text-slate-700">{team.leader}</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(team)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Edit team"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Delete team"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Member avatars */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 5).map((member, i) => (
                    <div
                      key={member.id}
                      title={`${member.name} (${member.role})`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ring-2 ring-white ${
                        avatarBgColors[i % avatarBgColors.length]
                      }`}
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
                  {team.memberCount === 0 && (
                    <span className="text-xs text-slate-400 italic">No members assigned</span>
                  )}
                </div>
                {team.memberCount > 0 && (
                  <span className="ml-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{team.memberCount}</span>{" "}
                    {team.memberCount === 1 ? "member" : "members"}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleOpenEditModal(team)}
                className="px-3 py-1.5 text-[11px] font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-colors cursor-pointer"
              >
                Manage Members
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Team Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "Add New Team" : `Edit Team: ${teamForm.name}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="e.g. Enterprise Sales"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={teamForm.department}
                    onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                  >
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Color</label>
                  <select
                    value={teamForm.color}
                    onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value as Team["color"] })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white capitalize"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Team Leader</label>
                <select
                  value={teamForm.leaderId}
                  onChange={(e) => setTeamForm({ ...teamForm, leaderId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                >
                  <option value="">No leader assigned</option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Team Members ({teamForm.memberIds.length} selected)
                </label>
                <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-100 p-1">
                  {allUsers.map((u) => {
                    const isSelected = teamForm.memberIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => toggleMemberSelection(u.id)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-xs transition-colors ${
                          isSelected ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({u.email})</span>
                        </div>
                        {u.teamId && u.teamId !== teamForm.id && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            in other team
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {modalMode === "create" ? "Create Team" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
