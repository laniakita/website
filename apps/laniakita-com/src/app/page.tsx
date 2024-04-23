'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import SceneOverlay from '@/components/scene-overlay';
import TextSplitterUltra from '@/components/text-splitter-v2';
import Link from 'next/link';

/*
const SceneOverlay = dynamic(() => import('@/components/scene-overlay'), {
  ssr: false,
});
*/
const MinComputerShork = dynamic(
  () => import('@/components/canvas/scenes/computers-and-fren').then((mod) => mod.MinComputerShork),
  {
    ssr: false,
  },
);
const LightsCameraActionShork = dynamic(
  () => import('@/components/canvas/scenes/computers-and-fren').then((mod) => mod.LightsCameraActionShork),
  {
    ssr: false,
  },
);

const View = dynamic(() => import('@/components/canvas/view'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center gap-6 bg-ctp-base py-10 dark:bg-ctp-crust lg:pt-24'>
      <div className='w-full max-w-5xl pl-10'>
        <div className='text-ctp-text opacity-0 motion-safe:animate-fade-in motion-reduce:opacity-100 '>
          <div className='w-fit'>
            <div className='flex w-fit flex-col -space-y-1 pb-1 text-xl font-black text-ctp-text md:space-y-0 md:pb-2 [@media_(min-width:_350px)]:text-3xl '>
              <h1 className='max-w-max motion-safe:hidden'>I create web app & digital experiences that delight.</h1>
              <h1 className='overflow-hidden'>
                <TextSplitterUltra
                  className='inline-flex'
                  textIn='I create web apps &'
                  spanRole='heading'
                  charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                />
              </h1>
              <h1 className='overflow-hidden'>
                <TextSplitterUltra
                  className='inline-flex'
                  textIn='digital experiences'
                  spanRole='heading'
                  charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                />
              </h1>
              <h1 className='overflow-hidden'>
                <TextSplitterUltra
                  className='inline-flex'
                  textIn='that delight.'
                  spanRole='heading'
                  charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                />
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full max-w-5xl px-4'>
        <div className='w-full rounded-3xl bg-gradient-to-br from-ctp-sapphire to-ctp-blue p-2 shadow-lg'>
          <div className='relative h-[50vh] min-h-96 w-full rounded-2xl bg-black p-3'>
            <SceneOverlay />
            <View className='flex size-full items-center justify-center'>
              <Suspense fallback={<LoadingSpinner />}>
                <MinComputerShork />
                <LightsCameraActionShork />
              </Suspense>
            </View>
          </div>
        </div>
        <p className='p-4 text-center italic supports-[text-wrap:balance]:text-balance'>
          Fig. 01 &mdash; <strong>Interactive greeter</strong>. Made with Three.js. 3D models provided by Rafael
          Rodrigues, and Kaine G on sketchfab. see: <Link href='/credits#models'>Credits</Link>
        </p>
      </div>
      <div className='w-full max-w-5xl p-10'>
        <h1 className='text-3xl font-black'>
          Full-Stack Developer, <br /> with Creative Tendencies
        </h1>
      </div>
    </div>
  );
}

/*    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
 * */
