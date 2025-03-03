'use client';

import { useEffect, useState } from 'react';

/*
 * Grabs the window hash. based on: https://github.com/vercel/next.js/discussions/49465#discussioncomment-12001315
 **/
export function useHash() {
  const [hash, setHash] = useState<string>(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    const { pushState, replaceState } = window.history;

    window.history.pushState = (...args) => {
      pushState.apply(window.history, args);
      setTimeout(() => setHash(window.location.hash));
    };

    window.history.replaceState = (...args) => {
      replaceState.apply(window.history, args);
      setTimeout(() => setHash(window.location.hash));
    };

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return { hash };
}
