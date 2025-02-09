'use client';

import { RefObject, useEffect, useMemo, useState } from 'react';

export function useIntersectionObserver(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new IntersectionObserver(([entry]) => setIntersecting(entry?.isIntersecting ?? false), {
        rootMargin: '-72px 0px -10% 0px',
      });
    }
  }, []);

  useEffect(() => {
    observer?.observe(ref.current);
    return () => {
      observer?.disconnect();
    };
  }, [observer, ref]);

  return isIntersecting;
}
