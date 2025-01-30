'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Dispatch, type SetStateAction, Suspense, useEffect, useMemo, useRef, useState } from 'react';
const MED_SCREEN = 768; // px

const Z_FOLD_SCREEN = 344;
const IPHONE_SE_SCREEN = 375;
//const PIXEL_SEVEN_SCREEN = 412;
const IPHONE_THIRTEEN_PRO_MAX = 428;
const IPHONE_FOURTEEN_PRO_MAX = 430;
const WEIRD_PHABLET = 500;
const SMALL_SCREEN_MAX = 600;

//const MD_TOC_WIDTH = 'md:w-80';
//const MD_MIN_TOC_WIDTH = 'md:min-w-80';
const MD_MAX_TOC_WIDTH = 'md:max-w-80';
//const LG_TOC_WIDTH = 'lg:w-96';
//const LG_MIN_TOC_WIDTH = 'lg:min-w-96';
const LG_MAX_TOC_WIDTH = 'lg:max-w-96';

// inspired by Emma Goto React ToC: https://www.emgoto.com/react-table-of-contents

export interface HeadingNode {
  id: string;
  level: number;
  title: string;
  children: HeadingNode[];
}

export const getNestedHeadings = (headings: HTMLHeadingElement[], level: number): HeadingNode[] => {
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

export const useHeadingsData = () => {
  const [flatHeadings, setFlatHeadings] = useState<HTMLHeadingElement[]>();
  const nestedHeadings = useMemo(() => getNestedHeadings(flatHeadings ?? [], 2), [flatHeadings]);

  useEffect(() => {
    // filtering by id length excises the sub-headline from the array
    const headingEls = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6')).filter((el) => el.id.length > 0);
    setFlatHeadings(headingEls as HTMLHeadingElement[]);
  }, []);
  return { nestedHeadings };
};

/*
const useHeadingsData = () => {
  const nested = useHeadingsDataPre();

  const [nestedHeadings, setNestedHeadings] = useState<HeadingNode[]>();
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(() => {
    setShouldRun(true);
  }, []);
  useEffect(() => {
    if (shouldRun) {
      const titleEl = document.querySelector('h1');
      const titleNode: HeadingNode = {
        id: titleEl?.id ?? '#',
        level: 1,
        title: titleEl?.innerText ?? '',
        children: [],
      };

      setNestedHeadings(nested);
    }
  }, [nested, shouldRun]);
  return { nestedHeadings };
}; */

export function HeadingNode({
  node,
  activeId,
  marginLeft,
}: {
  node: HeadingNode;
  activeId: string;
  marginLeft?: number;
}) {
  const pathname = usePathname();

  return (
    <li key={node.id}>
      <Link
        aria-label={`Jump to ${node.title}`}
        href={`${pathname}#${node.id}`}
        className={`group font-mono text-sm leading-relaxed font-semibold text-balance link-color-trans hover:text-ctp-text hover:underline ${activeId === node.id ? 'text-ctp-text underline' : 'text-ctp-subtext0'} break-words`}
      >
        <p
          className={`w-full border-b border-ctp-overlay0/20 py-1 text-balance group-hover:bg-ctp-blue/20 ${activeId === node.id ? 'bg-ctp-blue/20' : ''} color-trans-2-quick`}
        >
          <span
            className={`inline-block pr-[2ch] ${MD_MAX_TOC_WIDTH} ${LG_MAX_TOC_WIDTH}`}
            style={{ paddingLeft: `${marginLeft ?? 2}ch` }}
          >
            {node.title}
          </span>
        </p>
      </Link>

      <ul className='list-none'>
        {node.children
          ? node.children.map((childNode, idx) => (
              <HeadingNode key={childNode.id} node={childNode} activeId={activeId} marginLeft={2 * node.level} />
            ))
          : null}
      </ul>
    </li>
  );
}

export function Headings({
  tree,
  activeId,
  ariaExpanded,
  hasAnimated,
  notMobile,
}: {
  tree: HeadingNode[];
  activeId: string;
  ariaExpanded: boolean;
  hasAnimated?: boolean;
  notMobile?: boolean;
}) {
  return (
    <Suspense>
      <menu
        aria-expanded={ariaExpanded}
        className={
          notMobile
            ? `${!hasAnimated && localStorage.getItem('toc-state-pref') !== 'closed' ? 'motion-safe:wipe-fade-in' : ''} list-none leading-relaxed`
            : `${!hasAnimated ? 'motion-safe:wipe-fade-in' : ''} list-none leading-relaxed`
        }
      >
        {tree?.map((heading) => <HeadingNode key={heading.id} node={heading} activeId={activeId} />)}
      </menu>
    </Suspense>
  );
}

export const useIntersectionObserver = (setActiveId: Dispatch<SetStateAction<string>>, activeId: string) => {
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

export const getFlatHeadings = () => {
  if (!window) return;
  const headingsQuery = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  return headingsQuery ?? [];
};

export const concatHeadingUtil = (heading: string, innerWidth: number) => {
  if (!heading) return;
  if (!innerWidth) return;

  const concatHeading = heading.split('');

  let concat = 0;

  // todo: figure out a math formula
  if (innerWidth <= Z_FOLD_SCREEN) {
    concat = 10;
  } else if (innerWidth <= 360) {
    concat = 12;
  } else if (innerWidth <= IPHONE_SE_SCREEN) {
    concat = 13;
  } else if (innerWidth <= 390) {
    concat = 15;
  } else if (innerWidth <= 414) {
    concat = 17;
  } else if (innerWidth <= IPHONE_THIRTEEN_PRO_MAX) {
    concat = 19;
  } else if (innerWidth <= IPHONE_FOURTEEN_PRO_MAX) {
    concat = 20;
  } else if (innerWidth <= WEIRD_PHABLET) {
    concat = 24;
  } else if (innerWidth <= SMALL_SCREEN_MAX) {
    concat = 28;
  } else if (innerWidth <= MED_SCREEN) {
    concat = 45;
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

export function ConcatTitle({
  activeId,
  headings,
  innerWidth,
}: {
  activeId: string;
  headings: HTMLHeadingElement[];
  innerWidth: number;
}) {
  const activeHeading = headings?.find((heading) => heading.id === activeId)?.innerText;
  const concat = useMemo(() => concatHeadingUtil(activeHeading ?? '', innerWidth), [activeHeading, innerWidth]);
  return <>{concat}</>;
}
