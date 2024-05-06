'use client';
/* eslint-disable react/no-unknown-property -- r3f */
import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { BakeShadows, Preload, Stars } from '@react-three/drei';
import { A11yAnnouncer, A11yUserPreferences, useUserPreferences } from '@react-three/a11y';
import type { Points } from 'three';
import LoadingSpinner from '@/components/loading-spinner';
import { useDeviceWidthStore } from '@/providers/device-width-store-provider';
import { useHajClickerStore } from '@/providers/hajclicker-store-provider';

const SceneOverlayV3 = dynamic(() => import('@/components/scene-overlay-alt'), { ssr: false });

const Neils = dynamic(() => import('@/components/canvas/scenes/bot-clicker/neil/neil2'), { ssr: false });

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
    <main ref={ref} className='relative overflow-hidden  bg-black [height:_100dvh] lg:max-h-screen'>
      <SceneOverlayV3 />
      <SocialCounterOverlay model='Bot' />
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          eventSource={ref}
          flat
          gl={{ antialias: false }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 20, near: 0.01 }}
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
          <Preload all />
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
  const searchParams = useSearchParams();
  const { clickNum } = useHajClickerStore((state) => state);
  const [playing, setPlaying] = useState(false);

  const gameSpeedCalc = () => {
    let gameSpeed = 0.1;
    if (playing) {
      gameSpeed += (7 + Math.log(clickNum >=1 ? clickNum : 1));
      return gameSpeed;
    }
    return gameSpeed;
  };

  useFrame((state, delta) => {
    if (!playing) {
      return;
    }
    if ((starRef.current as unknown) !== null && delta < 0.1 && !a11yPrefersState.prefersReducedMotion) {
      starRef.current.rotation.x += delta * 0.02;
      starRef.current.rotation.y -= delta * 0.005;
    }
  });

  useEffect(() => {
    if (searchParams.get('play') === 'true') {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [searchParams]);

  return (
    <>
      <Suspense>
      <Neils speed={gameSpeedCalc()} count={isMobile ? 30 : 60} />
      {searchParams.get('play') === 'true' && (
        <>
          <Stars ref={starRef} />
          <spotLight decay={1.05} power={40} position={[0, 0, 10]} />
          <BakeShadows />
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.25} mipmapBlur intensity={14} />
          </EffectComposer>
        </>
      )}
      </Suspense>
      {!searchParams.get('play') && <hemisphereLight intensity={1.4} />}
    </>
  );
}
