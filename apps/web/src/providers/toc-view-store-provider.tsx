'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type ToCViewStore, createToCViewStore } from '@/stores/toc-view-store';

export type ToCViewStoreApi = ReturnType<typeof createToCViewStore>;

export const ToCViewStoreContext = createContext<ToCViewStoreApi | undefined>(undefined);

export interface ToCViewStoreProviderProps {
  children: ReactNode;
}

export function ToCViewStoreProvider({ children }: ToCViewStoreProviderProps) {
  const tocViewStoreRef = useRef<ToCViewStoreApi>(null!);

  if (!tocViewStoreRef.current) {
    tocViewStoreRef.current = createToCViewStore();
  }
  return <ToCViewStoreContext.Provider value={tocViewStoreRef.current}>{children}</ToCViewStoreContext.Provider>;
}

export const useToCViewStore = <T,>(selector: (store: ToCViewStore) => T): T => {
  const tocViewStoreContext = useContext(ToCViewStoreContext);
  if (!tocViewStoreContext) {
    throw new Error(`useToCViewStore must be used within ToCViewStoreProvider`);
  }
  return useStore(tocViewStoreContext, selector);
};
