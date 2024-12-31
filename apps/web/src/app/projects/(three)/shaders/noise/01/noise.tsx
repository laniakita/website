'use client';
/* eslint-disable  react/no-unknown-property -- bad types */
import { useMemo, useRef } from 'react';
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
    <mesh ref={meshRef}>
      <planeGeometry args={[PLANE_HEIGHT, PLANE_WIDTH]} />
      <shaderMaterial fragmentShader={fragment} vertexShader={vertex} uniforms={uniforms} />
    </mesh>
  );
}
