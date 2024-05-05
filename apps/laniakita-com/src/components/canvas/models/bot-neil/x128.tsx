/* eslint-disable react/no-unknown-property -- jsx-eslint compatibility issues with r3f */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 bot_neil_animation_by_oscar_creativo.glb --types --shadows --transform --resolution 128 --simplify --debug 
Files: bot_neil_animation_by_oscar_creativo.glb [8.11MB] > /home/lani/Development/ahiakea/apps/laniakita-com/public/assets/models/bot-neil/assets/models/bot-neil/bn-x128.glb [185.46KB] (98%)
Author: OSCAR CREATIVO (https://sketchfab.com/oscar_creativo)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/bot-neil-animation-by-oscar-creativo-56d5d623bb6c40faaa951aca02080510
Title: BOT NEIL ANIMATION By Oscar Creativo
*/

import React, { useEffect, useRef } from 'react';
import type { Mesh, MeshStandardMaterial, AnimationClip, Group } from 'three';
import type { GLTF } from 'three-stdlib';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useUserPreferences } from '@react-three/a11y';
import { useHajClickerStore } from '@/providers/hajclicker-store-provider';

type GLTFResult = GLTF & {
  nodes: {
    ALA_IZQ_ALA_IZQ_0: Mesh;
    ALA_DERE_ALA_DERE_0: Mesh;
    OJO_OJO_0: Mesh;
    OJO_1_OJO_1_0: Mesh;
    CUEPRO_CUEPRO_0: Mesh;
    PISO_RUEDA_PISO_RUEDA_0: Mesh;
  };
  materials: {
    ALA_IZQ: MeshStandardMaterial;
    ALA_DERE: MeshStandardMaterial;
    material: MeshStandardMaterial;
    OJO_1: MeshStandardMaterial;
    CUEPRO: MeshStandardMaterial;
    PISO_RUEDA: MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type ActionName = 'NEIL ANIMATION';
interface GLTFAction extends AnimationClip {
  name: ActionName;
}
//type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function Neilx128(props: JSX.IntrinsicElements['group']) {
  const group = useRef<Group>(null!);
  const { nodes, materials, animations } = useGLTF('/assets/models/bot-neil/bn-x128.glb') as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const { a11yPrefersState } = useUserPreferences();
  const { clickNum } = useHajClickerStore((state) => state);
  useEffect(() => {
    !a11yPrefersState.prefersReducedMotion && clickNum >= 1 && actions['NEIL ANIMATION']?.play();
  }, [actions, a11yPrefersState, clickNum]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='RootNode'>
          <group name='CUERPO' position={[0.726, -3.578, 0.274]}>
            <group name='ALA_IZQ' position={[-40.104, 39.706, 1.917]} rotation={[0, 0, 0.046]}>
              <mesh
                name='ALA_IZQ_ALA_IZQ_0'
                castShadow
                receiveShadow
                geometry={nodes.ALA_IZQ_ALA_IZQ_0.geometry}
                material={materials.ALA_IZQ}
              />
            </group>
            <group name='ALA_DERE' position={[42.576, 39.581, 2.283]} rotation={[0, 0, 0.046]}>
              <mesh
                name='ALA_DERE_ALA_DERE_0'
                castShadow
                receiveShadow
                geometry={nodes.ALA_DERE_ALA_DERE_0.geometry}
                material={materials.ALA_DERE}
              />
            </group>
            <group name='OJO' position={[21.113, 46.37, 38.206]}>
              <mesh
                name='OJO_OJO_0'
                castShadow
                receiveShadow
                geometry={nodes.OJO_OJO_0.geometry}
                material={materials.material}
              />
            </group>
            <group name='OJO_1' position={[-21.263, 46.183, 39.347]}>
              <mesh
                name='OJO_1_OJO_1_0'
                castShadow
                receiveShadow
                geometry={nodes.OJO_1_OJO_1_0.geometry}
                material={materials.OJO_1}
              />
            </group>
            <group name='CUEPRO' position={[-2.322, 0.702, -0.274]}>
              <mesh
                name='CUEPRO_CUEPRO_0'
                castShadow
                receiveShadow
                geometry={nodes.CUEPRO_CUEPRO_0.geometry}
                material={materials.CUEPRO}
              />
            </group>
          </group>
          <group name='PISO_RUEDA' position={[-0.774, -16.135, 0.313]}>
            <mesh
              name='PISO_RUEDA_PISO_RUEDA_0'
              castShadow
              receiveShadow
              geometry={nodes.PISO_RUEDA_PISO_RUEDA_0.geometry}
              material={materials.PISO_RUEDA}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/assets/models/bot-neil/bn-x128.glb');
