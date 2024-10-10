'use client';
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type PostNumStore, createPostNumStore } from '@/stores/postnum-store';

export const PostNumStoreContext = createContext<StoreApi<PostNumStore> | null>(null);

export interface PostNumStoreProviderProps {
  children: ReactNode;
}

export function PostNumStoreProvider({ children }: PostNumStoreProviderProps) {
  const storeRef = useRef<StoreApi<PostNumStore>>();
  if (!storeRef.current) {
    storeRef.current = createPostNumStore();
  }
  return <PostNumStoreContext.Provider value={storeRef.current}>{children}</PostNumStoreContext.Provider>;
}

export const usePostNumStore = <T,>(selector: (store: PostNumStore) => T): T => {
  const postNumStoreContext = useContext(PostNumStoreContext);
  if (!postNumStoreContext) {
    throw new Error(`usePostNumStore must be used within PostNumStoreProvider`);
  }
  return useStore(postNumStoreContext, selector);
};
