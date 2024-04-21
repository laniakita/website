/* eslint-disable react/no-unknown-property -- jsx-eslint hostilities */
import { MathUtils } from 'three';
import { Text } from '@react-three/drei';
import { ScreenInteractive } from './screen-interactive';

const p1 =
  'Aloha! My name is Lani Akita, and I’m a Full Stack Developer from Honolulu, Hawaii. \n \nI love to learn, experiment, and to build bigger, better, more ambitious and more accessible things. \n \nFor business inquiries, please send an email to: lani@laniakita.com';

export default function AboutScreen2() {
  return (
    <ScreenInteractive
      modelLink='/assets/models/old_computers-transformed.glb'
      screenName='test3'
      frame='Object_212'
      panel='Object_213'
      position={[0.27, 1.51, -2.613]}
    >
      <group position={[0, 0, 0]} rotation={[0, MathUtils.degToRad(180), 0]}>
        <Text font='/assets/fonts/inter_latin_700.woff' fontSize={0.46} maxWidth={8} color='white'>
          {p1}
        </Text>
      </group>
    </ScreenInteractive>
  );
}
