"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createThemeStore, type ThemeStore } from "../stores/theme-store";

export type ThemeStoreApi = ReturnType<typeof createThemeStore>;

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
	undefined,
);

export interface ThemeStoreProviderProps {
	children: ReactNode;
}

export function ThemeStoreProvider({ children }: ThemeStoreProviderProps) {
	const storeRef = useRef<ThemeStoreApi>(null!);

	if (!storeRef.current) {
		storeRef.current = createThemeStore();
	}
	return (
		<ThemeStoreContext.Provider value={storeRef.current}>
			{children}
		</ThemeStoreContext.Provider>
	);
}

export const useThemeStore = <T,>(selector: (store: ThemeStore) => T): T => {
	const context = useContext(ThemeStoreContext);
	if (!context) {
		throw new Error(`useThemeStore must be used within ThemeStoreProvider`);
	}
	return useStore(context, selector);
};
