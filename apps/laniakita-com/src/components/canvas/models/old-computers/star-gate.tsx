/* eslint-disable react/no-unknown-property -- jsx-eslint compatibility issues with r3f */
import type { ReactNode } from 'react';
import { useRef, useCallback } from 'react';
import { useGLTF, Text, MeshPortalMaterial } from '@react-three/drei';
import { useFrame, extend } from '@react-three/fiber';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { A11y, useA11y } from '@react-three/a11y';
import { easing, geometry } from 'maath';
import { type Mesh } from 'three';
import { type ScreenProps } from './screen';

extend(geometry);

export default function ScreenStarGate({ screenName, ...props }: ScreenStarGateInnerProps) {
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
    router.push(`${pathname}?${createQueryString('screen', screenName!)}`);
  };

  return (
    <A11y
      role='button'
      description={`Enter the ${screenName} Portal`}
      activationMsg={`Entering ${screenName} Portal`}
      actionCall={handleJump}
    >
      <ScreenStarGateInner {...props} screenName={screenName} />
    </A11y>
  );
}

interface ScreenStarGateInnerProps extends ScreenProps {
  screenText: string;
  children: ReactNode;
}

function ScreenStarGateInner({
  screenName,
  modelLink,
  frame,
  panel,
  screenText,
  children,
  ...props
}: ScreenStarGateInnerProps) {
  const { nodes, materials } = useGLTF(modelLink);
  const portal = useRef(null!);
  const a11y = useA11y();
  const search = useSearchParams();
  useFrame((state, delta) =>
    easing.damp(portal.current, 'blend', search.get('screen') === screenName ? 1 : 0, 0.1, delta),
  );
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={(nodes[frame] as Mesh).geometry} material={materials.Texture} />
      <group>
        <Text
          fontSize={0.3}
          characters='abcdefghijklmnopqrstuvwxyz0123456789.!'
          color={a11y.focus || a11y.hover ? 'cyan' : '#ffffff'}
          anchorY='top'
          anchorX='left'
          position={[-0.29, 0.9, 0.2]}
          material-toneMapped={false}
        >
          {screenText}
        </Text>

        <mesh geometry={(nodes[panel] as Mesh).geometry} position={[0, 0, 0.001]}>
          <meshPhysicalMaterial transmission={1} roughness={0.3} />
        </mesh>
        <mesh name={screenName} castShadow receiveShadow geometry={(nodes[panel] as Mesh).geometry}>
          <MeshPortalMaterial ref={portal}>{children}</MeshPortalMaterial>
        </mesh>
      </group>
    </group>
  );
}
useGLTF.preload('/assets/models/old_computers-transformed.glb');
