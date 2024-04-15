'use client';
import { useRef, useCallback } from 'react';
import { type MeshProps, useFrame, extend } from '@react-three/fiber';
import { Decal, RenderTexture, PerspectiveCamera , useGLTF } from '@react-three/drei';
import { type Mesh } from 'three';
import { A11y, useA11y, useUserPreferences } from '@react-three/a11y';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { easing, geometry } from 'maath';
import { type ScreenProps } from './screen';

extend(geometry);

interface ScreenInnerProps extends ScreenProps {
  invert?: boolean;
}

export function ScreenInteractive({ screenName, children, ...props }: ScreenInnerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  const handleJump = () => {
    router.push(`${pathname  }?${  createQueryString('screen', screenName!)}`);
  };

  return (
    <A11y
      role='button'
      actionCall={handleJump}
      description={`Enter the ${screenName} Portal`}
      activationMsg={`Entering ${screenName} Portal`}
    >
      <ScreenInner {...props} screenName={screenName}>
        {children}
      </ScreenInner>
    </A11y>
  );
}

function ScreenInner({ invert, screenName, modelLink, frame, panel, children, ...props }: ScreenInnerProps) {
  const { nodes, materials } = useGLTF(modelLink);
  const screenRef = useRef(null!);
  const a11y = useA11y();
  const search = useSearchParams();
  useFrame((state, delta) =>
    easing.damp(screenRef.current, 'blend', search.get('screen') === screenName ? 1 : 0, 0.1, delta),
  );
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={(nodes[frame] as Mesh).geometry} material={materials.Texture} />
      <mesh castShadow receiveShadow geometry={(nodes[panel] as Mesh).geometry} name={screenName}>
        <meshBasicMaterial toneMapped={false} color={invert ? '#11111b' : 'cyan'} />
        <Decal position={[0, 0.53, 0]} rotation={[-0.4, Math.PI, 0]} scale={[1.22, 1.0, 1]}>
          <meshBasicMaterial ref={screenRef} toneMapped={false} transparent polygonOffset polygonOffsetFactor={-1}>
            <RenderTexture attach='map'>
              <color attach='background' args={[a11y.focus || a11y.hover ? '#4c4f69' : '#11111b']} />
              {children}
              <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 10]} />
            </RenderTexture>
          </meshBasicMaterial>
        </Decal>
      </mesh>
    </group>
  );
}

export function SpinningBox({ ...props }: MeshProps) {
  const { a11yPrefersState } = useUserPreferences();
  const ref = useRef<Mesh>(null!);
  useFrame((state, delta) => {
    if (!a11yPrefersState.prefersReducedMotion) {
      ref.current.rotation.x = ref.current.rotation.y += delta;
    }
  });
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color='hotpink' toneMapped={false} />
    </mesh>
  );
}
