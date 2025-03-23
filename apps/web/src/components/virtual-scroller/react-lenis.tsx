'use client';
import { addEffect } from '@react-three/fiber';
import { type LenisRef, ReactLenis } from 'lenis/react';
import { type ReactNode, Suspense, useEffect, useRef } from 'react';

export function ReactLenisScroller({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null!);

  useEffect(() => {
    const subEffect = addEffect((t) => lenisRef.current?.lenis?.raf(t));
    return () => {
      subEffect();
    };
  }, []);

  return (
    <>
      <ReactLenis
        options={{
          autoRaf: false,
          anchors: true,
          overscroll: false,
        }}
        ref={lenisRef}
        className='wrapper'
        style={{
          height: '100dvh',
          width: '100%',
          overflowY: 'auto',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          boxSizing: 'border-box',
        }}
      >
        <Suspense>{children}</Suspense>
      </ReactLenis>
    </>
  );
}
