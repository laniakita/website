'use client';

import { usePathname } from 'next/navigation';
import { type Dispatch, type SetStateAction, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';
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
  const id = useId();
  const linkId = `toc-link${id}`

  return (
    <li key={node.id}>

      <p
        className='group'
      >
        <a
          id={linkId}
          aria-label={`Jump to: ${node.title}`}
          href={`${pathname}#${node.id}`}
          className={`border-b border-ctp-overlay0/20 inline-block w-full py-1 group-hover:bg-ctp-blue/20 ${activeId === node.id ? 'bg-ctp-blue/20' : ''} transition-[background-color] duration-300`}
        >
          <span
            aria-labelledby={linkId}
            className={`w-full pointer-events-none inline-block pr-[2ch] [&>code]:pretty-inline-code font-mono text-sm leading-relaxed font-semibold text-balance group-hover:text-ctp-text group-hover:underline link-color-trans ${activeId === node.id ? 'text-ctp-text underline' : 'text-ctp-subtext0'} break-words ${MD_MAX_TOC_WIDTH} ${LG_MAX_TOC_WIDTH}`}
            style={{ paddingLeft: `${marginLeft ?? 2}ch` }}
            dangerouslySetInnerHTML={{ __html: node.title }}
          />

        </a>
      </p>

      <ul className='list-none'>
        {node.children
          ? node.children.map((childNode) => (
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

export const concatHeadingUtil = (concat = 0, heading: string, innerWidth: number) => {
  if (!heading) return;
  if (!innerWidth) return;

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
  } else {
    concat = 100;
  }

  // utils
  const re = /(?=>(?<innerText>[^<]+))/;

  const spaceEscape = '&nbsp;'
  const escapeSpaces = (text: string) => {
    return text.split(' ').join(spaceEscape);
  }
  const escapeCounter = (text: string | null, escapeStr: string): number => {
    if (!text) return 0;
    const re = new RegExp(escapeStr, 'g');
    return text.match(re)?.length ?? 0;
  }

  if (heading.length > concat) {
    const found = heading.match(re);
    const foundInnerText = found?.groups?.innerText
    const headingWithEscapedHTML = foundInnerText ? heading.replace(foundInnerText, escapeSpaces(foundInnerText)) : heading;

    let lastWord;
    let lastHtmlWord: RegExpMatchArray | null = null;

    const headingActualArr = headingWithEscapedHTML?.split(' ').map((word) => {
      const found = word.match(re);
      lastHtmlWord = found;
      return found?.groups?.innerText ?? word
    });

    const headingActual = headingActualArr.join(' ');
    const escapedLen = escapeCounter(headingActual, spaceEscape) * spaceEscape.length;

    while (headingActualArr.join(' ').length - escapedLen > concat) {
      lastWord = headingActualArr.pop();
    }

    if (lastWord) {
      const finalWord = (headingArr: string[], spaceEscape: string, lastWord: string, lastHtmlWord: RegExpMatchArray | null) => {
        const almostTitleLen = headingArr.join(' ').length;
        const lastWordCopy = lastWord.replace(spaceEscape, ' ').split('');
        while (almostTitleLen + lastWordCopy.length > concat) {
          lastWordCopy.pop();
        }
        lastWordCopy.splice(-1, 1, '...');
        return lastHtmlWord?.input?.replace(lastWord, lastWordCopy.join('')) ?? lastWordCopy.join('')
      }

      headingActualArr.push(finalWord(headingActualArr, spaceEscape, lastWord, lastHtmlWord));

      return headingActualArr.join(' ').replace(spaceEscape, ' ');

    }

  }

  return heading;
};

export type FlatHeadingNode = {
  id: string;
  title: string;
}

export function ConcatTitle({
  activeId,
  headings,
  innerWidth,
}: {
  activeId: string;
  headings: FlatHeadingNode[];
  innerWidth: number;
}) {
  const activeHeading = headings?.find((heading) => heading.id === activeId)?.title ?? headings[0]?.title;
  const [concatSize, setConcatSize] = useState(0);
  const concatRef = useRef<HTMLElement>(null!);

  useEffect(() => {
    const box = concatRef?.current?.getClientRects();
    console.log(innerWidth - (16*4));
    console.log(box[0] && box[0]?.x + box[0]?.width);
  }, [activeId, innerWidth])

  const concat = useMemo(() => concatHeadingUtil(concatSize, activeHeading ?? '', innerWidth), [concatSize, activeHeading, innerWidth]);
  if (concat) {
    return <strong ref={concatRef} className='[&>code]:pretty-inline-code overflow-clip' dangerouslySetInnerHTML={{ __html: concat }} />;
  }
  return <strong>{activeHeading}</strong>
}
