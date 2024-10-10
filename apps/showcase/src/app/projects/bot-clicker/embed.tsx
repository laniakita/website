'use client';
import dynamic from 'next/dynamic';
import { HajClickerStoreProvider } from '@/providers/hajclicker-store-provider';

const BotClickerScene = dynamic(() => import('@/app/projects/bot-clicker/scene-main-embed'), {
  ssr: false,
  loading: () => (
    <div className='absolute top-0 flex size-full items-center justify-center lg:max-h-dvh'>
      <svg className='-ml-1 mr-3 size-9 text-ctp-text motion-safe:animate-spin' fill='none' viewBox='0 0 24 24'>
        <circle className='stroke-ctp-mauve opacity-25' cx='12' cy='12' r='10' strokeWidth='4' />
        <path
          className='fill-ctp-mauve opacity-75'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
});

export default function EmbedBotClicker() {
  return (
    <HajClickerStoreProvider>
      <BotClickerScene />
    </HajClickerStoreProvider>
  );
}
