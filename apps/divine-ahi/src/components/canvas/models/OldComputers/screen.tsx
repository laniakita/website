import { useGLTF } from '@react-three/drei';
import { type Mesh } from 'three';
import { type GroupProps } from '@react-three/fiber';

export interface ScreenProps extends GroupProps {
  frame: string;
  panel: string;
  screenName?: string;
  children?: any;
  modelLink: string;
}

export function Screen({ frame, panel, screenName, children, modelLink, ...props }: ScreenProps) {
  const { nodes, materials } = useGLTF(modelLink);
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={(nodes[frame] as Mesh).geometry} material={materials.Texture} />
      <mesh castShadow receiveShadow geometry={(nodes[panel] as Mesh).geometry} name={screenName}>
        {children}
      </mesh>
    </group>
  );
}
