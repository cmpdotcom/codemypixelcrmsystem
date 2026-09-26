import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import contactsReducer from "./slices/contactsSlice";
import leadsReducer from "./slices/leadsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      counter: counterReducer,
      contacts: contactsReducer,
      leads: leadsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
