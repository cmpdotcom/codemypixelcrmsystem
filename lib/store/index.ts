export { makeStore } from "./store";
export type { AppStore, RootState, AppDispatch } from "./store";
export { ReduxProvider } from "./ReduxProvider";
export { useAppDispatch, useAppSelector } from "./hooks";
export {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from "./slices/counterSlice";
export {
  addContact,
  updateContact,
  removeContact,
  selectContact,
  type Contact,
} from "./slices/contactsSlice";
export {
  fetchLeads,
  fetchLeadOptions,
  fetchAssignees,
  createLead,
  updateLead,
  deleteLead,
  bulkAction,
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
  type Lead,
  type LeadStats,
  type LeadSettings,
  type LeadAssignee,
} from "./slices/leadsSlice";
