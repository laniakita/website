'use client';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useHajClickerStore } from '@/providers/hajclicker-store-provider';
import TextSplitterUltra from '@/components/text-splitter-v2';
import { MAIN_SITE_URL } from '@/lib/constants';

export default function CounterOverlayMin({ model }: { model: string }) {
  const [isPlayWarn, setIsPlayWarn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { clickNum } = useHajClickerStore((state) => state);

  const createQueryString = useCallback(
    (key: string, val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, val);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <>
      <Suspense>
        {searchParams.get('play') === 'true' && (
          <>
            <div className='ctp-mocha text-ctp-text pointer-events-none absolute bottom-4 right-4 z-[2] flex w-fit touch-none flex-col items-end gap-2 -space-y-4 text-right lg:bottom-10 lg:right-10'>
              <p className='text-xl font-black uppercase'>{`${model} Clicker Counter`}</p>
              <p className='text-ctp-mauve text-3xl font-black'>{String(clickNum).padStart(11, '0')}</p>
            </div>
            <button
              type='button'
              onClick={() => {
                router.push(pathname);
              }}
              className='ctp-mocha border-ctp-surface0 bg-ctp-midnight hover:border-ctp-mauve hover:bg-ctp-mauve hover:text-ctp-base absolute left-4 top-4 z-[2] border px-4 py-1 backdrop-blur-sm lg:left-10 lg:top-10'
            >
              back
            </button>
          </>
        )}
      </Suspense>
      <Suspense>
        {!searchParams.get('play') && (
          <>
            {/* safety blur + play button + warn menu */}
            <div className='absolute inset-0 z-[1] h-full bg-black/30 backdrop-blur-xl' />
            {(isPlayWarn as unknown) === true && (
              <div className='bg-ctp-midnight/30 absolute inset-0 z-10 flex h-full items-center justify-center backdrop-blur-xl'>
                <div className='flex max-w-xs flex-col items-center justify-center gap-10 md:max-w-md'>
                  <div className='text-sm font-black uppercase md:text-base'>
                    {`EPILEPSY WARNING: Bot Clicker features flashing lights and sounds that may cause an epileptic seizure! Do not
                play Bot Clicker if you've ever been diagnosed with and or believe you might have EPILEPSY.`}
                  </div>
                  <div className='text-ctp-base flex w-full flex-row items-center justify-between gap-4'>
                    <button
                      onClick={(): void => {
                        setIsPlayWarn(false);
                        router.push(`${pathname}?${createQueryString('play', 'true')}`, { scroll: false });
                      }}
                      type='button'
                      className='border-ctp-surface0 bg-ctp-green/80 hover:bg-ctp-green w-full rounded-full border py-2'
                    >
                      Play Bot Clicker
                    </button>
                    <button
                      onClick={() => {
                        setIsPlayWarn(false);
                      }}
                      type='button'
                      className='border-ctp-surface0 bg-ctp-red/80 hover:bg-ctp-red w-full rounded-full border py-2'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className='ctp-mocha text-ctp-text absolute bottom-4 right-4 z-[2] flex flex-col items-end gap-4 lg:bottom-10 lg:right-10'>
              <button
                onClick={() => {
                  setIsPlayWarn(true);
                }}
                type='button'
                className='animate-fade-in border-ctp-surface0 bg-ctp-midnight/80 text-ctp-mauve hover:border-ctp-mauve w-full rounded-full border py-2 font-mono text-lg capitalize opacity-0 backdrop-blur-md'
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
                <h3 className='text-ctp-red overflow-hidden text-3xl font-black uppercase'>
                  <TextSplitterUltra
                    className='inline-flex'
                    textIn={String(clickNum).padStart(11, '0')}
                    spanRole='heading'
                    level={3}
                    charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
                  />
                </h3>
              </div>
            </div>
          </>
        )}
        <div className='ctp-mocha absolute bottom-4 left-4 z-[2] lg:bottom-10 lg:left-10'>
          <Link target='_blank' href={`${MAIN_SITE_URL}/credits/bot-clicker`} className='underline'>
            Credits
          </Link>
        </div>
      </Suspense>
    </>
  );
}
