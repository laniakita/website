'use client';
import dynamic from 'next/dynamic';
import { ToCMenuCoreProps } from './core';

const ToCMenuMobileCore = dynamic(() => import('./core').then((mod) => mod.ToCMenuMobileCore), {ssr: false, loading: Fallback});

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
    </>
  );
}

export default function TableOfContentsMobile(props: ToCMenuCoreProps) {
  return <ToCMenuMobileCore nestedHeadings={props.nestedHeadings} flatHeadings={props.flatHeadings} />;
}
