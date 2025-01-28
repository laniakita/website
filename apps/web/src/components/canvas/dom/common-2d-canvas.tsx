'use client';
/* eslint-disable react/no-unknown-property -- bad types */
import type { ReactNode } from 'react';
import { Suspense, useRef } from 'react';
import type { ThreeElement } from '@react-three/fiber';
import { Canvas, extend } from '@react-three/fiber';
import { OrthographicCamera } from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    orthographicCamera: ThreeElement<typeof OrthographicCamera>;
  }
}

extend({ OrthographicCamera });

export default function Common2DCanvas({ children, ...props }: { children: Readonly<ReactNode> }) {
  const ref = useRef(null!);
  return (
    <div ref={ref} className='relative size-full'>
      <Suspense>
        <Canvas
          eventSource={ref}
          orthographic
          camera={{
            left: -0.5,
            right: 0.5,
            top: 0.5,
            bottom: -0.5,
            near: -1000,
            far: 1000,
            position: [0, 0, 1],
          }}
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
          <ambientLight intensity={1.1} />
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
