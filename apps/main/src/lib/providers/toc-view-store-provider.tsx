"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createToCViewStore, type ToCViewStore } from "../stores/toc-view-store";

export type ToCViewStoreApi = ReturnType<typeof createToCViewStore>;

export const ToCViewStoreContext = createContext<ToCViewStoreApi | undefined>(undefined);

export interface ToCViewStoreProviderProps {
	children: ReactNode;
}

export function ToCViewStoreProvider({ children }: ToCViewStoreProviderProps) {
	const tocViewStoreRef = useRef<ToCViewStoreApi | null>(null);

	if (!tocViewStoreRef.current) {
		tocViewStoreRef.current = createToCViewStore();
	}
	return <ToCViewStoreContext.Provider value={tocViewStoreRef.current}>{children}</ToCViewStoreContext.Provider>;
}

export const useToCViewStore = <T,>(selector: (store: ToCViewStore) => T): T => {
	const tocViewStoreContext = useContext(ToCViewStoreContext);
	if (!tocViewStoreContext) {
		throw new Error(`useToCViewStore must be used within ToCViewStoreProvider`);
	}
	return useStore(tocViewStoreContext, selector);
};
