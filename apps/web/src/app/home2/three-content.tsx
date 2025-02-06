'use client'

import { Scroll, ScrollControls } from "@react-three/drei";
import { CanvasWrapper } from "./canvas-wrapper";

export default function ThreeContent() {
  return (
    <CanvasWrapper>
      <ScrollControls pages={3} damping={0.1}>
        <Scroll html>
          <h1 className='text-3xl'>Aloha, I&apos;m Lani</h1>
          <h1 className='text-3xl top-[100dvh]'>Passion Projects</h1>
          <h1 className='text-3xl top-[200dvh]'>Client Work</h1>
        </Scroll>
      </ScrollControls>
    </CanvasWrapper>
  );
}

/*
import { Scroll, ScrollControls, useIntersect } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { MathUtils, type Vector3 } from 'three';

function ProjectItem({ src, scale, ...props }: { src: string; scale: Vector3 }) {
  const visible = useRef(false);
  const [hovered, hover] = useState(false);
  const ref = useIntersect((isVisible) => (visible.current = isVisible));
  const { height } = useThree((state) => state.viewport);

  useFrame((state, delta) => {
    ref.current.position.y = MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta);
    //ref.current.material.zoom = MathUtils.damp(ref.current.material.zoom, visible.current ? 1 : 1.5, 4, delta)
    //ref.current.material.grayscale = MathUtils.damp(ref.current.material.grayscale, hovered ? 1 : 0, 4, delta)
  });

  return <group {...props}></group>;
}*/
