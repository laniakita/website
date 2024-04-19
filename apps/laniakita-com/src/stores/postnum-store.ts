'use client';
import { createStore } from 'zustand';

export interface PostNumState {
  postNum: number;
}

export const defaultInitState: PostNumState = {
  postNum: 3,
};

export interface PostNumActions {
  loadMore: () => void;
}

export type PostNumStore = PostNumState & PostNumActions;

export const createPostNumStore = (initState: PostNumState = defaultInitState) => {
  return createStore<PostNumStore>()((set) => ({
    ...initState,
    loadMore: () => {
      set((state) => ({ postNum: state.postNum + 15 }));
    },
  }));
};
