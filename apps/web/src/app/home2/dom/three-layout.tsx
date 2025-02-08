'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('../canvas/scene').then((mod) => mod.Scene), { ssr: false });

export function ViewCanvasLayout({ children }: { children: ReactNode }) {
  const [root, setRoot] = useState<HTMLElement>();

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      setRoot(root);
    }
  }, []);

  return (
    <div
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
        eventSource={root}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          boxSizing: 'border-box',
          zIndex: -1,
        }}
      />
    </div>
  );
}
