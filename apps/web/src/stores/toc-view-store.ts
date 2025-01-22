import { createStore } from 'zustand/vanilla';

export interface ToCViewState {
  tocInView: boolean;
}

export interface ToCViewActions {
  setToCInView: () => void;
  setToCNotInView: () => void;
}

export type ToCViewStore = ToCViewState & ToCViewActions;

export const defaultInitState: ToCViewState = {
  tocInView: true,
};

export const createToCViewStore = (initState: ToCViewState = defaultInitState) => {
  return createStore<ToCViewStore>()((set) => ({
    ...initState,
    setToCInView: () => {
      set((state) => ({ tocInView: (state.tocInView = true) }));
    },
    setToCNotInView: () => {
      set((state) => ({ tocInView: (state.tocInView = false) }));
    },
  }));
};
