'use client';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type HajClickerStore, createHajClickerStore } from '@/stores/hajclicker-store';

export const HajClickerStoreContext = createContext<StoreApi<HajClickerStore> | null>(null);

export interface HajClickerStoreProviderProps {
  children: ReactNode;
}

export function HajClickerStoreProvider({ children }: HajClickerStoreProviderProps) {
  const storeRef = useRef<StoreApi<HajClickerStore>>();
  if (!storeRef.current) {
    storeRef.current = createHajClickerStore();
  }
  return <HajClickerStoreContext.Provider value={storeRef.current}>{children}</HajClickerStoreContext.Provider>;
}

export const useHajClickerStore = <T,>(selector: (store: HajClickerStore) => T): T => {
  const postNumStoreContext = useContext(HajClickerStoreContext);
  if (!postNumStoreContext) {
    throw new Error(`useHajClickerStore must be used within HajClickerStoreProvider`);
  }
  return useStore(postNumStoreContext, selector);
};
