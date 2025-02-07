'use client';

import { addEffect, useFrame } from '@react-three/fiber';
import Lenis from 'lenis';
import { ReactNode, useEffect, useRef } from 'react';
import { MathUtils } from 'three';

const state = {
  top: 0,
  progress: 0,
};

const { damp } = MathUtils;

export default function Scroll({ children }: { children: ReactNode }) {
  const wrapper = useRef(null!);
  const content = useRef(null!);

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      //easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      syncTouch: true,
      //touchInertiaMultiplier: 30,
      //touchMultiplier: 1,
    });

    lenis.on('scroll', ({ scroll, progress }) => {
      state.top = scroll;
      state.progress = progress;
    });
    const effectSub = addEffect((t) => lenis.raf(t));

    return () => {
      effectSub();
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapper}
      style={{
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        top: 0,
      }}
    >
      <div
        ref={content}
        style={{
          position: 'relative',
          minHeight: '200dvh',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const ScrollTicker = ({ smooth = 9999999 }: { smooth?: number }) => {
  useFrame(({ viewport, camera }, delta) => {
    camera.position.y = damp(camera.position.y, -state.progress * viewport.height, smooth, delta);
  });

  return null;
};
