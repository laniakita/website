/* eslint-disable no-multi-assign -- it's easier this way  */
import { A11y, useUserPreferences } from '@react-three/a11y';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import { MathUtils, Color } from 'three';
import { Shork, ShorkInstances } from '@/components/canvas/models/shork/shork';

export default function Hajs({
  speed = 1,
  count = 80,
  depth = 80,
}: {
  speed?: number;
  count?: number;
  depth?: number;
}) {
  const easing = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2));
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <HajSetup key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} />
      ))}
    </>
  );
}

function HajSetup({ z, speed, index }: { z: number; speed: number; index: number }) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport, camera } = useThree((state) => state);
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z]);
  const hajColor = new Color();
  // eslint-disable-next-line -- don't need setData
  const [data] = useState({
    y: MathUtils.randFloatSpread(height * 2),
    x: MathUtils.randFloatSpread(2),
    spin: MathUtils.randFloat(8, 12),
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });
  const { a11yPrefersState } = useUserPreferences();

  useFrame((state, delta) => {
    // stops if not current tab
    if (delta < 0.1) {
      // shork go up
      ref.current?.position.set(
        index === 0 ? 0 : data.x * width,
        (data.y += a11yPrefersState.prefersReducedMotion ? 0 : delta * speed),
        -z,
      );
    }

    // rotate shork
    if (!a11yPrefersState.prefersReducedMotion) {
      ref.current?.rotation.set(
        (data.rX += delta / data.spin),
        Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI,
        (data.rZ += delta / data.spin),
      );
    }

    // reset shork to bottom of viewport
    if (data.y > height * (index === 0 ? 4 : 1)) {
      data.y = -(height * (index === 0 ? 4 : 1));
    }
    // reset shork to left of viewport
    if (data.x > width * (index === 0 ? 4 : 1)) {
      data.x = -(width * (index === 0 ? 4 : 1));
    }

    if (ref.current && !a11yPrefersState.prefersReducedMotion) {
      ref.current.scale.x =
        ref.current.scale.y =
        ref.current.scale.z =
          MathUtils.lerp(ref.current.scale.z, hovered ? 500 : 400, 0.1);
    } else if (ref.current) {
      ref.current.scale.x =
        ref.current.scale.y =
        ref.current.scale.z =
         hovered ? 500 : 400;
    }
    (
      ref.current?.children[0]?.children[0]?.children[0]?.children[0]?.children[0] as unknown as MeshStandardMaterial
    ).color.lerp(hajColor.set(hovered ? '#ea76cb' : 'white'), hovered ? 1 : 0.1);
  });

  return (
    <>
      {/* eslint-disable-next-line -- react-three a11y only gives a few roles */}
      <A11y role='image' description='Astronaut Blahaj in Deep Space'>
        <group
          ref={ref}
          onPointerOver={() => {
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        >
          <ShorkInstances>
            <Shork />
          </ShorkInstances>
        </group>
      </A11y>
    </>
  );
}
