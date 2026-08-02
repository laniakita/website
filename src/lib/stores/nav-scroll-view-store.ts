import { createStore } from "zustand/vanilla";

export interface NavScrollViewState {
	inView: boolean;
}

export interface NavScrollViewActions {
	setNavInView: () => void;
	setNavNotInView: () => void;
}

export type NavScrollViewStore = NavScrollViewState & NavScrollViewActions;

export const defaultInitState: NavScrollViewState = {
	inView: true,
};

export const createNavScrollViewStore = (
	initState: NavScrollViewState = defaultInitState,
) => {
	return createStore<NavScrollViewStore>()((set) => ({
		...initState,
		setNavInView: () => {
			set((state) => {
				state.inView = true;
				return { inView: true };
			});
		},
		setNavNotInView: () => {
			set((state) => {
				state.inView = false;
				return { inView: false };
			});
		},
	}));
};
