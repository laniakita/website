'use client';
import { useFrame } from '@react-three/fiber';
import { damp } from 'three/src/math/MathUtils.js';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ReactLenis, useLenis } from '@/lib/lenis';

const state = {
  top: 0,
  progress: 0,
};

export function Scroller({ children }: { children: ReactNode }) {
  const lenis = useLenis(({ scroll, progress }: { scroll: number; progress: number }) => {
    state.top = scroll;
    state.progress = progress;
  });

  return <ReactLenis root>{children}</ReactLenis>;
}

export function ScrollTicker({ smooth = 9999999 }) {
  useFrame(({ viewport, camera }, delta) => {
    camera.position.y = damp(camera.position.y, -state.progress * viewport.height, smooth, delta);
  });

  return null;
}
