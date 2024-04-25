'use client'
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Mesh } from 'three';
import { MathUtils } from 'three';
import { ShorkMesh } from '@/components/canvas/models/shork/shork-rapier';

export default function HajInfinite({ speed = 1, count = 80, depth = 80 }: { speed?: number; count?: number; depth?: number }) {
  const easing = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2));
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <HajCubed key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} />
      ))}
    </>
  );
}

function HajCubed({ z, speed, index }: { z: number; speed: number; index: number }) {
  const ref2 = useRef<Mesh>(null);
  const { viewport, camera } = useThree((state) => state);
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z]);
  // eslint-disable-next-line -- don't need setData
  const [data] = useState({
    y: MathUtils.randFloatSpread(height * 2),
    x: MathUtils.randFloatSpread(2),
    spin: MathUtils.randFloat(8, 12),
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state, delta) => {
    // stops if not current tab
    if (delta < 0.1) {
      ref2.current?.position.set(index === 0 ? 0 : data.x * width, (data.y += delta * speed), -z);
    }
    // rotate shork
    ref2.current?.rotation.set(
      (data.rX += delta / data.spin),
      Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI,
      (data.rZ += delta / data.spin),
    );
    // reset shork to bottom of viewport
    if (data.y > height * (index === 0 ? 4 : 1)) {
      data.y = -(height * (index === 0 ? 4 : 1));
    }
  });

  return (
    <mesh ref={ref2} scale={4}>
      <ShorkMesh />
    </mesh>
  );
}


//import { Physics, RigidBody } from '@react-three/rapier';
//import { Shork, ShorkInstances } from '@/components/canvas/models/shork/shork';
/*
        <OrbitControls />
 *        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <mesh scale={1}>
          <boxGeometry />
          <meshBasicMaterial color='white' />
        </mesh>
 *
 * */
