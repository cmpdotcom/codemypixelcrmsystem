import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: "lead" | "active" | "archived";
}

interface ContactsState {
  items: Contact[];
  selectedId: string | null;
}

const initialState: ContactsState = {
  items: [],
  selectedId: null,
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: {
      reducer(state, action: PayloadAction<Contact>) {
        state.items.push(action.payload);
      },
      prepare(contact: Omit<Contact, "id">) {
        return {
          payload: {
            ...contact,
            id: crypto.randomUUID(),
          },
        };
      },
    },
    updateContact: (
      state,
      action: PayloadAction<Pick<Contact, "id"> & Partial<Contact>>,
    ) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeContact: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    },
    selectContact: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
  },
});

export const {
  addContact,
  updateContact,
  removeContact,
  selectContact,
} = contactsSlice.actions;
export default contactsSlice.reducer;
