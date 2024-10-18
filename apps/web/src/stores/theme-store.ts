import { createStore } from "zustand/vanilla";

export interface DarkState {
  dark: boolean
}

export interface DarkActions {
  themeDark: () => void;
  themeLight: () => void;
}

export type DarkStore = DarkState & DarkActions

export const defaultInitState: DarkState = {
  dark: true
}

export const createDarkStore = (
  initState: DarkState = defaultInitState,
) => {
  return createStore<DarkStore>()((set) => ({
    ...initState,
    themeDark: () => {
      set((state) => ({ dark: (state.dark = true) }));
    },
    themeLight: () => {
      set((state) => ({ dark: (state.dark = false) }));
    },
  }))
}
