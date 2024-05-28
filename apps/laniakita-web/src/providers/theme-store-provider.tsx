'use client';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type DarkStore, createDarkStore } from '@/stores/theme-store';

export const DarkStoreContext = createContext<StoreApi<DarkStore> | null>(null);

export interface DarkStoreProviderProps {
  children: ReactNode;
}

export function DarkStoreProvider({ children }: DarkStoreProviderProps) {
  const storeRef = useRef<StoreApi<DarkStore>>();
  if (!storeRef.current) {
    storeRef.current = createDarkStore();
  }
  return <DarkStoreContext.Provider value={storeRef.current}>{children}</DarkStoreContext.Provider>;
}

export const useDarkStore = <T,>(selector: (store: DarkStore) => T): T => {
  const darkStoreContext = useContext(DarkStoreContext);
  if (!darkStoreContext) {
    throw new Error(`useDarkStore must be used within DarkStoreProvider`);
  }
  return useStore(darkStoreContext, selector);
};
