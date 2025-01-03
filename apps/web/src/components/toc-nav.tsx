'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLiveReload } from './mdx/useLiveReload';

const MED_SCREEN = 768; // px

const Z_FOLD_SCREEN = 344;
const IPHONE_SE_SCREEN = 375;
//const PIXEL_SEVEN_SCREEN = 412;
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

const useHeadingsDataPre = () => {
  const [flatHeadings, setFlatHeadings] = useState<HTMLHeadingElement[]>();
  const nestedHeadings = useMemo(() => getNestedHeadings(flatHeadings ?? [], 2), [flatHeadings]);

  useEffect(() => {
    // filtering by id length excises the sub-headline from the array
    if (!flatHeadings) {
      const headingEls = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6')).filter((el) => el.id.length > 0);
      setFlatHeadings(headingEls as HTMLHeadingElement[]);
    }
  }, [flatHeadings, setFlatHeadings]);
  return nestedHeadings;
};

const useHeadingsData = () => {
  const nested = useHeadingsDataPre();

  const [nestedHeadings, setNestedHeadings] = useState<HeadingNode[]>();

  useEffect(() => {
    const titleEl = document.querySelector('h1');
    const titleNode: HeadingNode = {
      id: titleEl?.id ?? '#',
      level: 1,
      title: titleEl?.innerText ?? '',
      children: [],
    };

    setNestedHeadings([titleNode, ...nested]);
  }, [nested]);

  return { nestedHeadings };
};

function HeadingNode({ node, activeId }: { node: HeadingNode; activeId: string }) {
  //console.log('nodeid:', node.id, 'activeId:', activeId);
  const router = useRouter();
  //const params = useParams();
  const pathname = usePathname();
  const pushHash = () => {
    router.push(`${pathname}#${node.id}`)
    //console.log(`${pathname}#${node.id}`)
  };
  return (
    <li key={node.id}>
      <p className='text-balance'>
        <button
          onClick={pushHash}
          className={`text-balance text-left font-mono text-sm leading-relaxed text-ctp-subtext0 hover:font-bold hover:text-ctp-text ${activeId === node.id ? 'font-bold text-ctp-text underline' : ''} md:max-w-xs md:break-words lg:max-w-sm lg:break-keep`}
        >
          {node.title}
        </button>
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
      {tree?.map((heading) => <HeadingNode key={heading.id} node={heading} activeId={activeId} />)}
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

const getFlatHeadings = () => {
  if (!window) return;
  const headingsQuery = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  return headingsQuery ?? [];
};

const concatHeadingUtil = (heading: string) => {
  if (!heading) return;
  if (!window.innerWidth) return;

  const concatHeading = heading.split('');

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
    ;
  }

  if (heading.length > concat) {
    while (concatHeading.length > concat) {
      // concat
      concatHeading.pop();
    }
    concatHeading.splice(-1, 1, '...');
  }

  return concatHeading.join('');
};

function ConcatTitle({ activeId, headings }: { activeId: string; headings: HTMLHeadingElement[] }) {
  const activeHeading = headings?.find((heading) => heading.id === activeId)?.innerText;
  const concat = useMemo(() => concatHeadingUtil(activeHeading ?? ''), [activeHeading]);
  return <>{concat}</>;
}

export default function ToCMenu() {
  const [activeId, setActiveId] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(0);
  const [flatHeadings, setFlatHeadings] = useState<HTMLHeadingElement[]>([]);
  const { nestedHeadings } = useHeadingsData();

  useIntersectionObserver(setActiveId, activeId);
  //console.log('currently active should be:', activeId);

  const dropToCRef = useRef<HTMLDivElement>(null!);

  const handleToCOffClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if ((e.target as Node).nodeName === 'BUTTON') {
      // do nothing
    } else if (dropToCRef?.current?.contains(e.target as Node)) {
      if ('href' in (e.target as HTMLAnchorElement).attributes) {
        // assume link in menu
        setShowMobileMenu(false);
      }
      // do nothing
    } else {
      setShowMobileMenu(false);
    }
  }, []);

  const concatDynamic = useCallback((input: string | undefined) => {
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
  }, []);

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

    if (width !== 0 && width < MED_SCREEN) {
      setIsMobile(true);
      //const currTitle = flatHeadings.find((el) => el.id === activeId)?.innerText;
      //const concatRes = concatDynamic(currTitle);
      //setConcatTitle(concatRes ?? '');
    } else {
      setIsMobile(false);
    }

    //window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleToCOffClick);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleToCOffClick);
      document.removeEventListener('resize', handleResize);
      //document.removeEventListener('resize', handleResize);
    };
  }, [handleToCOffClick, concatDynamic, setFlatHeadings, activeId, flatHeadings, width]);

  return (
    <>
      {isMobile ? (
        <>
          <div
            className={`motion-safe:simple-color-trans sticky top-16 z-30 flex w-full flex-row items-center md:hidden ${showMobileMenu ? 'bg-ctp-base/90 dark:bg-ctp-midnight/80' : 'bg-ctp-base/80 dark:bg-ctp-midnight/50'}`}
          >
            <div className='relative flex size-full h-12 flex-row items-center gap-4 px-6'>
              <div className='pointer-events-none absolute inset-0 h-[200%] [backdrop-filter:_blur(8px)_brightness(95%)_saturate(160%)] [mask-image:_linear-gradient(to_bottom,_black_0%_50%,_transparent_50%_100%)]' />
              <div className='pointer-events-none absolute inset-0 h-full bg-ctp-base/10 [backdrop-filter:_blur(8px)_brightness(140%)_saturate(120%)] [background:_hsl(0deg_0%_100%_/_0.1)] [mask-image:_linear-gradient(to_bottom,_black_0_3px,_transparent_3px)] [transform:_translateY(100%)]' />
              <button
                className={`link-color-trans ${showMobileMenu ? 'font-bold text-ctp-text underline' : ''} z-40 -m-1.5 flex items-center whitespace-pre font-mono text-sm text-ctp-subtext0 hover:font-bold hover:text-ctp-text hover:underline`}
                onClick={() => {
                  setShowMobileMenu(!showMobileMenu);
                }}
              >
                <span
                  className={`${showMobileMenu ? '[transform:_rotate(90deg)_translate3d(-0.1rem,-0.2ch,0px)]' : '[transform:_translate3d(0.0rem,0.0ch,0px)]'} icon-[ph--caret-right-bold] pointer-events-none mr-[0.5ch] w-[2ch] text-xl [transition:_transform_0.3s]`}
                />
                On this page
              </button>

              <p className='z-40 flex flex-row items-center gap-[1ch] overflow-x-hidden whitespace-pre font-mono text-sm'>
                <span className='icon-[ph--caret-double-right-bold] min-w-[2ch] text-xl text-ctp-subtext0' />
                <span className='font-bold'>
                  <ConcatTitle headings={flatHeadings} activeId={activeId} />
                </span>
              </p>
            </div>
          </div>

          <div
            className={`${showMobileMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-x-0 bottom-0 top-28 z-20 flex size-full h-[calc(100dvh-3.9rem)] max-h-[calc(100dvh-7rem)] w-full flex-col justify-start bg-black/40 [perspective:_5px] [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:_opacity_0.3s,] md:top-[3.8rem] md:max-h-[calc(100dvh-3.8rem)] lg:bottom-0`}
          >
            <nav
              aria-label='Table of contents'
              ref={dropToCRef}
              className={`${showMobileMenu ? 'opacity-100 [transform:translate3d(0%,0%,0px)]' : 'pointer-events-none opacity-0 [transform:translate3d(0%,-100%,-0.01rem)]'} inset-x-0 bottom-0 top-28 z-20 max-h-[calc(100vh-7rem)] w-full overflow-auto rounded-b-2xl border-b border-ctp-pink bg-ctp-base/90 px-6 py-10 backdrop-blur-md [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.8s,_opacity_0.5s,_background-color_0.8s] md:hidden dark:border-ctp-sky dark:bg-ctp-midnight/90`}
            >
              <Headings tree={nestedHeadings ?? []} activeId={activeId} />
            </nav>
          </div>
        </>
      ) : (
        <div className='motion-safe:simple-color-trans sticky top-16 hidden h-screen max-h-[calc(100vh-4rem)] w-full min-w-72 max-w-sm items-start justify-center overflow-y-auto bg-ctp-base/20 py-10 text-slate-100 shadow-xl md:flex dark:bg-ctp-base/20'>
          <nav aria-label='Table of contents' className='w-full px-4'>
            <Headings tree= {nestedHeadings ?? []} activeId={activeId} />
          </nav>
        </div>
      )}
    </>
  );
}
