'use client';
/* eslint-disable react/no-unknown-property -- r3f */
import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { DepthOfField, EffectComposer } from '@react-three/postprocessing';
import { Stars } from '@react-three/drei';
import { A11yAnnouncer, A11yUserPreferences } from '@react-three/a11y';
import LoadingSpinner from '@/components/loading-spinner';

const SceneOverlayV3 = dynamic(()=>import('@/components/scene-overlay-alt'), {ssr: false})

const Hajs = dynamic(()=>import( '@/components/canvas/scenes/haj2'), {ssr: false})

const  HajClickerStoreProvider = dynamic(() => import('@/providers/hajclicker-store-provider').then(mod => mod.HajClickerStoreProvider), {ssr: false});

const SocialCounterOverlay = dynamic(() => import('@/components/scene-social-counter-overlay'), {ssr: false})

export default function Page() {
  const ref = useRef(null!);
  return (
    <main ref={ref} className='relative overflow-hidden  [height:_100dvh] lg:max-h-screen'>
      <HajClickerStoreProvider>
        <SceneOverlayV3 />
        <SocialCounterOverlay />
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas
            eventSource={ref}
            flat
            gl={{ antialias: false }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 20], fov: 40 }}
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
            <A11yUserPreferences>
              <Hajs />
            </A11yUserPreferences>
            <Stars />
            <spotLight position={[0, 40, 0]} intensity={10000} />
            <hemisphereLight intensity={1.5} />
            <EffectComposer>
              <DepthOfField focusDistance={0.4} focalLength={0.6} bokehScale={4} height={680} />
            </EffectComposer>
          </Canvas>
          <A11yAnnouncer />
        </Suspense>
      </HajClickerStoreProvider>
    </main>
  );
}
