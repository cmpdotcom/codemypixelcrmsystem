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
