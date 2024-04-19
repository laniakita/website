'use client';
import { createStore } from 'zustand';

export interface RtxState {
  rtx: boolean;
}

export const defaultInitState: RtxState = {
  rtx: false,
};

export interface RtxActions {
  rtxOn: () => void;
  rtxOff: () => void;
}

export type RtxStore = RtxState & RtxActions;

export const createRtxStore = (initState: RtxState = defaultInitState) => {
  return createStore<RtxStore>()((set) => ({
    ...initState,
    rtxOn: () => {
      set((state) => ({ rtx: (state.rtx = true) }));
    },
    rtxOff: () => {
      set((state) => ({ rtx: (state.rtx = false) }));
    },
  }));
};
