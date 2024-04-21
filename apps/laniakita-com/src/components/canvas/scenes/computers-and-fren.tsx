/* eslint-disable react/no-unknown-property -- jsx-eslint hostilities */
/* eslint-disable @typescript-eslint/no-floating-promises -- three.js be built different */

'use client';
import { useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, CameraControls, Stars } from '@react-three/drei';
import { type Mesh, TextureLoader, Vector3, MathUtils } from 'three';
import { geometry } from 'maath';
import { A11yUserPreferences, useUserPreferences } from '@react-three/a11y';
import { CompInstances, CompModel } from '@/components/canvas/models/old-computers/old-computers-test';
import { useDarkStore } from '@/providers/theme-store-provider';
import { ShorkInstances, Shork } from '../models/shork/shork';

extend(geometry);

export function MinComputerShork() {
  const { dark } = useDarkStore((state) => state);
  return (
    <>
      <group position={[-0.2, -2.2, 0]}>
        <CompInstances position={[0, -0.0115, 0]}>
          <CompModel />
        </CompInstances>
        <ShorkInstances>
          <Shork
            scale={40}
            position={[1.8, 1.84, -1.6]}
            rotation={[MathUtils.degToRad(-1), MathUtils.degToRad(20), MathUtils.degToRad(-10)]}
          />
        </ShorkInstances>
        <MyFloor position={[0, -0.48, 0]} />
      </group>

      <A11yUserPreferences>
        <color attach='background' args={[dark ? 'black' : 'black']} />
      </A11yUserPreferences>
    </>
  );
}

function StarRotate() {
  const starRef = useRef(null!);
  const { a11yPrefersState } = useUserPreferences();
  useFrame((state, delta) => {
    if (!a11yPrefersState.prefersReducedMotion) {
      (starRef.current as Mesh).rotation.y += delta * -0.004;
      (starRef.current as Mesh).rotation.x += delta * 0.002;
    } else {
      (starRef.current as Mesh).rotation.y = 0;
      (starRef.current as Mesh).rotation.z = 0;
    }
  });

  return <Stars ref={starRef} />;
}

export function LightsCameraActionShork() {
  return (
    <>
      <Lights />
      <A11yUserPreferences>
        <CameraRig />
      </A11yUserPreferences>
    </>
  );
}

function Lights() {
  return (
    <>
      <spotLight
        position={[0, 14, 3]}
        angle={0.4}
        penumbra={1}
        intensity={200}
        //intensity={dark ? 200 : 500}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[0, 3, 14]}
        angle={0.2}
        penumbra={1}
        intensity={200}
        //intensity={dark ? 200 : 500}
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight
        position={[2, 10, -10]}
        angle={0.4}
        penumbra={1}
        intensity={80}
        //intensity={dark ? 80 : 80}
        castShadow
        shadow-mapSize={1024}
      />
    </>
  );
}

function CameraRig({ position = new Vector3(0, 0, 10), focus = new Vector3(0, 0, 0), searchTarget = 'screen' }) {
  const { a11yPrefersState } = useUserPreferences();
  const scene = useThree((state) => state.scene);
  const cameraControlRef = useRef<CameraControls | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    let active = true;
    const meshName = searchParams.get(searchTarget);

    const setScene = () => {
      if (active && meshName) {
        const targetMesh = scene.getObjectByName(meshName);
        if (targetMesh?.name !== meshName) {
          setTimeout(() => {
            setScene();
          }, 500);
        } else if (targetMesh.name === meshName) {
          targetMesh.parent?.localToWorld(position.set(0, 0.5, 3.5));
          targetMesh.parent?.localToWorld(focus.set(0, 0.5, 0));

          cameraControlRef.current?.setLookAt(...position.toArray(), ...focus.toArray(), true);
        }
      }
    };
    if (a11yPrefersState.prefersReducedMotion) {
      cameraControlRef.current!.smoothTime = 0;
    }
    cameraControlRef.current?.setLookAt(...position.toArray(), ...focus.toArray(), true);
    setScene();

    return () => {
      active = false;
    };
  });
  return (
    <>
      {a11yPrefersState.prefersReducedMotion ? (
        <CameraControls
          ref={cameraControlRef}
          makeDefault
          enabled
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          mouseButtons-left='NONE'
          mouseButtons-wheel='NONE'
          mouseButtons-right='NONE'
          mouseButtons-middle='NONE'
        />
      ) : (
        <CameraControls ref={cameraControlRef} makeDefault enabled minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      )}
    </>
  );
}

function MyFloor({ ...props }) {
  const [roughnessMap] = useLoader(TextureLoader, ['/assets/textures/WaterStains_02.jpg']);
  const { dark } = useDarkStore((state) => state);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 10]} receiveShadow {...props}>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[400, 400]}
        resolution={512}
        mixBlur={10}
        mixStrength={90}
        depthScale={0.9}
        minDepthThreshold={1}
        metalness={dark ? 0.4 : 0}
        mirror={dark ? 0.9 : 0}
        color={dark ? '#11111b' : '#232634'}
        reflectorOffset={0.02}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
}
