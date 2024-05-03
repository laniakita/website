'use client';
import { createStore } from 'zustand';

export interface HajClickerState {
  clickNum: number;
}

export const defaultInitState: HajClickerState = {
  clickNum: 0,
};

export interface HajClickerActions {
  addClickToCount: () => void;
}

export type HajClickerStore = HajClickerState & HajClickerActions;

export const createHajClickerStore = (initState: HajClickerState = defaultInitState) => {
  return createStore<HajClickerStore>()((set) => ({
    ...initState,
    addClickToCount: () => {
      set((state) => ({ clickNum: state.clickNum + 1 }));
    },
  }));
};
