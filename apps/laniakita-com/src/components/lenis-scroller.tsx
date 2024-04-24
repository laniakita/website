'use client';
import { useFrame } from '@react-three/fiber';
import { damp } from 'three/src/math/MathUtils.js';
import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReactLenis, useLenis } from '@/lib/lenis';

const state = {
  top: 0,
  progress: 0,
};


export function Scroller({ children }: { children: ReactNode }) {

  useLenis(({ scroll, progress }: { scroll: number; progress: number }) => {
    state.top = scroll;
    state.progress = progress;
  });
  

  return (
    <ReactLenis options={{ orientation: 'vertical', gestureOrientation: 'both', syncTouch: true, touchInertiaMultiplier: 15, lerp: 0.2, syncTouchLerp: 0.09 }} root>
      {children}
    </ReactLenis>
  );
}

export function ScrollTicker({ smooth = 9999999 }) {
  const searchParams = useSearchParams();
  useFrame(({ viewport, camera }, delta) => {
    if (!searchParams.get('screen') || searchParams.get('screen') === 'home') {
      camera.position.y = damp(camera.position.y, -state.progress * viewport.height * 0.3, smooth, delta);
    }
  });

  return null;
}
