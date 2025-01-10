'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type DarkStore, createDarkStore } from '@/stores/theme-store';

export type DarkStoreApi = ReturnType<typeof createDarkStore>;

export const DarkStoreContext = createContext<DarkStoreApi | undefined>(undefined);

export interface DarkStoreProviderProps {
  children: ReactNode;
}

export function DarkStoreProvider({ children }: DarkStoreProviderProps) {
  const darkStoreRef = useRef<DarkStoreApi>(null!);

  if (!darkStoreRef.current) {
    darkStoreRef.current = createDarkStore();
  }
  return <DarkStoreContext.Provider value={darkStoreRef.current}>{children}</DarkStoreContext.Provider>;
}

export const useDarkStore = <T,>(selector: (store: DarkStore) => T): T => {
  const darkStoreContext = useContext(DarkStoreContext);
  if (!darkStoreContext) {
    throw new Error(`useDarkStore must be used within DarkStoreProvider`);
  }
  return useStore(darkStoreContext, selector);
};
