'use client';
/* eslint-disable react/no-unknown-property -- r3f */
import { Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame } from '@react-three/fiber';
import { DepthOfField, EffectComposer } from '@react-three/postprocessing';
import { Stars } from '@react-three/drei';
import { A11yAnnouncer, A11yUserPreferences, useUserPreferences } from '@react-three/a11y';
import type { Points } from 'three';
import LoadingSpinner from '@/components/loading-spinner';
import { useDeviceWidthStore } from '@/providers/device-width-store-provider';
import { useHajClickerStore } from '@/providers/hajclicker-store-provider';

const SceneOverlayV3 = dynamic(() => import('@/components/scene-overlay-alt'), { ssr: false });

const Zuns = dynamic(() => import('@/components/canvas/scenes/bot-clicker/zun2'), { ssr: false });

const SocialCounterOverlay = dynamic(() => import('@/components/scene-social-counter-overlay'), { ssr: false });


export default function BotClickerScene() {
  const ref = useRef(null!);
  const windowRef = useRef<number>();
  const { setMobile, setNotMobile, setTablet, setNotTablet } = useDeviceWidthStore((state) => state);
  useEffect(() => {
    const updateRef = () => {
      windowRef.current = window.innerWidth;
      if (windowRef.current < 768) {
        setMobile();
        setNotTablet();
      } else if (windowRef.current >= 768) {
        setTablet();
        setNotMobile();
      }
    };
    updateRef();
    window.addEventListener('resize', updateRef);
    return () => {
      window.removeEventListener('resize', updateRef);
    };
  }, [setMobile, setNotMobile, setTablet, setNotTablet]);

  return (
    <main ref={ref} className='relative overflow-hidden  [height:_100dvh] lg:max-h-screen'>
      <SceneOverlayV3 />
      <SocialCounterOverlay model='Bot' />
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
            <BotClickerMain />
          </A11yUserPreferences>
        </Canvas>
        <A11yAnnouncer />
      </Suspense>
    </main>
  );
}

function BotClickerMain() {
  const starRef = useRef<Points>(null!);
  const { a11yPrefersState } = useUserPreferences();
  const { isMobile } = useDeviceWidthStore((state) => state);
  const { clickNum } = useHajClickerStore((state) => state)
  useFrame((state, delta) => {
    if (delta < 0.1 && !a11yPrefersState.prefersReducedMotion) {
      starRef.current.rotation.x += delta * 0.04;
      starRef.current.rotation.y += delta * 0.03;
    }
  });
  return (
    <>
      <Zuns speed={8} count={isMobile ? 1 : 80} />
      <Stars ref={starRef} />
      <spotLight position={[0, 40, 0]} intensity={10000} />
      <hemisphereLight intensity={1.5} />
      {!isMobile && clickNum < 1 && <EffectComposer enableNormalPass={false} multisampling={0}>
        <DepthOfField worldFocusDistance={30} bokehScale={5} height={680} />
      </EffectComposer>}
    </>
  );
}
