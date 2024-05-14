'use client';
import { createStore } from 'zustand';

export interface BeegState {
  beeg: boolean;
}

export const defaultInitState: BeegState = {
  beeg: false,
};

export interface BeegActions {
  setBeeg: () => void;
  setSmol: () => void;
}

export type BeegStore = BeegState & BeegActions;

export const createBeegStore = (initState: BeegState = defaultInitState) => {
  return createStore<BeegStore>()((set) => ({
    ...initState,
    setBeeg: () => {
      set((state) => ({ beeg: (state.beeg = true) }));
    },
    setSmol: () => {
      set((state) => ({ beeg: (state.beeg = false) }));
    },
  }));
};
