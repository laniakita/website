'use client';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type BeegStore, createBeegStore } from '@/stores/beeg-store';

export const BeegStoreContext = createContext<StoreApi<BeegStore> | null>(null);

export interface BeegStoreProviderProps {
  children: ReactNode;
}

export function BeegStoreProvider({ children }: BeegStoreProviderProps) {
  const storeRef = useRef<StoreApi<BeegStore>>();
  if (!storeRef.current) {
    storeRef.current = createBeegStore();
  }
  return <BeegStoreContext.Provider value={storeRef.current}>{children}</BeegStoreContext.Provider>;
}

export const useBeegStore = <T,>(selector: (store: BeegStore) => T): T => {
  const beegStoreContext = useContext(BeegStoreContext);
  if (!beegStoreContext) {
    throw new Error(`useBeegStore must be used within BeegStoreProvider`);
  }
  return useStore(beegStoreContext, selector);
};
