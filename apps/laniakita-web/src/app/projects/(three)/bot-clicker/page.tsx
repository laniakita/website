import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HajClickerStoreProvider } from '@/providers/hajclicker-store-provider';

const BotClickerScene = dynamic(() => import('./main'), { ssr: false });

export default function BotClicker() {
  return (
    <Suspense>
      <HajClickerStoreProvider>
        <BotClickerScene />
      </HajClickerStoreProvider>
    </Suspense>
  );
}
