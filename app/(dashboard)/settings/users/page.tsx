"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { FormCard, Badge } from "@/components/SettingsUI";
import {
  Search,
  Loader2,
  Trash2,
  Edit2,
  AlertCircle,
  Check,
  X,
  UserCheck,
  UserX,
  Shield,
  Users,
  Mail,
  RefreshCw,
} from "lucide-react";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  roleId: string | null;
  role: string;
  roleColor: "blue" | "green" | "amber" | "purple" | "rose" | "slate";
  teamId: string | null;
  team: string;
  status: "Active" | "Inactive";
  lastActive: string | null;
  createdAt: string;
}

interface RoleOption {
  id: string;
  name: string;
  color: string;
}

interface TeamOption {
  id: string;
  name: string;
  department: string;
}

interface InviteRoleOption {
  id: string;
  name: string;
  color: string;
  description?: string | null;
}

interface InvitationItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  expiresAt: string;
  createdAt: string;
  role: { name: string; color: string };
  team: { name: string } | null;
}

const avatarColors = [
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

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [inviteRoles, setInviteRoles] = useState<InviteRoleOption[]>([]);
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [teamFilter, setTeamFilter] = useState("All Teams");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [userForm, setUserForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: "",
    teamId: "",
    status: "Active" as "Active" | "Inactive",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", firstName: "", lastName: "", roleId: "", teamId: "" });
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [invitationActionId, setInvitationActionId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await fetch("/api/invitations");
      if (!res.ok) throw new Error("Failed to load invitations");
      setInvitations(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading invitations");
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    try {
      const [rolesRes, teamsRes, inviteRolesRes] = await Promise.all([
        fetch("/api/roles"),
        fetch("/api/teams"),
        fetch("/api/invitations/roles"),
      ]);
      if (rolesRes.ok) setRoles(await rolesRes.json());
      if (teamsRes.ok) setTeams(await teamsRes.json());
      if (inviteRolesRes.ok) {
        const data = await inviteRolesRes.json();
        setInviteRoles(data);
        setInviteForm((current) => ({ ...current, roleId: current.roleId || data[0]?.id || "" }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleOpenInviteModal = () => {
    setInviteForm({ email: "", firstName: "", lastName: "", roleId: inviteRoles[0]?.id || "", teamId: "" });
    setInviteLink(null);
    setError(null);
    setShowInviteModal(true);
  };

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setInviteLink(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send invitation");
      setInviteLink(data.devLink || null);
      setSuccess(`Invitation sent to ${inviteForm.email}.`);
      setTimeout(() => setSuccess(null), 5000);
      if (!data.devLink) setShowInviteModal(false);
      await fetchInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send invitation");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchInvitations();
    fetchFilters();
  }, [fetchUsers, fetchInvitations, fetchFilters]);

  const handleResendInvitation = async (invitation: InvitationItem) => {
    setInvitationActionId(invitation.id);
    setError(null);
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/resend`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend invitation");
      setSuccess(`Invitation resent to ${invitation.email}.`);
      setTimeout(() => setSuccess(null), 4000);
      await fetchInvitations();
      if (data.devLink) {
        setInviteLink(data.devLink);
        setShowInviteModal(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend invitation");
    } finally {
      setInvitationActionId(null);
    }
  };

  const handleDeleteInvitation = async (invitation: InvitationItem) => {
    if (!confirm(`Delete the pending invitation for ${invitation.email}?`)) return;
    setInvitationActionId(invitation.id);
    setError(null);
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete invitation");
      setSuccess(`Invitation for ${invitation.email} deleted.`);
      setTimeout(() => setSuccess(null), 4000);
      await fetchInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete invitation");
    } finally {
      setInvitationActionId(null);
    }
  };

  const handleOpenEditModal = (u: UserItem) => {
    setModalMode("edit");
    setUserForm({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      password: "",
      roleId: u.roleId || "",
      teamId: u.teamId || "",
      status: u.status,
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    setError(null);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to change user status");
      setSuccess(`User ${user.name} is now ${nextStatus}.`);
      setTimeout(() => setSuccess(null), 3000);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Are you sure you want to permanently delete user "${user.name}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setSuccess(`User "${user.name}" deleted.`);
      setTimeout(() => setSuccess(null), 3000);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.firstName.trim() || !userForm.email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: userForm.firstName,
            lastName: userForm.lastName,
            email: userForm.email,
            password: userForm.password || "welcome123!",
            roleId: userForm.roleId || null,
            teamId: userForm.teamId || null,
            status: userForm.status,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create user");
      } else {
        const body: Record<string, unknown> = {
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          email: userForm.email,
          roleId: userForm.roleId || null,
          teamId: userForm.teamId || null,
          status: userForm.status,
        };
        if (userForm.password.trim()) {
          body.password = userForm.password;
        }
        const res = await fetch(`/api/users/${userForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update user");
      }
      setShowModal(false);
      setSuccess(modalMode === "create" ? "User created successfully!" : "User updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchesTeam = teamFilter === "All Teams" || u.team === teamFilter;
    const matchesStatus = statusFilter === "All Statuses" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesTeam && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <SettingsPageHeader
        title="Users"
        description="Manage your workspace members, assignments, roles, and access credentials"
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 shadow-2xs"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-2xs cursor-pointer"
          >
            <option>All Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-2xs cursor-pointer"
          >
            <option>All Teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-2xs cursor-pointer"
          >
            <option>All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button onClick={handleOpenInviteModal} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer">
            <Mail className="w-3.5 h-3.5" />
            Invite User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <FormCard title="All Users" description={`${filteredUsers.length} users found in your workspace`}>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50">
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
                  Created
                </th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-slate-400">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-2xs ${
                            avatarColors[idx % avatarColors.length]
                          }`}
                        >
                          {getInitials(user.name || user.email)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge label={user.role} color={user.roleColor} />
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-xs text-slate-600 font-medium">{user.team}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge
                        label={user.status}
                        color={user.status === "Active" ? "green" : "slate"}
                      />
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            user.status === "Active"
                              ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                              : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                          }`}
                          title={user.status === "Active" ? "Deactivate User" : "Activate User"}
                        >
                          {user.status === "Active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </FormCard>

      {invitations.length > 0 && (
        <div className="mt-5">
          <FormCard title="Pending Invitations" description={`${invitations.length} invitation${invitations.length === 1 ? "" : "s"} awaiting acceptance`}>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/50">
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Invitee</th>
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">Role</th>
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">Team</th>
                    <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">Expires</th>
                    <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invitations.map((invitation, idx) => {
                    const inviteeName = `${invitation.firstName || ""} ${invitation.lastName || ""}`.trim() || "Invited user";
                    const isBusy = invitationActionId === invitation.id;
                    return (
                      <tr key={invitation.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-2xs ${avatarColors[idx % avatarColors.length]}`}>{getInitials(inviteeName)}</div>
                            <div><p className="text-xs font-semibold text-slate-900">{inviteeName}</p><p className="text-[11px] text-slate-400">{invitation.email}</p></div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5"><Badge label={invitation.role.name} color={(invitation.role.color || "blue") as UserItem["roleColor"]} /></td>
                        <td className="px-3 py-3.5"><span className="text-xs text-slate-600 font-medium">{invitation.team?.name || "Unassigned"}</span></td>
                        <td className="px-3 py-3.5"><span className="text-xs text-slate-500">{new Date(invitation.expiresAt).toLocaleDateString()}</span></td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleResendInvitation(invitation)} disabled={isBusy} className="p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50" title="Resend invitation">
                              <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? "animate-spin" : ""}`} />
                            </button>
                            <button onClick={() => handleDeleteInvitation(invitation)} disabled={isBusy} className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50" title="Delete invitation">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div><h3 className="text-sm font-bold text-slate-900">Invite a team member</h3><p className="text-[11px] text-slate-500 mt-1">They’ll receive a secure link to create their own password.</p></div>
              <button onClick={() => setShowInviteModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            {inviteLink ? (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2">
                <p className="text-xs font-semibold text-amber-800">Email is not configured, so use this local invite link:</p>
                <a href={inviteLink} className="block text-xs text-blue-700 break-all underline">{inviteLink}</a>
                <button onClick={() => navigator.clipboard?.writeText(inviteLink)} className="text-xs font-semibold text-amber-800">Copy link</button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-semibold text-slate-700">First name<input value={inviteForm.firstName} onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })} placeholder="Optional" className="mt-1.5 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" /></label>
                  <label className="text-xs font-semibold text-slate-700">Last name<input value={inviteForm.lastName} onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })} placeholder="Optional" className="mt-1.5 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" /></label>
                </div>
                <label className="block text-xs font-semibold text-slate-700">Email address<input required type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="name@company.com" className="mt-1.5 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-semibold text-slate-700">Role<select required value={inviteForm.roleId} onChange={(e) => setInviteForm({ ...inviteForm, roleId: e.target.value })} className="mt-1.5 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white">{inviteRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
                  <label className="text-xs font-semibold text-slate-700">Team<select value={inviteForm.teamId} onChange={(e) => setInviteForm({ ...inviteForm, teamId: e.target.value })} className="mt-1.5 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"><option value="">No team yet</option>{teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select></label>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100"><button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg">Cancel</button><button type="submit" disabled={submitting || !inviteForm.roleId} className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-50 flex items-center gap-1.5">{submitting && <Loader2 className="w-3 h-3 animate-spin" />}Send invitation</button></div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
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
                {modalMode === "create" ? "Add New User" : `Edit User: ${userForm.firstName} ${userForm.lastName}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                    placeholder="Ahmed"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                    placeholder="Raza"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {modalMode === "create" ? "Temporary Password" : "Change Password (leave empty to keep current)"}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder={modalMode === "create" ? "Min. 6 characters" : "New password..."}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={userForm.roleId}
                    onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                  >
                    <option value="">Unassigned</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Team</label>
                  <select
                    value={userForm.teamId}
                    onChange={(e) => setUserForm({ ...userForm, teamId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                  >
                    <option value="">Unassigned</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value as "Active" | "Inactive" })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  {modalMode === "create" ? "Create User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
