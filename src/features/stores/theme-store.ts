import { createStore } from 'zustand/vanilla';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeState {
  theme: ThemeMode;
}

export interface ThemeActions {
  setTheme: (theme: ThemeMode) => void;
}

export type ThemeStore = ThemeState & ThemeActions;

export const defaultInitState: ThemeState = {
  theme: 'auto',
};

export const createThemeStore = (initState: ThemeState = defaultInitState) => {
  return createStore<ThemeStore>()((set) => ({
    ...initState,
    setTheme: (theme) => set({ theme }),
  }));
};
