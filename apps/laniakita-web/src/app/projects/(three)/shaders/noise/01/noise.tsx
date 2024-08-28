'use client';
import { Suspense, useEffect, useRef } from 'react';
import { Preload, shaderMaterial } from '@react-three/drei';
import { Canvas, extend, MeshProps, PlaneGeometryProps, useFrame, useThree } from '@react-three/fiber';
import type { Mesh, Object3D, PlaneGeometry, ShaderMaterial } from 'three';
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
  const meshRef = useRef<Mesh>(null);
  const { viewport } = useThree();
  const PLANE_HEIGHT = 1;
  const PLANE_WIDTH = 1;
  const PLANE_ASPECT = PLANE_WIDTH / PLANE_HEIGHT;
  const VIEW_ASPECT = viewport.width / viewport.height;

  useFrame((state, delta) => {
    shaderRef.current!.u_time! += delta;
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
      {/* eslint-disable-next-line react/no-unknown-property -- r3f eslint issues */}
      <planeGeometry args={[PLANE_HEIGHT, PLANE_WIDTH]} />
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
