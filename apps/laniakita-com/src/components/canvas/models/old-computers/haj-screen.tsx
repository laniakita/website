/* eslint-disable react/no-unknown-property -- jsx-eslint compatibility issues with r3f */
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { type Mesh } from 'three';
import { useUserPreferences } from '@react-three/a11y';
import { WireShork2 } from '@/components/canvas/models/shork/shork';
import { ScreenInteractive } from './screen-interactive';

export default function ShorkScreen() {
  const { a11yPrefersState } = useUserPreferences();

  const ref = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    if (!a11yPrefersState.prefersReducedMotion) {
      ref.current.rotation.y += 0.5 * delta;
    }
  });
  return (
    <ScreenInteractive
      modelLink='/assets/models/old_computers-transformed.glb'
      screenName='shork'
      frame='Object_212'
      panel='Object_216'
      position={[1.845, 0.377, -1.777]}
      rotation={[0, -Math.PI / 9, 0]}
    >
      <ambientLight intensity={0.0} />
      <directionalLight position={[0, 0, 1]} intensity={0} />
      <group position={[0, -0.5, 0]}>
        <mesh ref={ref} scale={150}>
          <WireShork2 position={[0, 0, 0]} />
        </mesh>
      </group>
    </ScreenInteractive>
  );
}
