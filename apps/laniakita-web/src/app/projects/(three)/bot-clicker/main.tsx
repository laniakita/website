import { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { HajClickerStoreProvider } from '@/providers/hajclicker-store-provider';

/*
import { allProjects } from 'contentlayer/generated';

const projectData = allProjects.find((proj) => proj.url === '/projects/bot-clicker');

export const metadata: Metadata = {
  title: projectData?.title,
  authors: [{ name: 'Lani Akita' }],
  description: projectData?.description,
  openGraph: {
    title: projectData?.title,
    description: projectData?.description,
  },
  twitter: {
    card: 'summary',
    title: projectData?.title,
    description: projectData?.description,
  },
};
*/

const BotClickerScene = dynamic(() => import('./scene-main'), { ssr: false });

export default function BotClicker() {
  return (
    <Suspense>
      <HajClickerStoreProvider>
        <BotClickerScene />
      </HajClickerStoreProvider>
    </Suspense>
  );
}
