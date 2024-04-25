'use client';
/* eslint-disable react/no-unknown-property -- r3f */
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, PerspectiveCamera, Stars } from '@react-three/drei';
import HajInfinite from '@/components/canvas/scenes/haj2';
import SceneOverlayV3 from '@/components/scene-overlay-alt';

export default function Page() {
  const ref = useRef(null!);
  return (
    <main ref={ref} className='relative size-full h-[calc(100vh-4rem)]'>
      <SceneOverlayV3 />
      <View index={1} style={{ position: 'absolute', height: '100%', width: '100%' }}>
        <Suspense>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Stars />
          <HajInfinite />
          <spotLight position={[0, 40, 0]} intensity={10000} />
          <hemisphereLight intensity={1.5} />
        </Suspense>
      </View>
      <Canvas
        eventSource={ref}
        style={{
          height: '100%',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <View.Port />
      </Canvas>
    </main>
  );
}

