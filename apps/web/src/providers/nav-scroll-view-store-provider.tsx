'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type NavScrollViewStore, createNavScrollViewStore } from '@/stores/nav-scroll-view-store';

export type NavScrollViewStoreApi = ReturnType<typeof createNavScrollViewStore>;

export const NavScrollViewStoreContext = createContext<NavScrollViewStoreApi | undefined>(undefined);

export interface NavScrollViewStoreProviderProps {
  children: ReactNode;
}

export function NavScrollViewStoreProvider({ children }: NavScrollViewStoreProviderProps) {
  const navScrollViewStoreRef = useRef<NavScrollViewStoreApi>(null!);

  if (!navScrollViewStoreRef.current) {
    navScrollViewStoreRef.current = createNavScrollViewStore();
  }
  return (
    <NavScrollViewStoreContext.Provider value={navScrollViewStoreRef.current}>
      {children}
    </NavScrollViewStoreContext.Provider>
  );
}

export const useNavScrollViewStore = <T,>(selector: (store: NavScrollViewStore) => T): T => {
  const navScrollViewStoreContext = useContext(NavScrollViewStoreContext);
  if (!navScrollViewStoreContext) {
    throw new Error(`useNavScrollViewStore must be used within NavScrollViewStoreProvider`);
  }
  return useStore(navScrollViewStoreContext, selector);
};
