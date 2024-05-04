'use client';
import SocialIconNavSplitterUltra from '@/components/social-splitter-ultra';
import { useHajClickerStore } from '@/providers/hajclicker-store-provider';
import { socialItems } from './footer/footer';
import TextSplitterUltra from './text-splitter-v2';

export default function SocialCounterOverlay() {
  const { clickNum } = useHajClickerStore((state) => state);
  return (
    <>
      {clickNum >= 1 && (
        <div className=' ctp-mocha pointer-events-none absolute bottom-20 right-6 z-[2]  w-fit touch-none flex-col items-end  -space-y-2 text-ctp-text md:right-10 lg:bottom-10 '>
          <p className='text-xl font-black uppercase'>Haj Click Counter:</p>
          <p className='text-[2.3rem] font-black'>{String(clickNum).padStart(8, '0')}</p>
        </div>
      )}
      {clickNum < 1 && (
        <div className='ctp-mocha absolute bottom-20 right-6 z-[2] flex flex-col items-end gap-4 pb-4 text-ctp-text md:right-10 lg:bottom-10'>
          <div className='pointer-events-none flex w-fit touch-none flex-col -space-y-2 '>
            <h3 className='overflow-hidden text-xl font-black uppercase'>
              <TextSplitterUltra
                className='inline-flex'
                textIn='Haj Click Counter:'
                spanRole='heading'
                level={3}
                charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
              />
            </h3>
            <h3 className=' overflow-hidden text-[2.3rem] font-black uppercase'>
              <TextSplitterUltra
                className='inline-flex'
                textIn={String(clickNum).padStart(8, '0')}
                spanRole='heading'
                level={3}
                charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
              />
            </h3>
          </div>
          <div className='flex flex-row overflow-hidden'>
            <SocialIconNavSplitterUltra
              boxItems={socialItems}
              hxw='basis-1/5 min-h-14 min-w-14 bg-black/80 backdrop-blur-md'
              animClass=' motion-safe:animate-upDog motion-safe:[transform:_translateY(140%)]'
            />
          </div>
        </div>
      )}
    </>
  );
}
