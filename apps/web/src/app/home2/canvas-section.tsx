'use client';

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import ThreeContent from "./three-content";

export function CanvasWrapper() {

}

export default function CanvasSection() {
  const ref = useRef(null!);
  return (
    <div ref={ref} className='relative size-full'>
      <Canvas
        orthographic
        camera={{ zoom: 80 }}
        gl={{
          alpha: false,
          antialias: false,
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
        eventSource={ref}
      >
        <color attach='background' args={['#07070d']} />
        <ThreeContent />
      </Canvas>
    </div>
  );
}
