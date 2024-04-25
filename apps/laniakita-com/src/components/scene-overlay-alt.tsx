'use client';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';
import SocialIconNavSplitterUltra from '@/components/social-splitter-ultra';
import { socialItems } from './footer/footer';

const TextSplitterUltra = dynamic(() => import('@/components/text-splitter-v2'), {
  ssr: true,
});

export default function SceneOverlayV3() {
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
    <>
      <div className='absolute left-10 top-10 z-[2] w-fit lg:top-24'>
        <div className='ctp-mocha flex w-fit flex-col -space-y-1 pb-1 text-4xl font-black drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] md:space-y-0 md:pb-2'>
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

      <div className='ctp-mocha absolute bottom-16 right-4 z-[2] flex flex-row overflow-hidden pb-4 text-ctp-text opacity-0 motion-safe:animate-fade-in motion-reduce:opacity-100 lg:bottom-4'>
        <SocialIconNavSplitterUltra
          boxItems={socialItems}
          hxw='basis-1/5 min-h-14 min-w-14'
          animClass=' motion-safe:animate-upDog motion-safe:[transform:_translateY(140%)]'
        />
      </div>
    </>
  );
}
