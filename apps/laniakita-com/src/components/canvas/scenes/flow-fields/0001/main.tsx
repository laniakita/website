'use client';
import { useRef } from 'react';
import { createNoise3D, createNoise2D } from 'simplex-noise';
import { useFrame, useThree } from '@react-three/fiber';
import { Segment, type SegmentObject, Segments } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import CommonEmbedCanvas from '@/components/canvas/dom/common-embed-canvas';

// based on Keith Peter's Flow Fields https://www.bit-101.com/2017/2017/10/flow-fields-part-i/
// with the clifford attractor from Paul Bourke https://paulbourke.net/fractals/clifford/

export default function FlowFields0001Main() {
  return (
    <CommonEmbedCanvas camera={{ position: [0, 0, 340], fov: 45 }}>
      <FlowFieldsMesh />
      <OrbitControls />
    </CommonEmbedCanvas>
  );
}

const pointsSetup = (height: number) => {
  const points = [];
  for (let y = 0; y < height; y += 5) {
    points.push({
      x: 0,
      y,
      vx: 0,
      vy: 0,
    });
  }
  return points;
};

/*
const cliffordAttractor = (x: number, y: number, height: number, width: number) => {
  const a = Math.random() * 4 - 2;
  const b = Math.random() * 4 - 2;
  const c = Math.random() * 4 - 2;
  const d = Math.random() * 4 - 2;

  // scale down x and y
  const scale = 0.005;
  const x0 = (x - width / 2) * scale;
  const y0 = (y - height / 2) * scale;

  // attactor gives new x, y for old one.
  const x1 = Math.sin(a * y0) + c * Math.cos(a * x0);
  const y1 = Math.sin(b * x0) + d * Math.cos(b * y0);

  // find angle from old to new. that's the value.
  return Math.atan2(y1 - y, x1 - x);
};
    });

*/
const noise3D = createNoise3D();

const getVal3D = (x: number, y: number, z = 1) => {
  const scale = 0.01;
  return noise3D(x * scale, y * scale, z) * Math.PI * 2;
};

function FlowFieldsMesh() {
  const myLine = useRef<SegmentObject[]>([]);
  const { size } = useThree();
  useFrame(({clock}) => {
    myLine.current.forEach((r, i) => {
      const time = clock.elapsedTime;
      const x = Math.sin((i / 5000) * Math.PI) * 10;
      const y = Math.cos((i / 5000) * Math.PI) * 10;
      const z = Math.cos((i * time) / 1000);
      r.start.set(x, y, z);
      r.end.set(x + Math.sin(time + i), y + Math.cos(time + i), z);
      r.color.setRGB(x / 10, y / 10, z);
    });
  });
  return (
    <Segments limit={10000} linewidth={1.0}>
      {Array.from({ length: 10000 }).map((_, i) => (
        <Segment
          key={Math.random()}
          /* @ts-expect-error -- myLine shouldn't be null */
          ref={(r) => (myLine.current[i] = r)}
          color='orange'
          start={[0, 0, 0]}
          end={[0, 0, 0]}
        />
      ))}
    </Segments>
  );
}
