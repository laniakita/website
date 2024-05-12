'use client';
import { useRef } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame, useThree } from '@react-three/fiber';
import type { ShaderMaterial } from 'three';
import Common2DCanvas from '@/components/canvas/dom/common-2d-canvas';
// @ts-expect-error -- using glsl loader for this
import vertex from './shader.vert';
// @ts-expect-error -- using glsl loader for this
import fragment from './shader.frag';

interface NoiseShaderMaterialProps extends ShaderMaterial {
  u_time?: number;
}

const NoiseShaderMaterial = shaderMaterial({ u_time: 0 }, `${vertex}`, `${fragment}`);
extend({ NoiseShaderMaterial });

export default function NoiseShader01() {
  return (
    <Common2DCanvas>
      <Setup />
    </Common2DCanvas>
  );
}
function Setup() {
  const shaderRef = useRef<NoiseShaderMaterialProps>();
  useFrame((state, delta) => {
    shaderRef.current!.u_time! += delta;
  });

  return (
    <mesh>
      {/* eslint-disable-next-line react/no-unknown-property -- r3f eslint issues */}
      <planeGeometry args={[2, 2]} />
      {/* @ts-expect-error -- r3f uses non-standard jsx syntax */}
      <noiseShaderMaterial ref={shaderRef} key={NoiseShaderMaterial.key} />
    </mesh>
  );
}

/* 
  wip auto scaling: i guess just deal with stetched image for now 

  const frustum = 100;
  const { size } = useThree();
  const aspectRatio = size.width / size.height;

  const scalePlaneFromCanvasSize = (): [height: number, width: number] => {
    const devWidth = size.width;
    const devHeight = size.height;
    const denom = findLowestCommonDenom([devWidth, devHeight])
    const planeWidth = devWidth/denom
    const planeHeight = devHeight/denom
    return [planeWidth, planeHeight]
  }

  let planeGeometryArgs:[width: number, height: number] = [4,3];

  planeGeometryArgs = scalePlaneFromCanvasSize()
  
// convenient functions from Blex via Stack Overflow: https://stackoverflow.com/a/62523435
function createRange(min:number, max: number) {
  return new Array(max - min + 1).fill(null).map((_, i) => min + i);
}

function findLowestCommonDenom(arr: number[]) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = createRange(min, max);
  let current = max;
  while (true) {
    const isWholeDivis = range.every(n => current % n === 0);
    if (isWholeDivis) {
      return current;
    }
    current++;
  }
}


*/
