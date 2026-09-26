import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Lead {
  id: string;
  leadNumber: number;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  source: string;
  service: string | null;
  status: string;
  setter: string | null;
  setterImg: string | null;
  setterId?: string | null;
  closer?: string | null;
  closerId?: string | null;
  interestedAt?: string | null;
  interestedNote?: string | null;
  budget: string | null;
  timeline: string | null;
  companySize: string | null;
  industry: string | null;
  lastContact: Date | null;
  nextFollowUp: Date | null;
  notes: string | null;
  customData: Record<string, string> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  notInterested: number;
  lost: number;
  nurture: number;
  meeting: number;
  proposal: number;
  converted: number;
}

export interface LeadSettings {
  statuses: { name: string; color: string; count: number }[];
  industries: string[];
}

export interface LeadAssignee {
  id: string;
  name: string;
  image: string | null;
  role: string;
}

export interface LeadFilters {
  page: number;
  pageSize: number;
  searchQuery: string;
  activeTab: string;
  sourceFilter: string;
  setterFilter: string;
}

interface LeadsState {
  leads: Lead[];
  total: number;
  totalPages: number;
  stats: LeadStats | null;
  leadSettings: LeadSettings;
  assignees: LeadAssignee[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
  filters: LeadFilters;
}

const initialState: LeadsState = {
  leads: [],
  total: 0,
  totalPages: 1,
  stats: null,
  leadSettings: { statuses: [], industries: [] },
  assignees: [],
  selectedLead: null,
  loading: true,
  error: null,
  filters: {
    page: 1,
    pageSize: 50,
    searchQuery: "",
    activeTab: "All Leads",
    sourceFilter: "",
    setterFilter: "",
  },
};

// Status name -> LeadStats key, used to keep KPI cards and tab counts in sync
// with optimistic status changes without waiting on a full refetch.
const STATUS_STAT_KEY: Partial<Record<string, keyof LeadStats>> = {
  New: "new",
  Contacted: "contacted",
  Qualified: "qualified",
  Meeting: "meeting",
  Proposal: "proposal",
  Nurture: "nurture",
  "Not Interested": "notInterested",
  Converted: "converted",
  Lost: "lost",
};

function adjustStatusCount(state: LeadsState, status: string, delta: number) {
  const statusEntry = state.leadSettings.statuses.find((item) => item.name === status);
  if (statusEntry) statusEntry.count = Math.max(0, statusEntry.count + delta);
  const key = STATUS_STAT_KEY[status];
  if (state.stats && key) state.stats[key] = Math.max(0, state.stats[key] + delta);
  if (state.stats) state.stats.total = Math.max(0, state.stats.total + delta);
}

export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (_: void, { getState, rejectWithValue }) => {
    const { filters } = (getState() as { leads: LeadsState }).leads;
    const params = new URLSearchParams({
      page: String(filters.page),
      pageSize: String(filters.pageSize),
    });
    if (filters.searchQuery) params.set("search", filters.searchQuery);
    if (filters.activeTab !== "All Leads") params.set("status", filters.activeTab);
    if (filters.sourceFilter) params.set("source", filters.sourceFilter);
    if (filters.setterFilter) params.set("setter", filters.setterFilter);
    const res = await fetch(`/api/leads?${params}`);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      return rejectWithValue(payload?.error || `Failed to fetch leads (${res.status})`);
    }
    return res.json();
  }
);

export const fetchLeadOptions = createAsyncThunk(
  "leads/fetchLeadOptions",
  async (_: void, { rejectWithValue }) => {
    const res = await fetch("/api/leads/options");
    if (!res.ok) return rejectWithValue("Lead options could not be loaded. Default options are being used.");
    return res.json();
  }
);

export const fetchAssignees = createAsyncThunk(
  "leads/fetchAssignees",
  async (_: void, { rejectWithValue }) => {
    const res = await fetch("/api/leads/assignees");
    if (!res.ok) return rejectWithValue("Lead assignees could not be loaded.");
    return res.json();
  }
);

export const createLead = createAsyncThunk(
  "leads/createLead",
  async (data: Record<string, unknown>, { dispatch, rejectWithValue }) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return rejectWithValue(err?.error || "Failed to create lead");
    }
    const lead = await res.json();
    dispatch(fetchLeads());
    dispatch(fetchLeadOptions());
    return lead;
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async (
    { id, data }: { id: string; data: Record<string, unknown> },
    { dispatch, rejectWithValue }
  ) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      // Resync with the server since the optimistic update needs rolling back.
      dispatch(fetchLeads());
      dispatch(fetchLeadOptions());
      return rejectWithValue("Failed to update lead");
    }
    const updated = await res.json();
    return { id, updated };
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id: string, { dispatch, rejectWithValue }) => {
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (!res.ok) {
      dispatch(fetchLeads());
      dispatch(fetchLeadOptions());
      return rejectWithValue("Failed to delete lead");
    }
    return id;
  }
);

export const bulkAction = createAsyncThunk(
  "leads/bulkAction",
  async (
    args: { action: string; ids: string[]; status?: string; setterId?: string },
    { dispatch, rejectWithValue }
  ) => {
    const res = await fetch("/api/leads/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) {
      dispatch(fetchLeads());
      dispatch(fetchLeadOptions());
      return rejectWithValue("Bulk action failed");
    }
    return res.json();
  }
);

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.filters.pageSize = action.payload;
      state.filters.page = 1;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filters.searchQuery = action.payload;
      state.filters.page = 1;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.filters.activeTab = action.payload;
      state.filters.page = 1;
    },
    setSourceFilter(state, action: PayloadAction<string>) {
      state.filters.sourceFilter = action.payload;
      state.filters.page = 1;
    },
    setSetterFilter(state, action: PayloadAction<string>) {
      state.filters.setterFilter = action.payload;
      state.filters.page = 1;
    },
    clearLeadFilters(state) {
      state.filters.sourceFilter = "";
      state.filters.setterFilter = "";
      state.filters.page = 1;
    },
    setSelectedLead(state, action: PayloadAction<Lead | null>) {
      state.selectedLead = action.payload;
    },
    patchSelectedLead(state, action: PayloadAction<Partial<Lead>>) {
      if (state.selectedLead) Object.assign(state.selectedLead, action.payload);
    },
    clearLeadsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.stats = action.payload.stats;
        if (state.leads.length === 0) {
          state.selectedLead = null;
        } else {
          const current = state.selectedLead;
          const refreshed = current && state.leads.find((lead) => lead.id === current.id);
          state.selectedLead = refreshed || state.leads[0];
        }
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "An error occurred";
      })

      .addCase(fetchLeadOptions.fulfilled, (state, action) => {
        const data = action.payload as LeadSettings;
        state.leadSettings = {
          statuses: Array.isArray(data.statuses) ? data.statuses : [],
          industries: Array.isArray(data.industries) ? data.industries : [],
        };
      })
      .addCase(fetchLeadOptions.rejected, (state, action) => {
        state.error = (action.payload as string) || "Lead options could not be loaded.";
      })

      .addCase(fetchAssignees.fulfilled, (state, action) => {
        state.assignees = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAssignees.rejected, (state, action) => {
        state.error = (action.payload as string) || "Lead assignees could not be loaded.";
      })

      // Optimistic: reflect the change instantly, before the network call resolves.
      .addCase(updateLead.pending, (state, action) => {
        const { id, data } = action.meta.arg;
        const nextStatus = typeof data.status === "string" ? data.status : undefined;
        const lead = state.leads.find((item) => item.id === id);
        if (lead) {
          if (nextStatus && nextStatus !== lead.status) {
            adjustStatusCount(state, lead.status, -1);
            adjustStatusCount(state, nextStatus, 1);
          }
          Object.assign(lead, data);
          if (nextStatus && state.filters.activeTab !== "All Leads" && state.filters.activeTab !== nextStatus) {
            state.leads = state.leads.filter((item) => item.id !== id);
            state.total = Math.max(0, state.total - 1);
          }
        }
        if (state.selectedLead?.id === id) Object.assign(state.selectedLead, data);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const lead = state.leads.find((item) => item.id === id);
        if (lead) Object.assign(lead, updated);
        if (state.selectedLead?.id === id) Object.assign(state.selectedLead, updated);
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update lead";
      })

      .addCase(deleteLead.pending, (state, action) => {
        const id = action.meta.arg;
        const lead = state.leads.find((item) => item.id === id);
        if (lead) {
          adjustStatusCount(state, lead.status, -1);
          state.leads = state.leads.filter((item) => item.id !== id);
          state.total = Math.max(0, state.total - 1);
        }
        if (state.selectedLead?.id === id) state.selectedLead = state.leads[0] || null;
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete lead";
      })

      .addCase(bulkAction.pending, (state, action) => {
        const { action: type, ids, status, setterId } = action.meta.arg;
        if (type === "delete") {
          ids.forEach((id) => {
            const lead = state.leads.find((item) => item.id === id);
            if (lead) adjustStatusCount(state, lead.status, -1);
          });
          state.leads = state.leads.filter((item) => !ids.includes(item.id));
          state.total = Math.max(0, state.total - ids.length);
        } else if (type === "updateStatus" && status) {
          ids.forEach((id) => {
            const lead = state.leads.find((item) => item.id === id);
            if (lead && lead.status !== status) {
              adjustStatusCount(state, lead.status, -1);
              adjustStatusCount(state, status, 1);
              lead.status = status;
            }
          });
          if (state.filters.activeTab !== "All Leads" && state.filters.activeTab !== status) {
            const removed = state.leads.filter((item) => ids.includes(item.id)).length;
            state.leads = state.leads.filter((item) => !ids.includes(item.id));
            state.total = Math.max(0, state.total - removed);
          }
        } else if (type === "updateSetter" && setterId) {
          const assignee = state.assignees.find((item) => item.id === setterId);
          if (assignee) {
            ids.forEach((id) => {
              const lead = state.leads.find((item) => item.id === id);
              if (lead) {
                lead.setterId = assignee.id;
                lead.setter = assignee.name;
                lead.setterImg = assignee.image;
              }
            });
          }
        }
      })
      .addCase(bulkAction.rejected, (state, action) => {
        state.error = (action.payload as string) || "Bulk action failed";
      });
  },
});

export const {
  setPage,
  setPageSize,
  setSearchQuery,
  setActiveTab,
  setSourceFilter,
  setSetterFilter,
  clearLeadFilters,
  setSelectedLead,
  patchSelectedLead,
  clearLeadsError,
} = leadsSlice.actions;

export default leadsSlice.reducer;
