'use client';
import { createStore } from 'zustand';

export interface DarkState {
  dark: boolean;
}

export const defaultInitState: DarkState = {
  dark: true,
};

export interface DarkActions {
  themeDark: () => void;
  themeLight: () => void;
}

export type DarkStore = DarkState & DarkActions;

export const createDarkStore = (initState: DarkState = defaultInitState) => {
  return createStore<DarkStore>()((set) => ({
    ...initState,
    themeDark: () => {
      set((state) => ({ dark: (state.dark = true) }));
    },
    themeLight: () => {
      set((state) => ({ dark: (state.dark = false) }));
    },
  }));
};
