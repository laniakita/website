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

const Neils = dynamic(() => import('@/app/projects/bot-clicker/neil2'), { ssr: false });

const CounterOverlayMin = dynamic(() => import('@/app/projects/bot-clicker/counter-overlay-min'), {
  ssr: false,
});

export default function BotClickerScene() {
  const ref = useRef(null!);
  const [windowWidth, setWindowWidth] = useState(0);
  const [viewMobile, setViewMobile] = useState(false);

  useEffect(() => {
    if (windowWidth !== window.innerWidth) {
      setWindowWidth(window.innerWidth);
    }
    if (windowWidth < 768) {
      setViewMobile(true);
    } else if (windowWidth >= 768) {
      setViewMobile(false);
    }
  }, [windowWidth]);

  return (
    <div ref={ref} className='relative size-full'>
      <CounterOverlayMin model='Bot' />
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
            position: 'absolute',
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
