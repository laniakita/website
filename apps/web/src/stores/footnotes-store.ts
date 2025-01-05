import { createStore } from 'zustand/vanilla';

export interface FootnotesState {
  expanded: boolean;
}

export interface FootnotesActions {
  expandFootnotes: () => void;
}

export type FootnotesStore = FootnotesState & FootnotesActions;

export const defaultInitState: FootnotesState = {
  expanded: false,
};

export const createFootnotesStore = (initState: FootnotesState = defaultInitState) => {
  return createStore<FootnotesStore>()((set) => ({
    ...initState,
    expandFootnotes: () => {
      set((state) => ({ expanded: (state.expanded = true) }));
    },
  }));
};
