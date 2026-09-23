"use client";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

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

export const HajClickerStoreContext = createContext<StoreApi<HajClickerStore> | null>(null);

export interface HajClickerStoreProviderProps {
	children: ReactNode;
}

export function HajClickerStoreProvider({ children }: HajClickerStoreProviderProps) {
	const storeRef = useRef<StoreApi<HajClickerStore> | null>(null);
	if (!storeRef.current) {
		storeRef.current = createHajClickerStore();
	}
	return <HajClickerStoreContext.Provider value={storeRef.current}>{children}</HajClickerStoreContext.Provider>;
}

export const useHajClickerStore = <T,>(selector: (store: HajClickerStore) => T): T => {
	const postNumStoreContext = useContext(HajClickerStoreContext);
	if (!postNumStoreContext) {
		throw new Error(`useHajClickerStore must be used within HajClickerStoreProvider`);
	}
	return useStore(postNumStoreContext, selector);
};
