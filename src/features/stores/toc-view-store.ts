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
      set((state) => {
        state.tocInView = true;
        return { tocInView: true };
      });
    },
    setToCNotInView: () => {
      set((state) => {
        state.tocInView = false;
        return { tocInView: false };
      });
    },
  }));
};
