'use client';
import { useToCViewStore } from '@/providers/toc-view-store-provider';
import dynamic from 'next/dynamic';

const ToCMenuCore = dynamic(() => import('./core'));

function Fallback() {
   return (
    <>
      <nav className='motion-safe:[transition:_transform_0.38s sticky top-16 z-20 translate-y-0 md:hidden'>
        <div className='absolute z-30 flex w-full flex-row items-center bg-ctp-base/80 md:hidden dark:bg-ctp-midnight/50'>
          <div className='relative z-[35] flex size-full h-12 flex-row items-center gap-4 px-6'>
            <div className='nav-glassy-bg' />
            <div className='nav-glassy-edge' />
          </div>
        </div>
      </nav>

      <div
        className={`md:w-80 md:min-w-[21rem] lg:w-96 lg:min-w-96' sticky top-0 hidden h-full overflow-x-hidden shadow-xl [transition:width_0.8s,min-width_0.8s] md:block bg-amber-100`}
      >
        <nav
          className='relative flex max-h-dvh min-h-dvh min-w-0 flex-col items-center justify-start gap-12 overflow-y-auto bg-ctp-crust pb-12 text-slate-100 motion-safe:simple-color-trans md:min-w-[21rem] lg:min-w-96 dark:bg-ctp-base/20'
        >
          <div className='sticky top-0 z-10 flex min-h-16 w-full flex-row items-center justify-start px-4 text-ctp-text'>
            <div id='nav-mask-bg' className='nav-glassy-bg' />
            <div id='nav-mask-edge' className='nav-glassy-edge' />
            <button className='icon-[ph--sidebar-simple-fill] text-3xl' />
          </div>
        </nav>
      </div>
    </>
  );
}

export default function TableOfContents() {
  return <ToCMenuCore />;
}
