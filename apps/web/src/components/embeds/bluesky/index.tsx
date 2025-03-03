import { Suspense } from 'react';
import { BlueskyEmbedCore } from './mod';

export default function BlueskyEmbed() {
  return (
    <Suspense fallback={null}>
      <BlueskyEmbedCore />
    </Suspense>
  );
}
