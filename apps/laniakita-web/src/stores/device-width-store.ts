'use client';
import { createStore } from 'zustand';

export interface DeviceWidthState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const defaultInitState: DeviceWidthState = {
  isMobile: true,
  isTablet: false,
  isDesktop: false,
};

export interface DeviceWidthActions {
  setMobile: () => void;
  setNotMobile: () => void;
  setTablet: () => void;
  setNotTablet: () => void;
  setDesktop: () => void;
  setNotDesktop: () => void;
}

export type DeviceWidthStore = DeviceWidthState & DeviceWidthActions;

export const createDeviceWidthStore = (initState: DeviceWidthState = defaultInitState) => {
  return createStore<DeviceWidthStore>()((set) => ({
    ...initState,
    setMobile: () => {
      set((state) => ({ isMobile: (state.isMobile = true) }));
    },
    setNotMobile: () => {
      set((state) => ({ isMobile: (state.isMobile = false) }));
    },
    setTablet: () => {
      set((state) => ({ isTablet: (state.isTablet = true) }));
    },
    setNotTablet: () => {
      set((state) => ({ isTablet: (state.isTablet = false) }));
    },
    setDesktop: () => {
      set((state) => ({ isDesktop: (state.isDesktop = true) }));
    },
    setNotDesktop: () => {
      set((state) => ({ isDesktop: (state.isDesktop = false) }));
    },
  }));
};
