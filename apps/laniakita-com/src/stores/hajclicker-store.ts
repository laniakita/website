'use client';
import { createStore } from 'zustand';

export interface HajClickerState {
  postNum: number;
}

export const defaultInitState: HajClickerState = {
  postNum: 0,
};

export interface HajClickerActions {
  addClickToCount: () => void;
}

export type HajClickerStore = HajClickerState & HajClickerActions;

export const createHajClickerStore = (initState: HajClickerState = defaultInitState) => {
  return createStore<HajClickerStore>()((set) => ({
    ...initState,
    addClickToCount: () => {
      set((state) => ({ postNum: state.postNum + 1 }));
    },
  }));
};
