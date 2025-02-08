'use client';

import dynamic from 'next/dynamic';

const BgTestV = dynamic(() => import('../../canvas/decor/bg-test-v').then((mod) => mod.BgTestV), { ssr: false });

export default function Exp() {
  return (
    <div className='@container relative -mt-16 flex h-dvh w-full items-end justify-start overflow-hidden'>
      <div className='absolute inset-0 z-[-1]'></div>
      <div className='relative inset-x-0 z-20 flex w-full border-t border-ctp-base bg-ctp-base/80 px-6 backdrop-blur-md color-trans-quick dark:border-ctp-text dark:bg-ctp-midnight/80'>
        <div className='m-auto flex w-fit flex-col gap-y-2 py-10 @3xl:w-full @3xl:max-w-5xl @3xl:flex-row @3xl:gap-x-10 @3xl:gap-y-0'>
          <div className='mx-auto @3xl:mx-0 @3xl:min-w-fit'>
            <p className='py-20 text-7xl'>hello</p>
          </div>
        </div>
      </div>
    </div>
  );
}
