'use client';

import { type ReactNode, useRef } from 'react';
import dynamic from 'next/dynamic';
import { type CanvasProps } from '@react-three/fiber';

const Scene = dynamic(() => import('@/components/canvas/scene'), { ssr: false });

interface ThreeLayoutProps {
  children: ReactNode;
}

function ThreeLayout({ children, ...props }: ThreeLayoutProps & CanvasProps) {
  const ref = useRef<HTMLDivElement>(null!);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {children}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref}
        eventPrefix='client'
        {...props}
      />
    </div>
  );
}

export default ThreeLayout;
