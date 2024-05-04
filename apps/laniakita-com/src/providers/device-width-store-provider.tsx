'use client';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type DeviceWidthStore, createDeviceWidthStore } from '@/stores/device-width-store';

export const DeviceWidthStoreContext = createContext<StoreApi<DeviceWidthStore> | null>(null);

export interface DeviceWidthStoreProviderProps {
  children: ReactNode;
}

export function DeviceWidthStoreProvider({ children }: DeviceWidthStoreProviderProps) {
  const storeRef = useRef<StoreApi<DeviceWidthStore>>();
  if (!storeRef.current) {
    storeRef.current = createDeviceWidthStore();
  }
  return <DeviceWidthStoreContext.Provider value={storeRef.current}>{children}</DeviceWidthStoreContext.Provider>;
}

export const useDeviceWidthStore = <T,>(selector: (store: DeviceWidthStore) => T): T => {
  const postNumStoreContext = useContext(DeviceWidthStoreContext);
  if (!postNumStoreContext) {
    throw new Error(`useDeviceWidthStore must be used within DeviceWidthStoreProvider`);
  }
  return useStore(postNumStoreContext, selector);
};
