'use client';
import dynamic from 'next/dynamic';
import { AnimatePresence, } from 'motion/react'
import { IPAD_TOC_ID, NAV_MAIN_ID, TOC_NAV_ID } from '@/components/nav-constants';
import { useNavScrollViewStore } from '@/providers/nav-scroll-view-store-provider';
import { useToCViewStore } from '@/providers/toc-view-store-provider';
import { useCallback, useEffect, useRef, useState } from 'react';
import {  type HeadingNode, useIntersectionObserver } from './utils';

const Headings = dynamic(() => import('./utils').then((mod) => mod.Headings), { ssr: false });
const ConcatTitle = dynamic(() => import('./utils').then((mod) => mod.ConcatTitle), { ssr: false });

export type ToCMenuCoreProps = {
  nestedHeadings: HeadingNode[];
  flatHeadings: { id: string; content: string }[];
};

export default function ToCMenuCore(props: ToCMenuCoreProps) {
  const [activeId, setActiveId] = useState('');
  const { tocInView, setToCNotInView } = useToCViewStore((state) => state);
  const [hasAnimated, setHasAnimated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null!);
  useIntersectionObserver(setActiveId, activeId);

  return (
    <nav
      id={IPAD_TOC_ID}
      className={`${tocInView ? 'min-w-80 md:w-80 lg:w-96 lg:min-w-96' : 'w-0 min-w-0'} sticky top-0 hidden max-h-dvh overflow-x-hidden overflow-y-auto border-r border-ctp-mauve/50 bg-ctp-crust text-slate-100 shadow-xl motion-safe:[transition:width_0.8s,min-width_0.8s,background-color_0.5s] md:block dark:bg-ctp-base/20`}
    >
      <div className='sticky top-0 z-10 flex min-h-16 w-full flex-row items-center justify-start text-ctp-text'>
        <div id='nav-mask-bg' className='nav-glassy-bg' />
        <div id='nav-mask-edge' className='nav-glassy-edge' />
        <button
          aria-expanded='false'
          aria-controls={IPAD_TOC_ID}
          onClick={() => {
            setToCNotInView();
            localStorage.setItem('toc-state-pref', 'closed');
            setHasAnimated(true);
          }}
          className='ml-4 icon-[ph--sidebar-simple-fill] min-h-[3ch] min-w-[3ch]'
        />
      </div>

      <div ref={menuRef} aria-label='Table of contents' className='min-w-80 lg:min-w-96'>
        <AnimatePresence>
          {tocInView && <Headings
            tree={props.nestedHeadings}
            activeId={activeId}
            ariaExpanded={tocInView}
            notMobile
            hasAnimated={hasAnimated}
          />}
        </AnimatePresence>
      </div>
    </nav>

  );
}

export function ToCMenuMobileCore(props: ToCMenuCoreProps) {
  // common
  const [activeId, setActiveId] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  useIntersectionObserver(setActiveId, activeId);

  // mobile only
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [width, setWidth] = useState(0);
  const { inView } = useNavScrollViewStore((state) => state);
  const dropToCRef = useRef<HTMLDivElement>(null!);
  const mainToCRef = useRef<HTMLElement>(null!);

  const handleToCOffClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const navbar = document.getElementById(NAV_MAIN_ID);
    if ((e.target as HTMLElement).id === 'show-hide-table-of-contents-button-mobile') {
      // do nothing
    } else if (dropToCRef?.current?.contains(e.target as Node) && (e.target as Node)?.nodeName !== 'BUTTON') {
      // do nothing
    } else if (
      mainToCRef?.current?.contains(e.target as Node) &&
      (e.target as Node)?.nodeName !== 'BUTTON' &&
      (e.target as HTMLElement).id !== 'toc-offclick-bg'
    ) {
      // do nothing
    } else if (navbar?.contains(e.target as Node)) {
      // do nothing
    } else {
      setShowMobileMenu(false);
    }
  }, []);


  useEffect(() => {
    
    function handleResize() {
      if (width == window.innerWidth) return;
      setWidth(window.innerWidth);
    }

    if (width === 0) {
      handleResize();
    }

    document.addEventListener('click', handleToCOffClick);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleToCOffClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleToCOffClick, props.flatHeadings, width]);

  return (
    <nav
      ref={mainToCRef}
      id={TOC_NAV_ID}
      className={`sticky top-16 z-20 block md:hidden ${inView ? 'translate-y-0' : '-translate-y-16'} duration-300 motion-safe:transition-transform`}
    >
      <div
        className={`absolute z-30 flex w-full flex-row items-center ${showMobileMenu ? 'bg-ctp-base/90 dark:bg-ctp-midnight/80' : 'bg-ctp-base/80 dark:bg-ctp-midnight/50'}`}
      >
        <div className='relative z-[35] flex size-full h-12 flex-row items-center gap-4 px-6'>
          <div className='nav-glassy-bg' />
          <div className='nav-glassy-edge' />
          <button
            aria-expanded={showMobileMenu}
            aria-controls={TOC_NAV_ID}
            id={'show-hide-table-of-contents-button-mobile'}
            className={`link-color-trans ${showMobileMenu ? 'text-ctp-pink underline' : ''} z-40 -m-1.5 flex items-center font-mono text-sm whitespace-pre text-ctp-subtext0 hover:text-ctp-pink hover:underline`}
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              setTimeout(() => {
                setHasAnimated(true);
              }, 3050);
            }}
          >
            <span
              className={`${showMobileMenu ? '[transform:_rotate(90deg)_translate3d(-0.1rem,-0.2ch,0px)]' : '[transform:_translate3d(-0.1rem,0.0ch,0px)]'} pointer-events-none mr-[0.5ch] icon-[ph--caret-right-bold] w-[2ch] text-xl [transition:_transform_0.3s]`}
            />
            On this page
          </button>

          <p className='z-40 flex flex-row items-center gap-[1ch] overflow-x-hidden font-mono text-sm whitespace-pre'>
            <span className='icon-[ph--caret-double-right-bold] min-w-[2ch] text-xl text-ctp-subtext0' />
            <ConcatTitle headings={props.flatHeadings} activeId={activeId} innerWidth={width} />
          </p>
        </div>
      </div>

      <div
        id='toc-offclick-bg'
        className={`${showMobileMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute inset-x-0 top-12 bottom-0 z-20 size-full h-dvh flex-col justify-start bg-black/40 duration-300 [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] [perspective:_5px] motion-safe:transition-[opacity]`}
      >
        <div
          aria-label='Table of contents'
          ref={dropToCRef}
          className={`${showMobileMenu ? '[transform:translate3d(0%,0%,0px)] opacity-100' : 'pointer-events-none [transform:translate3d(0%,-100%,-0.01rem)] opacity-0'} inset-x-0 top-28 bottom-0 z-20 max-h-[calc(100dvh-7rem)] w-full overflow-auto rounded-b-2xl border-b border-ctp-pink bg-ctp-base/90 py-10 backdrop-blur-md [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.8s,_opacity_0.5s,_background-color_0.8s] dark:border-ctp-sky dark:bg-ctp-midnight/90`}
        >
          <AnimatePresence>
            {showMobileMenu && <Headings
              tree={props.nestedHeadings}
              activeId={activeId}
              ariaExpanded={showMobileMenu}
              notMobile
              hasAnimated={hasAnimated}
            />}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
