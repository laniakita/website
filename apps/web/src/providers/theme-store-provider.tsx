'use client';
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- this is how the docs set it up */
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type DarkStore, createDarkStore } from '@/stores/theme-store';

export type DarkStoreApi = ReturnType<typeof createDarkStore>;

export const DarkStoreContext = createContext<DarkStoreApi | undefined>(undefined);

export interface DarkStoreProviderProps {
  children: ReactNode;
}

export function DarkStoreProvider({ children }: DarkStoreProviderProps) {
  //@ts-expect-error -- won't build without it being empty.
  const darkStoreRef = useRef<DarkStoreApi>();

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
