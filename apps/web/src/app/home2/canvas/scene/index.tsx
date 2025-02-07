'use client';

import { ScrollTicker } from '@/wrappers/scroll';
import { Preload, View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

export function Scene({ ...props }) {
  return (
    <Canvas {...props}>
      <View.Port />
      <Preload all />
    </Canvas>
  );
}
