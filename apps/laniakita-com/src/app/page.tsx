'use client';
/* eslint-disable react/no-unknown-property -- r3f */
import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame } from '@react-three/fiber';
import { DepthOfField, EffectComposer } from '@react-three/postprocessing';
import { Stars } from '@react-three/drei';
import { A11yAnnouncer, A11yUserPreferences, useUserPreferences } from '@react-three/a11y';
import type { Points } from 'three';
import LoadingSpinner from '@/components/loading-spinner';

const SceneOverlayV3 = dynamic(() => import('@/components/scene-overlay-alt'), { ssr: false });

const Hajs = dynamic(() => import('@/components/canvas/scenes/haj2'), { ssr: false });

const HajClickerStoreProvider = dynamic(
  () => import('@/providers/hajclicker-store-provider').then((mod) => mod.HajClickerStoreProvider),
  { ssr: false },
);

const SocialCounterOverlay = dynamic(() => import('@/components/scene-social-counter-overlay'), { ssr: false });

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
              <HajClickerMain />
            </A11yUserPreferences>
          </Canvas>
          <A11yAnnouncer />
        </Suspense>
      </HajClickerStoreProvider>
    </main>
  );
}

function HajClickerMain() {
  const starRef = useRef<Points>(null!);
  const { a11yPrefersState } = useUserPreferences();
  useFrame((state, delta) => {
    if (delta < 0.1 && !a11yPrefersState.prefersReducedMotion) {
      starRef.current.rotation.x += delta * 0.04;
      starRef.current.rotation.y += delta * 0.03;
    }
  });
  return (
    <>
      <Hajs />
      <Stars ref={starRef} />
      <spotLight position={[0, 40, 0]} intensity={10000} />
      <hemisphereLight intensity={1.5} />
      <EffectComposer>
        <DepthOfField worldFocusDistance={30} bokehScale={5} height={680} />
      </EffectComposer>
    </>
  );
}
