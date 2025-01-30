'use client';
import { NAV_MAIN_ID, TOC_NAV_ID } from '@/components/nav-constants';
import { useNavScrollViewStore } from '@/providers/nav-scroll-view-store-provider';
import { useToCViewStore } from '@/providers/toc-view-store-provider';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { getFlatHeadings, HeadingNode, useHeadingsData, useIntersectionObserver } from './utils';
import dynamic from 'next/dynamic';
import { allPosts } from 'contentlayer/generated';
import { usePathname } from 'next/navigation';

const Headings = dynamic(() => import('./utils').then((mod) => mod.Headings), { ssr: false });
const ConcatTitle = dynamic(() => import('./utils').then((mod) => mod.ConcatTitle), { ssr: false });

export default function ToCMenuCore() {
  const [activeId, setActiveId] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  //const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(0);
  const [flatHeadings, setFlatHeadings] = useState<HTMLHeadingElement[]>([]);
  const { nestedHeadings } = useHeadingsData();
  const [readyHeadings, setReadyHeadings] = useState<HeadingNode[]>([]);
  const [isReady, setIsReady] = useState(false);
  useIntersectionObserver(setActiveId, activeId);
  //console.log('currently active should be:', activeId);
  const [hasAnimated, setHasAnimated] = useState(false);
  const dropToCRef = useRef<HTMLDivElement>(null!);
  const mainToCRef = useRef<HTMLElement>(null!);
  const { inView } = useNavScrollViewStore((state) => state);
  const { tocInView, setToCNotInView } = useToCViewStore((state) => state);

  const handleToCOffClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const navbar = document.getElementById(NAV_MAIN_ID);

    if ((e.target as HTMLElement).id === 'show-hide-table-of-contents-button-mobile') {
      // do nothing
    } else if (dropToCRef?.current?.contains(e.target as Node) && (e.target as Node)?.nodeName !== 'A') {
      // do nothing
    } else if (
      mainToCRef?.current?.contains(e.target as Node) &&
      (e.target as Node)?.nodeName !== 'A' &&
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
    if (nestedHeadings && nestedHeadings?.length > 1) {
      setReadyHeadings(nestedHeadings);
      setIsReady(true);
    }
  }, [nestedHeadings]);

  useEffect(() => {
    // grab headings on mount
    if (flatHeadings.length <= 0) {
      const headingsQuery = getFlatHeadings();
      setFlatHeadings(headingsQuery as HTMLHeadingElement[]);
    }

    function handleResize() {
      if (width == window.innerWidth) return;
      setWidth(window.innerWidth);
    }

    if (width === 0) {
      handleResize();
    }

    /*
    if (width !== 0 && width < MED_SCREEN) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }*/

    document.addEventListener('click', handleToCOffClick);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleToCOffClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [flatHeadings.length, handleToCOffClick, width]);

  return (
    <>
      <nav
        ref={mainToCRef}
        id={TOC_NAV_ID}
        className={`sticky top-16 z-20 md:hidden ${inView ? 'translate-y-0' : '-translate-y-16'} motion-safe:[transition:_transform_0.38s]`}
      >
        <div
          className={`absolute z-30 flex w-full flex-row items-center md:hidden ${showMobileMenu ? 'bg-ctp-base/90 dark:bg-ctp-midnight/80' : 'bg-ctp-base/80 dark:bg-ctp-midnight/50'}`}
        >
          <div className='relative z-[35] flex size-full h-12 flex-row items-center gap-4 px-6'>
            <div className='nav-glassy-bg' />
            <div className='nav-glassy-edge' />
            <button
              id={
                'show-hide-tabrEvent {isTrusted: true, pointerId: 51, width: 1, height: 1, pressure: 0, …}le-of-contents-button-mobile'
              }
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
              <span className='font-bold'>
                <ConcatTitle headings={flatHeadings} activeId={activeId} innerWidth={width} />
              </span>
            </p>
          </div>
        </div>

        <div
          id='toc-offclick-bg'
          aria-hidden={!showMobileMenu}
          className={`${showMobileMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute inset-x-0 top-12 bottom-0 z-20 size-full flex-col justify-start bg-black/40 [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] [perspective:_5px] motion-safe:[transition:_opacity_0.3s,]`}
        >
          <div
            aria-label='Table of contents'
            ref={dropToCRef}
            className={`${showMobileMenu ? '[transform:translate3d(0%,0%,0px)] opacity-100' : 'pointer-events-none [transform:translate3d(0%,-100%,-0.01rem)] opacity-0'} inset-x-0 top-28 bottom-0 z-20 max-h-[calc(100dvh-7rem)] w-full overflow-auto rounded-b-2xl border-b border-ctp-pink bg-ctp-base/90 py-10 backdrop-blur-md [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.8s,_opacity_0.5s,_background-color_0.8s] md:hidden dark:border-ctp-sky dark:bg-ctp-midnight/90`}
          >
            <Headings
              tree={readyHeadings}
              activeId={activeId}
              ariaExpanded={showMobileMenu}
              hasAnimated={hasAnimated}
            />
          </div>
        </div>
      </nav>

      <div
        aria-hidden={!tocInView}
        className={`${tocInView ? 'md:w-80 md:min-w-[21rem] lg:w-96 lg:min-w-96' : 'w-0 min-w-0'} sticky top-0 hidden h-full overflow-x-hidden shadow-xl [transition:width_0.8s,min-width_0.8s] md:block`}
      >
        <nav
          className={`relative flex max-h-dvh min-h-dvh min-w-0 flex-col items-center justify-start gap-12 overflow-y-auto bg-ctp-crust pb-12 text-slate-100 motion-safe:simple-color-trans md:min-w-80 lg:min-w-96 dark:bg-ctp-base/20`}
        >
          <div className='sticky top-0 z-10 flex min-h-16 w-full flex-row items-center justify-start px-4 text-ctp-text'>
            <div id='nav-mask-bg' className='nav-glassy-bg' />
            <div id='nav-mask-edge' className='nav-glassy-edge' />
            <button
              onClick={() => {
                setToCNotInView();
                localStorage.setItem('toc-state-pref', 'closed');
              }}
              className='icon-[ph--sidebar-simple-fill] text-3xl'
            />
          </div>

          <div aria-label='Table of contents' className={``}>
            <Headings tree={readyHeadings} activeId={activeId} ariaExpanded={isReady} notMobile />
          </div>
        </nav>
      </div>
    </>
  );
}
