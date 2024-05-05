'use client';
import { useState } from 'react';
import SocialIconNavSplitterUltra from '@/components/social-splitter-ultra';
import { useHajClickerStore } from '@/providers/hajclicker-store-provider';
import { socialItems } from './footer/footer';
import TextSplitterUltra from './text-splitter-v2';

export default function SocialCounterOverlay({ model }: { model: string }) {
  const { clickNum, addClickToCount } = useHajClickerStore((state) => state);
  const [isPlayWarn, setIsPlayWarn] = useState(false);

  return (
    <>
      {clickNum >= 1 && (
        <div className='ctp-mocha pointer-events-none absolute bottom-24 right-6 z-[2] flex w-fit touch-none flex-col items-end gap-2 -space-y-4 text-right  text-ctp-text md:right-10  lg:bottom-10'>
          <p className='text-xl font-black uppercase'>{`${model} Clicker Counter`}</p>
          <p className='text-3xl font-black text-ctp-mauve'>{String(clickNum).padStart(11, '0')}</p>
        </div>
      )}
      {clickNum < 1 && (
        <>
          <div className='fixed inset-0 z-[1] h-dvh bg-black/30 backdrop-blur-xl' />

          {(isPlayWarn as unknown) === true && (
            <div className='fixed inset-0 z-10 flex h-dvh items-center justify-center bg-black/30 backdrop-blur-xl'>
              <div className='flex max-w-xs flex-col items-center justify-center gap-10 md:max-w-md'>
                <div className='text-3xl font-black uppercase'>
                  {`EPILEPSY WARNING: Bot Clicker features flashing lights and sounds that may cause an epileptic seizure! Do not
                play Bot Clicker if you've ever been diagnosed with and or believe you have EPILEPSY.`}
                </div>
                <div className='flex w-full flex-row items-center justify-between gap-4 text-ctp-base'>
                  <button
                    onClick={() => {
                      setIsPlayWarn(false);
                      addClickToCount();
                    }}
                    type='button'
                    className='w-full rounded-full border border-ctp-surface0 bg-ctp-green/80 py-2 hover:bg-ctp-green'
                  >
                    Play Bot Clicker
                  </button>
                  <button
                    onClick={() => {
                      setIsPlayWarn(false);
                    }}
                    type='button'
                    className='w-full rounded-full border  border-ctp-surface0 bg-ctp-red/80 py-2 hover:bg-ctp-red'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className='ctp-mocha absolute bottom-20 right-6 z-[2] flex flex-col items-end gap-4 pb-4 text-ctp-text md:right-10 lg:bottom-10 lg:pb-0'>
            <button
              onClick={() => {
                setIsPlayWarn(true);
              }}
              type='button'
              className='w-full animate-fade-in rounded-full border border-ctp-surface0 bg-ctp-midnight/80 py-2 font-mono text-lg capitalize text-ctp-mauve opacity-0 backdrop-blur-md hover:border-ctp-mauve'
            >
              play bot clicker
            </button>
            <div className='pointer-events-none flex w-fit touch-none flex-col -space-y-2 text-right'>
              <h3 className='overflow-hidden text-xl font-black uppercase'>
                <TextSplitterUltra
                  className='inline-flex'
                  textIn={`${model} Clicker Counter`}
                  spanRole='heading'
                  level={3}
                  charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                />
              </h3>
              <h3 className='overflow-hidden text-3xl font-black uppercase text-ctp-red'>
                <TextSplitterUltra
                  className='inline-flex'
                  textIn={String(clickNum).padStart(11, '0')}
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
        </>
      )}
    </>
  );
}
