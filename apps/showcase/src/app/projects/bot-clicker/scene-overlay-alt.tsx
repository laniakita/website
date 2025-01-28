'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MAIN_SITE_URL } from '@/lib/constants';

const TextSplitterUltra = dynamic(() => import('@/components/text-splitter-v2'), {
  ssr: true,
});

interface OverlayProps {
  viewMobile?: boolean;
  viewTablet?: boolean;
}

export default function SceneOverlayV3({ viewMobile, viewTablet }: OverlayProps) {
  const searchParams = useSearchParams();

  return (
    <Suspense>
      {!searchParams.get('play') && (
        <>
          <div className='ctp-mocha absolute left-6 top-6 z-[2] w-fit md:left-10 md:top-10 lg:top-24'>
            <div className='flex w-fit flex-col justify-start gap-4'>
              <div className='text-ctp-text flex w-fit flex-col -space-y-1 text-4xl font-black md:space-y-0'>
                <h1 className='max-w-sm motion-safe:hidden'>I create web app & digital experiences that delight.</h1>

                {/* mobile splitter text */}
                {viewMobile !== false && (
                  <>
                    <h1 className='overflow-hidden'>
                      <TextSplitterUltra
                        className='inline-flex'
                        textIn='I create web'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                    <h1 className='overflow-hidden'>
                      <TextSplitterUltra
                        className='inline-flex'
                        textIn='apps & digital'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                    <h1 className='overflow-hidden'>
                      <TextSplitterUltra
                        className='inline-flex'
                        textIn='experiences'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                    <h1 className='overflow-hidden'>
                      <TextSplitterUltra
                        className='inline-flex'
                        textIn='that delight.'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                  </>
                )}

                {/* tablet splitter text */}

                {viewTablet !== false && viewMobile === false && (
                  <>
                    <h1 className='overflow-hidden'>
                      <TextSplitterUltra
                        className='inline-flex'
                        textIn='I create web apps &'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                    <h1 className='overflow-hidden'>
                      <TextSplitterUltra
                        className='inline-flex'
                        textIn='digital experiences'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                    <h1 className='overflow-hidden'>
                      <TextSplitterUltra
                        className='inline-flex'
                        textIn='that delight.'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                  </>
                )}
              </div>

              <Link
                href='/about'
                className='border-ctp-surface0 hover:border-ctp-mauve motion-safe:animate-fade-in-down rounded-full border bg-black/80 p-2 text-center font-mono text-lg opacity-0 backdrop-blur-md motion-safe:[animation-delay:_2.5s] motion-reduce:opacity-100'
              >
                Learn More
              </Link>

              <Link
                href='/blog'
                className='border-ctp-surface0 hover:border-ctp-mauve motion-safe:animate-fade-in-down rounded-full border bg-black/80 p-2 text-center font-mono text-lg opacity-0 backdrop-blur-md motion-safe:[animation-delay:_3.0s] motion-reduce:opacity-100'
              >
                Read the Blog
              </Link>

              <Link
                href='/contact'
                className='border-ctp-mauve bg-ctp-mauve/80 text-ctp-base hover:border-ctp-surface0 hover:bg-ctp-mauve motion-safe:animate-fade-in-down rounded-full border p-2 text-center font-mono text-lg opacity-0 backdrop-blur-md hover:text-black motion-safe:[animation-delay:_3.5s] motion-reduce:opacity-100'
              >
                Contact Me
              </Link>
            </div>
          </div>

          <div className='ctp-mocha absolute bottom-24 left-6 z-[2] lg:bottom-10'>
            <Link
              href={`${MAIN_SITE_URL}/credits`}
              className='motion-safe:animate-fade-in underline opacity-0 motion-reduce:opacity-100'
            >
              Credits
            </Link>
          </div>
        </>
      )}
    </Suspense>
  );
}
