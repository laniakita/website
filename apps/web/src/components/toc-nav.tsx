'use client';

import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

// inspired by Emma Goto React ToC: https://www.emgoto.com/react-table-of-contents

export interface HeadingNode {
  id: string;
  level: number;
  title: string;
  children: HeadingNode[];
}

const getNestedHeadings = (headings: HTMLHeadingElement[], level: number) => {
  const nestedTree: HeadingNode[] = [];
  let currNode: HeadingNode = {
    id: '',
    level: 0,
    title: '',
    children: [],
  };

  while (headings.length > 0) {
    const currHeading = headings[0] as HTMLHeadingElement;
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
        currNode.children = getNestedHeadings(headings, headingLevel) as HeadingNode[];
      }
    } else {
      break;
    }
  }
  return nestedTree;
};

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<unknown>([]);

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
  console.log('nodeid:', node.id, 'activeId:', activeId);
  return (
    <li key={node.id}>
      <p className='text-balance'>
        <Link
          href={`#${node.id}`}
          className={`text-balance font-mono text-sm leading-relaxed text-ctp-subtext0 hover:text-ctp-text ${activeId === node.id ? 'text-ctp-text underline' : ''} md:max-w-xs md:break-words lg:max-w-sm lg:break-keep`}
        >
          {node.title}
        </Link>
      </p>
      <ul className='list-none pl-[2ch]'>
        {node.children && node.children.map((childNode) => <HeadingNode key={childNode.id} node={childNode} activeId={activeId} />)}
      </ul>
    </li>
  );
}

function Headings({ tree, activeId }: { tree: HeadingNode[]; activeId: string}) {
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
          const headingEl = headingElsRef.current![key];
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

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-72px 0px -40% 0px',
    });

    const headingEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    headingEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [setActiveId, activeId]);
};

export default function ToCMenu() {
  const [activeId, setActiveId] = useState('');
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId, activeId);
  //console.log('currently active should be:', activeId);
  return (
    <div className='sticky top-16 flex h-screen max-h-[calc(100vh-4rem)] w-full min-w-[22rem] items-start justify-center overflow-y-auto bg-ctp-base/20 py-10 text-slate-100 md:max-w-xs lg:max-w-sm dark:bg-ctp-base/20'>
      <nav aria-label='Table of contents' className='w-full px-4'>
        <Headings tree={nestedHeadings as HeadingNode[]} activeId={activeId} />
      </nav>
    </div>
  );
}
