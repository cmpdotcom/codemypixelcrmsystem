import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import contactsReducer from "./slices/contactsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      counter: counterReducer,
      contacts: contactsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
