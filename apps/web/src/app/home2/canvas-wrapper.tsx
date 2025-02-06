'use client'

import { Canvas } from "@react-three/fiber";
import { ReactNode, useRef } from "react";

export function CanvasWrapper({children}: {children:ReactNode}) {
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
        {children}
      </Canvas>
    </div>
  );
}


