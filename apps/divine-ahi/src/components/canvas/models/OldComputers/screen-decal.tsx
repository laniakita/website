import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Decal, RenderTexture, PerspectiveCamera, Text } from '@react-three/drei';
import { type Mesh } from 'three';
import { useUserPreferences } from '@react-three/a11y';
import { Screen, type ScreenProps } from './screen';

interface ScreenDecalProps extends ScreenProps {
  invert?: boolean;
  text: string;
}

export default function DecalScreenText({ invert, text, ...props }: ScreenDecalProps) {
  const { a11yPrefersState } = useUserPreferences();
  const textRef = useRef(null!);
  useFrame((state) => {
    if (!a11yPrefersState.prefersReducedMotion) {
      (textRef.current as Mesh).position.x = Math.sin(state.clock.elapsedTime * 0.5) * 7.4;
    } else {
      (textRef.current as Mesh).position.x = -6.5;
    }
  });
  return (
    <Screen {...props}>
      <meshBasicMaterial toneMapped={false} color={invert ? '#11111b' : 'cyan'} />
      <Decal position={[0, 0.53, 0]} rotation={[-0.4, Math.PI, 0]} scale={[1.22, 1.0, 1]}>
        <meshBasicMaterial toneMapped={false} transparent polygonOffset polygonOffsetFactor={-1}>
          <RenderTexture attach='map'>
            <PerspectiveCamera makeDefault manual aspect={1.22 / 1} position={[0, 0, 5]} />
            <color attach='background' args={[invert ? '#11111b' : 'cyan']} />
            <ambientLight intensity={Math.PI} />
            <directionalLight position={[10, 10, 5]} />
            <Text
              font='/assets/fonts/inter_latin_700.woff'
              rotation={[0, Math.PI, 0]}
              ref={textRef}
              fontSize={3}
              characters='abcdefghijklmnopqrstuvwxyz0123456789.!'
              color={invert ? 'white' : '#11111b'}
            >
              {text}
            </Text>
          </RenderTexture>
        </meshBasicMaterial>
      </Decal>
    </Screen>
  );
}
