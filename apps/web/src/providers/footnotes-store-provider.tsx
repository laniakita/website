'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type FootnotesStore, createFootnotesStore } from '@/stores/footnotes-store';

export type FootnotesStoreApi = ReturnType<typeof createFootnotesStore>;

export const FootnotesStoreContext = createContext<FootnotesStoreApi | undefined>(undefined);

export interface FootnotesStoreProviderProps {
  children: ReactNode;
}

export function FootnotesStoreProvider({ children }: FootnotesStoreProviderProps) {
  //@ts-expect-error -- won't build without it being empty.
  const footnotesStoreRef = useRef<FootnotesStoreApi>();

  if (!footnotesStoreRef.current) {
    footnotesStoreRef.current = createFootnotesStore();
  }
  return <FootnotesStoreContext.Provider value={footnotesStoreRef.current}>{children}</FootnotesStoreContext.Provider>;
}

export const useFootnotesStore = <T,>(selector: (store: FootnotesStore) => T): T => {
  const footnotesStoreContext = useContext(FootnotesStoreContext);
  if (!footnotesStoreContext) {
    throw new Error(`useFootnotesStore must be used within FootnotesStoreProvider`);
  }
  return useStore(footnotesStoreContext, selector);
};
