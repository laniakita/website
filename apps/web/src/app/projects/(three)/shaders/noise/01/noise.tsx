'use client';
/* eslint-disable  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, react/no-unknown-property, import/named -- bad types */

import { useMemo, useRef } from 'react';
// @ts-expect-error -- bad types
import { useFrame, useThree } from '@react-three/fiber';
import type { Mesh, ShaderMaterial } from 'three';
import Common2DCanvas from '@/components/canvas/dom/common-2d-canvas';
// @ts-expect-error -- using glsl loader for this
import vertex from './shader.vert';
// @ts-expect-error -- using glsl loader for this
import fragment from './shader.frag';

interface NoiseShaderMaterialProps extends ShaderMaterial {
  uniforms: {
    u_time: {
      value: number;
    };
  };
}

//const NoiseShaderMaterial = shaderMaterial({ u_time: 0 }, `${vertex}`, `${fragment}`);
//extend({ NoiseShaderMaterial });

export default function NoiseShader01() {
  return (
    <Common2DCanvas>
      <Setup />
    </Common2DCanvas>
  );
}

function Setup() {
  const meshRef = useRef<Mesh>(null);
  const { viewport } = useThree();
  const PLANE_HEIGHT = 1;
  const PLANE_WIDTH = 1;
  const PLANE_ASPECT = PLANE_WIDTH / PLANE_HEIGHT;
  const VIEW_ASPECT = viewport.width / viewport.height;

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
    }),
    [],
  );
  //@ts-expect-error -- bad types
  useFrame((state) => {
    const { clock } = state;
    (meshRef.current?.material as NoiseShaderMaterialProps).uniforms.u_time.value = 0.4 * clock.getElapsedTime();

    if (PLANE_ASPECT > VIEW_ASPECT) {
      meshRef.current?.scale.setX(PLANE_ASPECT / VIEW_ASPECT);
      meshRef.current?.scale.setY(1);
    } else {
      meshRef.current?.scale.setX(1);
      meshRef.current?.scale.setY(VIEW_ASPECT / PLANE_ASPECT);
    }
  });

  return (
    <>
      {/* @ts-expect-error -- bad types */}
      <mesh ref={meshRef}>
        {/* @ts-expect-error -- bad types */}
        <planeGeometry args={[PLANE_HEIGHT, PLANE_WIDTH]} />
        {/* @ts-expect-error -- bad types */}
        <shaderMaterial fragmentShader={fragment} vertexShader={vertex} uniforms={uniforms} />
        {/* @ts-expect-error -- bad types */}
      </mesh>
    </>
  );
}
