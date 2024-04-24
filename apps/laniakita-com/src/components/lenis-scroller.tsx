'use client';
import { addEffect, useFrame } from '@react-three/fiber';
import { damp } from 'three/src/math/MathUtils.js';
import { useEffect, useRef, type ReactNode } from 'react';
import { ReactLenis, useLenis, Lenis } from '@/lib/lenis';
import { useSearchParams } from 'next/navigation';

const state = {
  top: 0,
  progress: 0,
};


export function Scroller({ children }: { children: ReactNode }) {
  //const lenisRef = useRef(null!);

  useLenis(({ scroll, progress }: { scroll: number; progress: number }) => {
    state.top = scroll;
    state.progress = progress;
  });
  
  /*
  useEffect(() => {
    const effectSub = addEffect((time) => {
      (lenisRef.current as unknown as LenisProps).lenis.raf(time);
    });
    return () => {
      effectSub();
    };
  }, []);*/

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
