'use client';

import { ReactNode, useRef } from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('../canvas/scene').then((mod) => mod.Scene), { ssr: false });

export function ViewCanvasLayout({ children }: { children: ReactNode }) {
  const container = useRef(null!);

  return (
    <div
      ref={container}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'none',
        boxSizing: 'border-box',
      }}
    >
      {children}
      <Scene
        eventPrefix='client'
        eventSource={container}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          pointerEvents: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
