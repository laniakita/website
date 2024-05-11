'use client';
import { A11yAnnouncer } from '@react-three/a11y';
import { Preload } from '@react-three/drei';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { type ReactNode, Suspense, useRef } from 'react';

export default function CommonEmbedCanvas({ children, ...props }: { children: Readonly<ReactNode> } & CanvasProps) {
  const ref = useRef(null!);
  return (
    <div ref={ref} className='relative size-full'>
      <Suspense>
        <Canvas
          eventSource={ref}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 20, near: 0.01 }}
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
          {...props}
        >
          {children}
          <Preload all />
        </Canvas>
        <A11yAnnouncer />
      </Suspense>
    </div>
  );
}
