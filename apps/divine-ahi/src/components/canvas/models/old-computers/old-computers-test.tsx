/* eslint-disable react/no-unknown-property -- jsx-eslint hostilities */
/* eslint-disable @typescript-eslint/no-shadow -- three.js instances */
'use client';

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 old_computers-test.glb --types --shadows --instance --transform --keepmeshes --keepmaterials --debug 
Files: old_computers-test.glb [1.03MB] > /home/lani/Development/psychic-goose/tmp/old_computers-test-transformed.glb [117.96KB] (89%)
Author: Rafael Rodrigues (https://sketchfab.com/RafaelBR873D)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/old-computers-7bb6e720499a467b8e0427451d180063
Title: Old Computers
*/

import { type Mesh, type MeshStandardMaterial, type InstancedMesh, type AnimationClip } from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { type GLTF } from 'three-stdlib';
import { A11yUserPreferences } from '@react-three/a11y';
import DecalScreenText from './screen-decal';
import ShorkScreen from './haj-screen';
import AboutScreen2 from './about-screen2';
import BlogScreen from './blog-screen';

type ActionName = string;
interface GLTFAction extends AnimationClip {
  name: ActionName;
}
type GLTFResult = GLTF & {
  nodes: {
    Object_14: Mesh;
    Object_18: Mesh;
    Object_26: Mesh;
    Object_140: Mesh;
    Object_142: Mesh;
    Object_144: Mesh;
    Object_146: Mesh;
    Object_148: Mesh;
    Object_150: Mesh;
    Object_152: Mesh;
    Object_154: Mesh;
    Object_156: Mesh;
    Object_158: Mesh;
    Object_160: Mesh;
    Object_162: Mesh;
    Object_164: Mesh;
    Object_166: Mesh;
    Object_168: Mesh;
    Object_170: Mesh;
    Object_172: Mesh;
    Object_196: Mesh;
    Object_174: Mesh;
    Object_198: Mesh;
    Object_176: Mesh;
    Object_178: Mesh;
    Object_202: Mesh;
    Object_180: Mesh;
    Object_182: Mesh;
    Object_184: Mesh;
    Object_186: Mesh;
    Object_188: Mesh;
    Object_190: Mesh;
    Object_192: Mesh;
    Object_194: Mesh;
    Object_200: Mesh;
    Object_204: Mesh;
    Object_206: Mesh;
    Object_218: Mesh;
    Object_207: Mesh;
    Object_219: Mesh;
    Object_209: Mesh;
    Object_221: Mesh;
    Object_210: Mesh;
    Object_222: Mesh;
    Object_212: Mesh;
    Object_213: Mesh;
    Object_215: Mesh;
    Object_224: Mesh;
    Object_230: Mesh;
    Object_216: Mesh;
    Object_225: Mesh;
    Object_231: Mesh;
    Object_227: Mesh;
    Object_228: Mesh;
    Object_0: Mesh;
    Object_6: Mesh;
    Object_9: Mesh;
    Object_10: Mesh;
    Object_12: Mesh;
    Object_25: Mesh;
  };
  materials: {
    ['Material.001']: MeshStandardMaterial;
    Texture: MeshStandardMaterial;
    Screen: MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>;

const context = createContext({} as ContextType);
export function CompInstances({ children, ...props }: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF('/assets/models/old_computers-transformed.glb') as GLTFResult;
  const instances = useMemo(
    () => ({
      Object19: nodes.Object_172,
      Object20: nodes.Object_174,
      Object22: nodes.Object_178,
      Object33: nodes.Object_206,
      Object34: nodes.Object_207,
      Object35: nodes.Object_209,
      Object36: nodes.Object_210,
      Object39: nodes.Object_215,
      Object40: nodes.Object_216,
      // testing
      Object18: nodes.Object_18,
      Object26: nodes.Object_26,
      Object140: nodes.Object_140,
      Object142: nodes.Object_142,
      Object144: nodes.Object_144,
      Object146: nodes.Object_146,
      Object148: nodes.Object_148,
      Object150: nodes.Object_150,
      Object152: nodes.Object_152,
      Object154: nodes.Object_154,
      Object156: nodes.Object_156,
      Object158: nodes.Object_158,
      Object160: nodes.Object_160,
      Object162: nodes.Object_162,
      Object164: nodes.Object_164,
      Object166: nodes.Object_166,
      Object168: nodes.Object_168,
      Object170: nodes.Object_170,
      Object176: nodes.Object_176,
      Object180: nodes.Object_180,
      Object182: nodes.Object_182,
      Object184: nodes.Object_184,
      Object186: nodes.Object_186,
      Object188: nodes.Object_188,
      Object190: nodes.Object_190,
      Object192: nodes.Object_192,
      Object194: nodes.Object_194,
      Object200: nodes.Object_200,
      Object204: nodes.Object_204,
    }),
    [nodes],
  );
  return (
    <Merged meshes={instances} {...props}>
      {(instances: ContextType) => <context.Provider value={instances}>{children}</context.Provider>}
    </Merged>
  );
}

export function CompModel(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  const { nodes, materials } = useGLTF('/assets/models/old_computers-transformed.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      {/* @ts-expect-error -- instances */}
      <instances.Object18 position={[-0.186, 0, -2.962]} rotation={[0, -0.064, 0]} scale={1.52} />

      {/* @ts-expect-error -- instances */}
      <instances.Object26
        position={[-2.195, 2.188, -1.867]}
        rotation={[Math.PI, -0.512, -Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />

      {/* @ts-expect-error -- instances */}
      <instances.Object140 position={[5.531, 2.183, 0.174]} scale={[-1, 1, 1]} />

      {/* @ts-expect-error -- instances */}
      <instances.Object142 position={[5.786, 0.943, 0.18]} scale={[-1, 1, 1]} />

      {/* @ts-expect-error -- instances */}
      <instances.Object144 position={[5.736, 1.565, 0.053]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object146 position={[5.428, 0.315, 0.373]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object148 position={[5.646, 2.794, 0.107]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object150 position={[5.562, 4.034, 0.348]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object152 position={[5.461, 3.412, 0.256]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object154 position={[5.868, 4.662, 0.081]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object156 position={[4.856, 0, -2.541]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object158 position={[5.525, 0, -0.854]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object160 position={[5.059, 0, -1.597]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object162 position={[4.05, 0, -2.962]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object164 position={[2.585, 0, -4.002]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object166 position={[3.289, 0, -3.098]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object168 position={[1.655, 0, -4.536]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object170 position={[0.59, 0, -4.701]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object19 position={[4.888, 1.833, -1.624]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object19 position={[4.888, 3.976, -1.624]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object20 position={[3.754, 1.833, -3.277]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object20 position={[3.754, 3.976, -3.277]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object176 position={[1.332, 1.833, -3.817]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object22 position={[3.767, 1.836, -2.98]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object22 position={[3.767, 3.979, -2.98]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object180 position={[4.856, 2.143, -2.541]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object184 position={[5.059, 2.143, -1.597]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object186 position={[4.05, 2.143, -2.962]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object188 position={[2.585, 2.143, -4.002]} scale={[-1, 1, 1]} />
      {/* @ts-expect-error -- instances */}
      <instances.Object182 position={[5.525, 2.143, -0.854]} scale={[-1, 1, 1]} />
      {/* object190  */}
      <instancedMesh
        args={[nodes.Object_190.geometry, materials.Texture, 1]}
        instanceMatrix={(nodes.Object_190 as InstancedMesh).instanceMatrix}
        position={[3.3, 2.143, -3.312]}
        scale={[-1, 1, 1]}
      />
      <instancedMesh
        args={[nodes.Object_192.geometry, materials.Texture, 1]}
        instanceMatrix={(nodes.Object_192 as InstancedMesh).instanceMatrix}
        position={[1.655, 2.143, -4.536]}
        scale={[-1, 1, 1]}
      />
      <instancedMesh
        args={[nodes.Object_194.geometry, materials.Texture, 1]}
        instanceMatrix={(nodes.Object_194 as InstancedMesh).instanceMatrix}
        position={[0.59, 2.143, -4.701]}
        scale={[-1, 1, 1]}
      />
      <instancedMesh
        args={[nodes.Object_200.geometry, materials.Texture, 1]}
        instanceMatrix={(nodes.Object_200 as InstancedMesh).instanceMatrix}
        position={[0.746, 3.976, -4.662]}
        scale={[-1, 1, 1]}
      />
      <instancedMesh
        args={[nodes.Object_204.geometry, materials.Texture, 1]}
        instanceMatrix={(nodes.Object_204 as InstancedMesh).instanceMatrix}
        position={[3.198, 4.291, -3.092]}
        rotation={[0, -0.563, 0]}
        scale={[-1, 1, 1]}
      />
      <instancedMesh
        args={[nodes.Object_0.geometry, materials.Texture, 5]}
        castShadow
        receiveShadow
        instanceMatrix={(nodes.Object_0 as InstancedMesh).instanceMatrix}
      />
      <instancedMesh
        args={[nodes.Object_6.geometry, materials.Texture, 27]}
        castShadow
        receiveShadow
        instanceMatrix={(nodes.Object_6 as InstancedMesh).instanceMatrix}
      />
      <instancedMesh
        args={[nodes.Object_9.geometry, materials.Texture, 15]}
        castShadow
        receiveShadow
        instanceMatrix={(nodes.Object_9 as InstancedMesh).instanceMatrix}
      />
      <instancedMesh
        args={[nodes.Object_10.geometry, materials.Texture, 6]}
        castShadow
        receiveShadow
        instanceMatrix={(nodes.Object_10 as InstancedMesh).instanceMatrix}
      />
      <instancedMesh
        args={[nodes.Object_12.geometry, materials.Texture, 7]}
        castShadow
        receiveShadow
        instanceMatrix={(nodes.Object_12 as InstancedMesh).instanceMatrix}
      />
      <instancedMesh
        args={[nodes.Object_25.geometry, materials.Texture, 5]}
        castShadow
        receiveShadow
        instanceMatrix={(nodes.Object_25 as InstancedMesh).instanceMatrix}
      />
      <A11yUserPreferences>
        {/* Screen with Decals */}
        <DecalScreenText
          text='laniakita.com'
          frame='Object_212'
          panel='Object_213'
          modelLink='/assets/models/old_computers-transformed.glb'
          position={[-2.731, 0.629, -0.522]}
          rotation={[0, 1.087, 0]}
        />
        <DecalScreenText
          invert
          text='laniakita.com'
          frame='Object_206'
          panel='Object_207'
          modelLink='/assets/models/old_computers-transformed.glb'
          position={[3.11, 2.145, -0.18]}
          scale={0.81}
          rotation={[0, -0.793, -0]}
        />
        <DecalScreenText
          text='laniakita.com'
          frame='Object_209'
          panel='Object_210'
          modelLink='/assets/models/old_computers-transformed.glb'
          position={[-1.43, 2.496, -1.8]}
          rotation={[0, 1.002, 0]}
        />
        <DecalScreenText
          text='laniakita.com'
          frame='Object_209'
          panel='Object_210'
          modelLink='/assets/models/old_computers-transformed.glb'
          position={[-3.417, 3.056, 1.303]}
          rotation={[0, 1.222, 0]}
          scale={0.9}
        />
        <DecalScreenText
          text='laniakita.com'
          frame='Object_215'
          panel='Object_216'
          modelLink='/assets/models/old_computers-transformed.glb'
          position={[4.683, 4.29, -1.558]}
          rotation={[0, -Math.PI / 3, 0]}
        />
        <DecalScreenText
          text='laniakita.com'
          invert
          frame='Object_215'
          panel='Object_216'
          modelLink='/assets/models/old_computers-transformed.glb'
          position={[-3.899, 4.287, -2.642]}
          rotation={[0, 0.539, 0]}
        />
        {/* interactive screens */}
        <BlogScreen />
        <ShorkScreen />
        {/* stargate */}
        <AboutScreen2 />
      </A11yUserPreferences>
    </group>
  );
}

useGLTF.preload('/assets/models/old_computers-transformed.glb');
