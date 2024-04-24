'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import TextSplitterUltra from '@/components/text-splitter-v2';
import SocialIconNavSplitterUltra from '@/components/social-splitter-ultra';
import { socialItems } from '@/components/footer/footer';

const SceneOverlay = dynamic(() => import('@/components/scene-overlay'), {
  ssr: false,
});

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
  const windowRef = useRef<number>();
  const [mobileVis, setMobileVis] = useState(false);
  const [tabVis, setTabVis] = useState(false);
  useEffect(() => {
    const updateRef = () => {
      windowRef.current = window.innerWidth;
      if (windowRef.current < 768) {
        setMobileVis(true);
        setTabVis(false);
      } else if (windowRef.current >= 768) {
        setMobileVis(false);
        setTabVis(true);
      }
    };

    updateRef();

    window.addEventListener('resize', updateRef);
    return () => {
      window.removeEventListener('resize', updateRef);
    };
  });

  return (
    <div className='motion-safe:simple-color-trans min-h-screen bg-ctp-base dark:bg-ctp-crust'>
      <div
        className={`${mobileVis || tabVis ? 'visible' : 'hidden'}  flex flex-col items-center justify-center gap-6  py-10 lg:gap-10 lg:pt-24`}
      >
        <div className='flex w-full max-w-xl px-4 lg:max-w-5xl [@media_(min-width:_350px)]:px-10'>
          <div className='text-ctp-text opacity-0 motion-safe:animate-fade-in motion-reduce:opacity-100 '>
            <div className='w-fit'>
              <div className='flex w-fit flex-col -space-y-1 pb-1 text-4xl font-black text-ctp-text md:space-y-0 md:pb-2'>
                <h1 className='max-w-max motion-safe:hidden'>I create web app & digital experiences that delight.</h1>

                  <div className={mobileVis ? 'visible h-40' : 'hidden h-40'}>
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
                  </div>

                  <div className={tabVis ? 'visible' : 'hidden'}>
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
                        textIn='that delight'
                        spanRole='heading'
                        level={1}
                        charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                      />
                    </h1>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full max-w-5xl px-4'>
          <div className='w-full rounded-3xl bg-gradient-to-br from-ctp-pink to-ctp-mauve p-2 shadow-xl shadow-ctp-mauve/30'>
            <div className='relative size-full rounded-2xl bg-black p-3' style={{ height: '30rem' }}>
              <SceneOverlay />
              <View style={{ height: '100%', width: '100%' }}>
                <Suspense fallback={<LoadingSpinner />}>
                  <MinComputerShork />
                  <LightsCameraActionShork />
                </Suspense>
              </View>
            </div>
          </div>
          <p className='w-full  pt-4 italic supports-[text-wrap:pretty]:text-pretty [@media_(min-width:_350px)]:px-6'>
            Fig. 01 &mdash; <strong>Interactive greeter</strong>. Made with Three.js. 3D models by Rafael Rodrigues, and
            Kaine G. see:{' '}
            <Link className='underline' href='/credits#models'>
              Credits#Models
            </Link>
            . Floor texture provided by Emil Skriver. see:{' '}
            <Link className='underline' href='/credits#textures'>
              Credits#Textures
            </Link>
          </p>
        </div>

        <div className='flex w-full max-w-5xl flex-col-reverse items-center justify-center gap-6 lg:flex-row-reverse lg:items-start lg:gap-0'>
          <div className='max-w-xl px-4'>
            <div className='flex size-full max-h-52 min-h-40 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-ctp-mauve to-ctp-pink p-2 shadow-xl shadow-ctp-mauve/30'>
              <div className='flex size-full min-h-48 items-center justify-center rounded-2xl bg-ctp-base p-2'>
                <div className='overflow-hidden'>
                  <SocialIconNavSplitterUltra
                    boxItems={socialItems}
                    hxw='basis-1/5 min-h-16 min-w-16'
                    animClass=' motion-safe:animate-upDog motion-safe:[transform:_translateY(140%)]'
                  />
                </div>
              </div>
            </div>

            <p className='w-full px-6 pt-4 italic supports-[text-wrap:pretty]:text-pretty lg:px-0'>
              Fig. 02 &mdash; <strong>Lani&apos;s Social Media Accounts + RSS Subscribe Button</strong>. Made with react
              + tailwindcss. Icons provided by Fontawsome and Phosphor.
            </p>
          </div>

          <div className='flex max-w-xl flex-col gap-4 [@media_(min-width:_350px)]:px-10'>
            <div className='text-4xl font-black'>
              <h1 className='motion-safe:hidden'>
                Full-Stack Developer, <br /> with Creative Tendencies
              </h1>

                <div className={mobileVis ? 'visible' : 'hidden'}>
                  <h1 className='overflow-hidden'>
                    <TextSplitterUltra
                      className='inline-flex'
                      textIn='Full-Stack'
                      spanRole='heading'
                      level={1}
                      charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                    />
                  </h1>

                  <h1 className='overflow-hidden'>
                    <TextSplitterUltra
                      className='inline-flex'
                      textIn='Developer,'
                      spanRole='heading'
                      level={1}
                      charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                    />
                  </h1>

                  <h1 className='overflow-hidden'>
                    <TextSplitterUltra
                      className='inline-flex'
                      textIn='with a love'
                      spanRole='heading'
                      level={1}
                      charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                    />
                  </h1>

                  <h1 className='overflow-hidden'>
                    <TextSplitterUltra
                      className='inline-flex'
                      textIn='for the Arts'
                      spanRole='heading'
                      level={1}
                      charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                    />
                  </h1>
                </div>

                <div className={tabVis ? 'visible h-20' : 'hidden'}>
                  <h1 className='overflow-hidden'>
                    <TextSplitterUltra
                      className='inline-flex'
                      textIn='Full-Stack Developer,'
                      spanRole='heading'
                      level={1}
                      charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                    />
                  </h1>

                  <h1 className='overflow-hidden'>
                    <TextSplitterUltra
                      className='inline-flex'
                      textIn='with a love for the Arts'
                      spanRole='heading'
                      level={1}
                      charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                    />
                  </h1>
                </div>
            </div>
            <div className='flex flex-col gap-4 text-lg supports-[text-wrap:pretty]:text-pretty'>
              <p className=''>
                My name is Lani Akita and I create applications for the modern net. In my time I&apos;ve worked with a
                lot of different tools and technologies (see:{' '}
                <Link className='underline' href='/about#my-current-development-process'>
                  My Dev Process
                </Link>
                ), and I&apos;m always curious to learn and experiment with even more.
              </p>

              <p>
                I mostly write TypeScript in combination with JavaScript libraries and (meta-)frameworks for use with a
                Node runtime environment. Though, I&apos;m partial to Bun and its runtime environment, especially when
                deploying apps on the Edge (i.e. Cloudflare Workers).
              </p>

              <p className=''>
                When I&apos;m working, but not hacking away in a Neovim buffer, I&apos;m creating digital illustrations
                in Krita with a graphics tablet. You can (soon) see my work strewn about this website and on{' '}
                <Link className='underline' href='https://patreon.com/Lani_Akita'>
                  Patreon
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
