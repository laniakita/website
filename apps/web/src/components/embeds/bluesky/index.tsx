import { Suspense } from 'react';
import { BlueskyEmbedCore } from './mod';

export default function BlueskyEmbed({ postUrl }: { postUrl: string }) {
  return (
    <Suspense fallback={null}>
      <BlueskyEmbedCore postUrl={postUrl} />
    </Suspense>
  );
}
