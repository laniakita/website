'use client';
/* eslint-disable react/no-unknown-property -- jsx-eslint compatibility issues with r3f */
import { useMemo, useRef, useState } from 'react';
import { MathUtils, type Points, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CommonEmbedCanvas from '../../dom/common-embed-canvas';

const updateVerts = (numVar: number) => {
  // faking buffer sizes https://threejs.org/docs/#manual/en/introduction/How-to-update-things
  const rawData = bulbSetup(numVar);
  const bulb = { points: new Float32Array(rawData), needsUpdate: true }
  return bulb;
};

export default function BulbPortMain() {
  const [count, setCount] = useState(8);
  const bulbVertices = useMemo(() => {
    return updateVerts(count);
  }, [count]);

  return (
    <>
      <div className='absolute right-4 top-4 z-[2] lg:right-10 lg:top-10'>
        <button
          onClick={() => {
            count < 20 && setCount(count + 1);
          }}
          type='button'
        >
          +
        </button>
        <p>{count}</p>
        <button
          onClick={() => {
            count > 1 && setCount(count - 1);
          }}
          type='button'
        >
          -
        </button>
      </div>
      <CommonEmbedCanvas camera={{ position: [0, 0, 340], fov: 45 }}>
        <MandelbulbPort bulb={bulbVertices} />
        <OrbitControls />
      </CommonEmbedCanvas>
    </>
  );
}

function bulbSetup(nVar: number) {
  class Spherical {
    r: number;
    theta: number;
    phi: number;
    constructor(r: number, theta: number, phi: number) {
      this.r = r;
      this.theta = theta;
      this.phi = phi;
    }
  }
  const spherical1 = (x: number, y: number, z: number) => {
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.atan2(Math.sqrt(x * x + y * y), z);
    const phi = Math.atan2(y, x);

    return new Spherical(r, theta, phi);
  };
  const DIM = 96;
  const n = nVar;
  const mandelbulb = [];
  let edge = false;

  for (let i = 0; i < DIM; i++) {
    for (let j = 0; j < DIM; j++) {
      for (let k = 0; k < DIM; k++) {
        // mandelbulb stuff
        const x = MathUtils.mapLinear(i, 0, DIM, -1, 1);
        const y = MathUtils.mapLinear(j, 0, DIM, -1, 1);
        const z = MathUtils.mapLinear(k, 0, DIM, -1, 1);

        const zeta = new Vector3(0, 0, 0);

        const maxIterations = 20;
        let iteration = 0;

        while (iteration < maxIterations) {
          const sphericalZ = spherical1(zeta.x, zeta.y, zeta.z);
          const newX = Math.pow(sphericalZ.r, n) * Math.sin(sphericalZ.theta * n) * Math.cos(sphericalZ.phi * n);
          const newY = Math.pow(sphericalZ.r, n) * Math.sin(sphericalZ.theta * n) * Math.sin(sphericalZ.phi * n);
          const newZ = Math.pow(sphericalZ.r, n) * Math.cos(sphericalZ.theta * n);
          iteration++;

          zeta.x = newX + x;
          zeta.y = newY + y;
          zeta.z = newZ + z;
          if (sphericalZ.r > 16) {
            if (edge) {
              edge = false;
            }
            break;
          }
          if (iteration === maxIterations) {
            if (!edge) {
              edge = true;
              mandelbulb.push(x * 100);
              mandelbulb.push(y * 100);
              mandelbulb.push(z * 100);
            }
            break;
          }
        }
      }
    }
  }
  return mandelbulb;
}

function MandelbulbPort({bulb}: {bulb: { points: Float32Array, needsUpdate: boolean } }) {
  const bulbRef = useRef<Points>(null!);

  useFrame((state) => {
    if (bulb.needsUpdate) {
      const pos = bulbRef.current.geometry.getAttribute('position');
      for (const i of bulb.points) {
        // @ts-expect-error -- shouldn't be undefined
        pos.array[i] = bulb.points[i];
      }
      bulbRef.current.geometry.setAttribute('position', pos);
      bulbRef.current.geometry.attributes.position!.needsUpdate = true;
      bulb.needsUpdate = false
    }
  });

  return (
    <points ref={bulbRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={bulb.points.length / 3}
          array={bulb.points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial sizeAttenuation attach='material' depthWrite={false} size={1} color='white' />
    </points>
  );
}
