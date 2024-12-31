'use client';

import Link from 'next/link';
import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

const MED_SCREEN = 768; // px

const Z_FOLD_SCREEN = 344;
const IPHONE_SE_SCREEN = 375;
const PIXEL_SEVEN_SCREEN = 412;
const IPHONE_FOURTEEN_PRO_MAX = 430;
const WEIRD_PHABLET = 500;
const SMALL_SCREEN_MAX = 600;

// inspired by Emma Goto React ToC: https://www.emgoto.com/react-table-of-contents

export interface HeadingNode {
  id: string;
  level: number;
  title: string;
  children: HeadingNode[];
}

const getNestedHeadings = (headings: HTMLHeadingElement[], level: number): HeadingNode[] => {
  const nestedTree: HeadingNode[] = [];
  let currNode: HeadingNode = {
    id: '',
    level: 0,
    title: '',
    children: [],
  };

  while (headings.length > 0) {
    const currHeading = headings[0]!;
    const headingLevel = parseInt(currHeading.nodeName[1]!);
    if (headingLevel === level) {
      currNode = {
        id: currHeading.id ?? '',
        level: parseInt(currHeading.nodeName[1]!),
        title: currHeading.innerText ?? '',
        children: [],
      };
      nestedTree.push(currNode);
      headings.shift();
    } else if (headingLevel > level) {
      if (currNode) {
        currNode.children = getNestedHeadings(headings, headingLevel);
      }
    } else {
      break;
    }
  }
  return nestedTree;
};

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<HeadingNode[]>([]);

  useEffect(() => {
    const titleEl = document.querySelector('h1');
    const titleNode: HeadingNode = {
      id: titleEl?.id ?? '#',
      level: 1,
      title: titleEl?.innerText ?? '',
      children: [],
    };

    // filtering by id length excises the sub-headline from the array
    const headingEls = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6')).filter((el) => el.id.length > 0);

    const nested = getNestedHeadings(headingEls as HTMLHeadingElement[], 2);

    setNestedHeadings([titleNode, ...nested]);
  }, []);

  return { nestedHeadings };
};

function HeadingNode({ node, activeId }: { node: HeadingNode; activeId: string }) {
  //console.log('nodeid:', node.id, 'activeId:', activeId);
  return (
    <li key={node.id}>
      <p className='text-balance'>
        <Link
          href={`#${node.id}`}
          className={`text-balance font-mono text-sm leading-relaxed text-ctp-subtext0 hover:font-bold hover:text-ctp-text ${activeId === node.id ? 'font-bold text-ctp-text underline' : ''} md:max-w-xs md:break-words lg:max-w-sm lg:break-keep`}
        >
          {node.title}
        </Link>
      </p>
      <ul className='list-none pl-[2ch]'>
        {node.children
          ? node.children.map((childNode) => <HeadingNode key={childNode.id} node={childNode} activeId={activeId} />)
          : null}
      </ul>
    </li>
  );
}

function Headings({ tree, activeId }: { tree: HeadingNode[]; activeId: string }) {
  return (
    <ul className='list-none leading-relaxed'>
      {tree.map((heading) => (
        <HeadingNode key={heading.id} node={heading} activeId={activeId} />
      ))}
    </ul>
  );
}

const useIntersectionObserver = (setActiveId: Dispatch<SetStateAction<string>>, activeId: string) => {
  const headingElsRef = useRef<Record<string, IntersectionObserverEntry>>({});

  useEffect(() => {
    const callback = (headings: IntersectionObserverEntry[]) => {
      //console.log('running callback with', headings)

      headingElsRef.current = headings.reduce<Record<string, IntersectionObserverEntry>>((map, headingEl) => {
        //console.log('current map:', map)
        map[headingEl.target.id] = headingEl;
        return map;
      }, headingElsRef.current);

      const visibleHeadings: IntersectionObserverEntry[] = [];
      //console.log('current visible headings:', visibleHeadings)

      if (headingElsRef.current) {
        //console.log('current ref inside object-keys:', headingElsRef.current);
        Object.keys(headingElsRef.current).forEach((key) => {
          const headingEl = headingElsRef.current[key];
          if (headingEl?.isIntersecting) visibleHeadings.push(headingEl);
          //console.log('current visible headings after push:', visibleHeadings)
        });
      }

      const getIndexFromId = (id: string): number => {
        //console.log('searching for index with id:', id);
        return headingEls.findIndex((heading) => heading.id === id);
      };

      if (visibleHeadings.length === 0) {
        //console.log('visbile heading length === 0');

        const activeElement = headingEls.find((el) => el.id === activeId);
        const activeIndex = headingEls.findIndex((el) => el.id === activeId);

        const activeIdYcoord = activeElement?.getBoundingClientRect().y;
        if (activeIdYcoord && activeIdYcoord > 150 && activeIndex !== 0) {
          setActiveId(headingEls[activeIndex - 1]!.id);

          //console.log('active id set:', headingEls[activeIndex - 1]!.id);
        }
      } else if (visibleHeadings.length === 1) {
        //console.log('visbile heading length === 1');
        setActiveId(visibleHeadings[0]!.target.id);
        //console.log('active id set:', visibleHeadings[0]!.target.id);
      } else if (visibleHeadings.length > 1) {
        //console.log('visbile heading length > 0');
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id),
        );
        setActiveId(sortedVisibleHeadings[0]!.target.id);
        //console.log('active id set:', sortedVisibleHeadings[0]!.target.id);
      }
    };

    const DESKTOP_TABLET_TOP_TOTAL = '-72px'; // 3.8 rem base 16px font +/- 72px
    const MOBILE_MENU_TOP_TOTAL = '-112px'; // 7 rem base 16px font +/- 112px

    const observer = new IntersectionObserver(callback, {
      rootMargin: `${window.innerWidth < MED_SCREEN ? MOBILE_MENU_TOP_TOTAL : DESKTOP_TABLET_TOP_TOTAL} 0px -40% 0px`,
    });

    const headingEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    headingEls.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [setActiveId, activeId]);
};

export default function ToCMenu() {
  const [activeId, setActiveId] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [flatHeadings, setFlatHeadings] = useState<HTMLHeadingElement[]>([]);
  const [concatTitle, setConcatTitle] = useState('');

  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId, activeId);
  //console.log('currently active should be:', activeId);

  const dropToCRef = useRef<HTMLDivElement>(null!);

  const handleToCOffClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if ((e.target as Node).nodeName === 'BUTTON') {
        // do nothing
      } else if (dropToCRef.current.contains(e.target as Node)) {
        if ('href' in (e.target as HTMLAnchorElement).attributes) {
          // assume link in menu
          setShowMobileMenu(false);
        }
        // do nothing
      } else {
        setShowMobileMenu(false);
      }
    },
    [showMobileMenu],
  );

  const concatDynamic = (input: string | undefined) => {
    if (!input) return;
    if (!window.innerWidth) return;

    const newInput = input.split('');

    let concat = 0;

    if (window.innerWidth <= Z_FOLD_SCREEN) {
      concat = 12;
    } else if (window.innerWidth <= 360) {
      concat = 14;
    } else if (window.innerWidth <= IPHONE_SE_SCREEN) {
      concat = 15;
    } else if (window.innerWidth <= 390) {
      concat = 17;
    } else if (window.innerWidth <= 414) {
      concat = 20;
    } else if (window.innerWidth <= IPHONE_FOURTEEN_PRO_MAX) {
      concat = 22;
    } else if (window.innerWidth <= WEIRD_PHABLET) {
      concat = 28;
    } else if (window.innerWidth <= SMALL_SCREEN_MAX) {
      concat = 33;
    } else if (window.innerWidth <= MED_SCREEN) {
      concat = 45;
    }

    if (input.length > concat) {
      while (newInput.length > concat) {
        // concat
        newInput.pop();
      }
      newInput.splice(-1, 1, '...');
    }

    return newInput.join('');
  };

  useEffect(() => {
    const headingsQuery = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    if (flatHeadings.length <= 0) {
      setFlatHeadings(headingsQuery);
    }
    function handleResize() {
      const currTitle = flatHeadings.find((el) => el.id === activeId)?.innerText;
      const concatRes = concatDynamic(currTitle);
      setConcatTitle(concatRes ?? '');
    }
    if (window.innerWidth < MED_SCREEN) {
      handleResize();
    }

    //window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleToCOffClick);
    return () => {
      document.removeEventListener('click', handleToCOffClick);
      //document.removeEventListener('resize', handleResize);
    };
  }, [handleToCOffClick, concatDynamic, setFlatHeadings, flatHeadings]);

  return (
    <>
      <div className='simple-color-trans sticky top-16 hidden h-screen max-h-[calc(100vh-4rem)] w-full min-w-72 max-w-[24rem] items-start justify-center overflow-y-auto bg-ctp-base/20 py-10 text-slate-100 md:flex dark:bg-ctp-base/20'>
        <nav aria-label='Table of contents' className='w-full px-4'>
          <Headings tree={nestedHeadings} activeId={activeId} />
        </nav>
      </div>

      <div className='simple-color-trans sticky top-16 z-30 flex h-12 w-full flex-row items-center gap-4 overflow-x-hidden border-b border-ctp-surface0 bg-ctp-base/50 px-6 backdrop-blur-sm md:hidden dark:bg-ctp-midnight/50'>
        <button
          className={`link-color-trans ${showMobileMenu ? 'font-bold text-ctp-text underline' : ''} -m-1.5 flex items-center whitespace-pre font-mono text-sm text-ctp-subtext0 hover:font-bold hover:text-ctp-text hover:underline`}
          onClick={() => {
            setShowMobileMenu(!showMobileMenu);
          }}
        >
          <span
            className={`${showMobileMenu ? '[transform:_rotate(90deg)_translate3d(-0.05rem,-0.3rem,0px)]' : ''} icon-[ph--caret-right-bold] mr-[1ch] text-xl [transition:_transform_0.3s]`}
          />
          On this page
        </button>
        <p className='flex flex-row items-center gap-[1ch] overflow-x-hidden whitespace-pre font-mono text-sm'>
          <span className='icon-[ph--caret-double-right-bold] min-w-[2ch] text-xl text-ctp-subtext0' />
          <span className='font-bold'>{concatTitle}</span>
        </p>
      </div>

      <div
        className={`${showMobileMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-x-0 bottom-0 top-28 z-20 flex size-full h-[calc(100dvh-3.9rem)] max-h-[calc(100dvh-7rem)] w-full flex-col justify-start bg-black/40 [perspective:_5px] [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:_opacity_0.3s,] md:top-[3.8rem] md:max-h-[calc(100dvh-3.8rem)] lg:bottom-0`}
      >
        <nav
          aria-label='Table of contents'
          ref={dropToCRef}
          className={`${showMobileMenu ? 'opacity-100 [transform:translate3d(0%,0%,0px)]' : 'pointer-events-none opacity-0 [transform:translate3d(0%,-100%,-0.01rem)]'} inset-x-0 bottom-0 top-28 z-20 max-h-[calc(100vh-7rem)] w-full overflow-auto rounded-b-2xl border-b border-ctp-pink bg-ctp-base/90 px-6 py-10 backdrop-blur-md [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.8s,_opacity_0.5s,_background-color_0.8s] md:hidden lg:hidden dark:border-ctp-sky dark:bg-ctp-midnight/90`}
        >
          <Headings tree={nestedHeadings} activeId={activeId} />
        </nav>
      </div>
    </>
  );
}
