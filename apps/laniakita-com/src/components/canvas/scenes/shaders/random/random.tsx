'use client';
import { useRef } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import type { ShaderMaterial } from 'three';
import Common2DCanvas from '@/components/canvas/dom/common-2d-canvas';
// @ts-expect-error -- using glsl loader for this
import vertex from './shader.vert';
// @ts-expect-error -- using glsl loader for this
import fragment from './shader.frag';

interface RandomShaderMaterialProps extends ShaderMaterial {
  u_time?: number;
}

const RandomShaderMaterial = shaderMaterial({ u_time: 0 }, `${vertex}`, `${fragment}`);
extend({ RandomShaderMaterial });

export default function RandomShader01() {
  return (
    <Common2DCanvas>
      <Setup />
    </Common2DCanvas>
  );
}

function Setup() {
  const shaderRef = useRef<RandomShaderMaterialProps>();
  useFrame((state, delta) => {
    shaderRef.current!.u_time! += delta;
  });
  return (
    <mesh>
      {/* eslint-disable-next-line react/no-unknown-property -- r3f eslint issues */}
      <planeGeometry args={[2, 2]} />
      {/* @ts-expect-error -- r3f uses non-standard jsx syntax */}
      <randomShaderMaterial ref={shaderRef} key={RandomShaderMaterial.key} />
    </mesh>
  );
}
