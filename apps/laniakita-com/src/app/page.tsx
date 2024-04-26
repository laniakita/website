'use client';
/* eslint-disable react/no-unknown-property -- r3f */
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, PerspectiveCamera, Stars, Preload } from '@react-three/drei';
import SceneOverlayV3 from '@/components/scene-overlay-alt';
import Hajs from '@/components/canvas/scenes/haj2';

export default function Page() {
  const ref = useRef(null!);
  return (
    <main ref={ref} className='relative max-h-[calc(100dvh-4rem)] overflow-hidden  [height:_100dvh] lg:max-h-screen'>
      <SceneOverlayV3 />
      <View index={1} className='absolute size-full'>
        <Suspense>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={45} />
          <Stars />
          <Hajs />
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
        <Preload all />
      </Canvas>
    </main>
  );
}
