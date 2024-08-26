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
import { useHajClickerStore } from '@/providers/hajclicker-store-provider';
import CounterOverlayMin from './counter-overlay-min';

const SceneOverlayV3 = dynamic(() => import('@/components/canvas/scenes/bot-clicker/neil/scene-overlay-alt'), {
  ssr: false,
});

const Neils = dynamic(() => import('@/components/canvas/scenes/bot-clicker/neil/neil2'), { ssr: false });

const SocialCounterOverlay = dynamic(
  () => import('@/components/canvas/scenes/bot-clicker/neil/scene-social-counter-overlay'),
  { ssr: false },
);

export default function BotClickerScene({ isEmbed }: { isEmbed?: boolean }) {
  const ref = useRef(null!);
  const [windowWidth, setWindowWidth] = useState(0);
  const [viewMobile, setViewMobile] = useState(false);
  const [viewTablet, setViewTablet] = useState(false);

  useEffect(() => {
    if (windowWidth !== window.innerWidth) {
      setWindowWidth(window.innerWidth);
    }
    if (windowWidth < 768) {
      setViewMobile(true);
      setViewTablet(false);
    } else if (windowWidth >= 768) {
      setViewMobile(false);
      setViewTablet(true);
    }
  }, [windowWidth]);

  return (
    <div
      ref={ref}
      className={` relative flex size-full min-h-[34rem] items-center justify-center  overflow-hidden ${isEmbed ? 'max-h-96 max-w-7xl' : '[height:_100dvh] lg:max-h-screen '}`}
    >
      
      <CounterOverlayMin model='Bot' />
      {/* <SceneOverlayV3 viewMobile={viewMobile} viewTablet={viewTablet} />
      *<SocialCounterOverlay model='Bot' />{' '} */}
      <Suspense>
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
            <BotClickerMain viewMobile={viewMobile} />
          </A11yUserPreferences>
          <Preload all />
        </Canvas>
        <A11yAnnouncer />
      </Suspense>
    </div>
  );
}

function BotClickerMain({ viewMobile }: { viewMobile: boolean }) {
  const starRef = useRef<Points>(null!);
  const { a11yPrefersState } = useUserPreferences();
  const searchParams = useSearchParams();
  const { clickNum } = useHajClickerStore((state) => state);
  const [playing, setPlaying] = useState(false);

  const gameSpeedCalc = () => {
    let gameSpeed = 0.1;
    if (playing) {
      gameSpeed += 7 + Math.log(clickNum >= 1 ? clickNum : 1);
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
      <Neils viewMobile={viewMobile} speed={gameSpeedCalc()} count={viewMobile ? 30 : 60} />
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
      <color attach='background' args={['black']} />
      {!searchParams.get('play') && <hemisphereLight intensity={1.4} />}
    </>
  );
}
