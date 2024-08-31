'use client';
/* eslint-disable react/no-unknown-property -- r3f types issues */
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, LineBasicMaterial, Line } from 'three';
import CommonEmbedCanvas from '@/components/canvas/dom/common-embed-canvas';

export default function FlowFields001Main() {
  return (
    <CommonEmbedCanvas camera={{ position: [0, 0, 100] }}>
      <SetupMesh />
    </CommonEmbedCanvas>
  );
}

function SetupMesh() {
  const MAX_POINTS = 50;
  let drawCount: number;
  const geometry = new BufferGeometry();
  const positions = new Float32Array(MAX_POINTS * 3);
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  drawCount = 2;
  geometry.setDrawRange(0, drawCount);
  const material = new LineBasicMaterial({ color: 0xff0000 });
  const line = new Line(geometry, material);
  const positionAttribute = line.geometry.getAttribute('position');

  updatePositions();

  function updatePositions() {
    let x = 0,
      y = 0,
      z = 0;
    for (let i = 0; i < positionAttribute.count; i++) {
      positionAttribute.setXYZ(i, x, y, z);

      x += (Math.random() - 0.5) * 30;
      y += (Math.random() - 0.5) * 30;
      z += (Math.random() - 0.5) * 30;
    }
  }

  useFrame(() => {
    drawCount = (drawCount + 1) % MAX_POINTS;
    line.geometry.setDrawRange(0, drawCount);
    if (drawCount === 0) {
      line.geometry.dispose();
      material.dispose();
      updatePositions();
      positionAttribute.needsUpdate = true;
      line.geometry.computeBoundingBox();
      line.geometry.computeBoundingSphere();
      line.material.color.setHSL(Math.random(), 1, 0.5);
    }
  });
  return <primitive object={line} />;
}
