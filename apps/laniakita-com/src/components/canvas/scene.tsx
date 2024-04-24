'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, BakeShadows } from '@react-three/drei';
import { AgXToneMapping } from 'three';
import { A11yAnnouncer } from '@react-three/a11y';
import r3f from '@/helpers/global';
import { ScrollTicker } from '@/components/lenis-scroller';

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <>
      <Canvas {...props} onCreated={(state) => (state.gl.toneMapping = AgXToneMapping)}>
        <r3f.Out />
        <ScrollTicker />
        <BakeShadows />
        <Preload all />
      </Canvas>

      <A11yAnnouncer />
    </>
  );
}
