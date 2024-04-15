'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import SocialIconNavSplitterUltra from '@/components/social-splitter-ultra';
const TextSplitterUltra = dynamic(() => import('@/components/text-splitter-v2'), {
  ssr: true,
});

export const socialItems = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    textSize: 'text-4xl',
  },
  {
    title: 'Mastodon',
    url: 'https://joinmastodon.org/',
    iconName: 'icon-[fa6-brands--mastodon]',
    textSize: 'text-4xl',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com',
    iconName: 'icon-[fa6-brands--patreon]',
    textSize: 'text-3xl',
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    iconName: 'icon-[fa--linkedin]',
    textSize: 'text-3xl',
  },
  {
    title: 'RSS',
    url: '/rss',
    iconName: 'icon-[ph--rss-bold]',
    textSize: 'text-4xl',
  },
];

export default function SceneOverlay() {
  const searchParams = useSearchParams();
  const [needHint, setNeedHint] = useState(true);
  return (
    <Suspense>
      {searchParams.get('screen') && (
        <div className='absolute  left-4 top-8  z-[1] w-fit text-xl  lg:top-20'>
          <Link
            href='/'
            className='motion-safe:color-trans-2 rounded border border-ctp-text bg-ctp-crust p-4 font-mono text-ctp-text opacity-0 shadow-xl hover:bg-ctp-base motion-safe:animate-fade-in motion-reduce:opacity-100'
            onClick={() => {
              needHint && setNeedHint(false);
            }}
          >
            Back
          </Link>
        </div>
      )}

      {!searchParams.get('screen') && (
        <>
          <div className='pointer-events-none absolute z-[1] opacity-0 motion-safe:animate-fade-in motion-reduce:opacity-100 sm:left-4 sm:top-4 md:left-6 md:top-6 lg:left-10 lg:top-24'>
            <div className='ctp-mocha w-fit p-4 sm:rounded-2xl sm:border sm:border-ctp-text sm:bg-ctp-base/40 sm:backdrop-blur-md'>
              <div className='flex w-fit flex-col -space-y-1 pb-1 text-2xl font-black text-ctp-text md:space-y-0 md:pb-2 md:text-3xl lg:text-4xl'>
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

              {needHint ? (
                <div className='ctp-mocha overflow-hidden'>
                  <p className='font-mono text-sm font-bold motion-safe:-translate-y-full motion-safe:animate-fade-in-down motion-safe:[animation-delay:3.8s]'>
                    [HINT]: tap the screens :3
                  </p>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className='ctp-mocha absolute bottom-16 right-4 z-[2] flex flex-row overflow-hidden pb-4 text-ctp-text opacity-0 motion-safe:animate-fade-in motion-reduce:opacity-100 lg:bottom-4'>
            <SocialIconNavSplitterUltra
              boxItems={socialItems}
              hxw='h-[3rem] w-[3rem]'
              animClass=' motion-safe:animate-upDog motion-safe:[transform:_translateY(140%)]'
            />
          </div>
        </>
      )}
    </Suspense>
  );
}
