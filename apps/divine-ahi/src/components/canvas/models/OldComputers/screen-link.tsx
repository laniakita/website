'use client';
import { useRef } from 'react';
import { extend } from '@react-three/fiber';
import { Decal, RenderTexture, PerspectiveCamera, Text , useGLTF } from '@react-three/drei';
import { type Mesh } from 'three';
import { A11y, useA11y } from '@react-three/a11y';
import { useRouter } from 'next/navigation';
import { geometry } from 'maath';
import { type ScreenProps } from './screen';

extend(geometry);

interface ScreenInnerLinkProps extends ScreenProps {
  invert?: boolean;
  textIn?: string;
}

export default function ScreenLink({ screenName, children, ...props }: ScreenInnerLinkProps) {
  const router = useRouter();

  return (
    <A11y
      role='link'
      href={`/${screenName}`}
      actionCall={() => {
        router.push(`/${screenName}`);
      }}
      description={`Go to the ${screenName} Page`}
    >
      <ScreenInnerLink {...props}>{children}</ScreenInnerLink>
    </A11y>
  );
}

function ScreenInnerLink({ invert, modelLink, frame, panel, children, textIn, ...props }: ScreenInnerLinkProps) {
  const { nodes, materials } = useGLTF(modelLink);
  const screenRef = useRef(null!);
  const a11y = useA11y();
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={(nodes[frame] as Mesh).geometry} material={materials.Texture} />
      <mesh castShadow receiveShadow geometry={(nodes[panel] as Mesh).geometry}>
        <meshBasicMaterial toneMapped={false} color={invert ? '#11111b' : 'cyan'} />
        <Decal position={[0, 0.53, 0]} rotation={[-0.4, Math.PI, 0]} scale={[1.22, 1.0, 1]}>
          <meshBasicMaterial ref={screenRef} toneMapped={false} transparent polygonOffset polygonOffsetFactor={-1}>
            <RenderTexture attach='map'>
              <color attach='background' args={[a11y.focus || a11y.hover ? '#4c4f69' : '#11111b']} />
              <Text
                font='/assets/fonts/inter_latin_700.woff'
                fontSize={2}
                rotation={[0, Number(Math.PI), 0]}
                maxWidth={8.7}
                color={a11y.focus || a11y.hover ? '#cba6f7' : '#cdd6f4'}
              >
                {textIn}
              </Text>
              {children}
              <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 10]} />
            </RenderTexture>
          </meshBasicMaterial>
        </Decal>
      </mesh>
    </group>
  );
}
