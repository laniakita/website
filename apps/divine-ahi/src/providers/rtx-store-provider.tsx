'use client';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type RtxStore, createRtxStore } from '@/stores/rtx-store';

export const RtxStoreContext = createContext<StoreApi<RtxStore> | null>(null);

export interface RtxStoreProviderProps {
  children: ReactNode;
}

export function RtxStoreProvider({ children }: RtxStoreProviderProps) {
  const storeRef = useRef<StoreApi<RtxStore>>();
  if (!storeRef.current) {
    storeRef.current = createRtxStore();
  }
  return <RtxStoreContext.Provider value={storeRef.current}>{children}</RtxStoreContext.Provider>;
}

export const useRtxStore = <T,>(selector: (store: RtxStore) => T): T => {
  const rtxStoreContext = useContext(RtxStoreContext);
  if (!rtxStoreContext) {
    throw new Error(`useRtxStore must be used within RtxStoreProvider`);
  }
  return useStore(rtxStoreContext, selector);
};
