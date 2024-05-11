'use client';
import { A11yAnnouncer } from '@react-three/a11y';
import { OrthographicCamera, Preload } from '@react-three/drei';
import { Canvas, useThree, type CanvasProps } from '@react-three/fiber';
import { type ReactNode, Suspense, useRef } from 'react';

export default function Common2DCanvas({ children, ...props }: { children: Readonly<ReactNode> } & CanvasProps) {
  const ref = useRef(null!);

  return (
    <div ref={ref} className='relative size-full'>
      <Suspense>
        <Canvas
          eventSource={ref}
          orthographic
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
          {...props}
        >
          <OrthographicCamera makeDefault manual left={-1} right={1} top={1} bottom={-1} near={0} far={1} position={[0,0,0.5]} />
          {children}
          <Preload all />
        </Canvas>
        <A11yAnnouncer />
      </Suspense>
    </div>
  );
}


/* possibly useful resizing algs
 * 
 * 01:
 * // resizing code based on Greg Rauhöft solution https://github.com/pmndrs/react-three-fiber/discussions/2867
 * const frustum = 100;
 * const aspectRatio = size.height / size.width
 * const horizontal = aspectRatio < 1 ? frustum / aspectRatio : frustum;
 * const vertical = aspectRatio < 1 ? frustum : frustum * aspectRatio;
 *
 * return <OrthographicCamera makeDefault position={[0,0,10]} zoom={frustum} left={-horizontal} right={horizontal} top={vertical} bottom={-vertical}  manual />
 * */
