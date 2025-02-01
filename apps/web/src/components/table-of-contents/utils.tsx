'use client';

import { TW_SPACING } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Dispatch, type SetStateAction, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';

export const MED_SCREEN = 768; // px
const MD_MAX_TOC_WIDTH = 'md:max-w-80';
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
        <Link
          id={linkId}
          aria-label={`Jump to: ${node.title}`}
          href={`${pathname}#${node.id}`}
          className={`border-b border-ctp-overlay0/20 inline-block w-full py-1 group-hover:bg-ctp-blue/20 ${activeId === node.id ? 'bg-ctp-blue/20' : ''} transition-[background-color] duration-300`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(node.id);
            el?.scrollIntoView({behavior: "smooth"});
          }}
        >
          <span
            aria-labelledby={linkId}
            className={`w-full pointer-events-none inline-block pr-[2ch] [&>code]:pretty-inline-code font-mono text-sm leading-relaxed font-semibold text-balance group-hover:text-ctp-text group-hover:underline link-color-trans ${activeId === node.id ? 'text-ctp-text underline' : 'text-ctp-subtext0'} break-words ${MD_MAX_TOC_WIDTH} ${LG_MAX_TOC_WIDTH}`}
            style={{ paddingLeft: `${marginLeft ?? 2}ch` }}
            dangerouslySetInnerHTML={{ __html: node.title }}
          />

        </Link>
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

export const concatHeadingUtil = (concat: number, heading: string, innerWidth: number) => {
  if (!heading) return;
  if (!innerWidth) return;
  
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
    let headingWithEscapedHTML = heading;

    const found = heading.match(re);
    
    if (found?.groups?.innerText) {
      const foundInnerText = found?.groups?.innerText;
      headingWithEscapedHTML = heading.replace(foundInnerText, escapeSpaces(foundInnerText));
    }

    let lastWord;
    let lastHtmlWord: RegExpMatchArray | null = null;
    


    const headingActualArr = headingWithEscapedHTML?.split(' ').map((word) => {
      const found = word.match(re);
      lastHtmlWord = found;
      return  found?.groups?.innerText ?? word;
    });

    const headingActual = headingActualArr.join(' ');
    const escapedLen = escapeCounter(headingActual, spaceEscape) * spaceEscape.length;

    while (headingActualArr.join(' ').length - escapedLen > concat) {
      lastWord = headingActualArr.pop();
    }
    
    if (lastWord) {
      const finalWord = (headingArr: string[], spaceEscape: string, lastWord: string, lastHtmlWord: RegExpMatchArray | null): string => {
        const almostTitleLen = headingArr.join(' ').length;
        const lastWordCopy = lastWord.replace(spaceEscape, ' ').split('');
        while (almostTitleLen + lastWordCopy.length > concat) {
          lastWordCopy.pop();
        }
        lastWordCopy.splice(-1, 1, '...');
        if (lastWord === lastHtmlWord?.groups?.innerText) {
          return lastHtmlWord?.input?.replace(lastWord, lastWordCopy.join('')) ?? '';
        }
        return lastWordCopy.join('');
      }
      const res = finalWord(headingActualArr, spaceEscape, lastWord, lastHtmlWord);

      headingActualArr.push(res);

      return headingActualArr.join(' ').replace(spaceEscape, ' ');

    }

  }

  return heading;
};

const getCharWidth = (text: string, font: string): number => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const char = text.charAt(0);
  if (ctx && font.length > 0) {
    ctx.font = font;
    const metrics = ctx.measureText(char);
    return metrics.width;
  }
  return 0
}

const maxConcatCharCalc = (totalNavWidth: number, concatPosX: number, pxPerChar: number): number => {
  return (totalNavWidth - concatPosX) / pxPerChar
}

type CombinedProps = {
  text: string;
  font: string;
  actualWidth: number;
  elOffset: number;
  clientWidth: number;
  injectOffset: number;
}

const combinedUtil = (props: CombinedProps) => {
  const charWidth = getCharWidth(props.text.toString(), props.font);
  const concatLen = Math.floor(maxConcatCharCalc(props.actualWidth, props.elOffset, charWidth)) - props.injectOffset;
  return concatHeadingUtil(concatLen, props.text.toString(), props.clientWidth);
}

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
  const activeHeading = headings?.find((heading) => heading.id === activeId)?.title ?? headings[0]?.title ?? 'heading';
  const [font, setFont] = useState<string>('');
  const [elOffset, setElOffset] = useState(0);
  const concatRef = useRef<HTMLElement>(null!);
  const navPaddingX = 6;
  const actualWidth = innerWidth - (16 * (2 * navPaddingX * TW_SPACING));
  useEffect(() => {
    if (concatRef?.current) {
      const fontRes = window.getComputedStyle(concatRef?.current, null).font;
      const offSet = concatRef?.current?.offsetLeft;
      setFont(fontRes);
      setElOffset(offSet);
    }
  }, [activeHeading])

  const concat = useMemo(() => combinedUtil({ text: activeHeading, font, actualWidth, elOffset, clientWidth: innerWidth, injectOffset: 3 }), [activeHeading, font, actualWidth, elOffset, innerWidth]);


  if (concat) {
    return <strong ref={concatRef} className='[&>code]:pretty-inline-code overflow-clip' dangerouslySetInnerHTML={{ __html: concat }} />;
  }
  return <strong>{activeHeading}</strong>
}
