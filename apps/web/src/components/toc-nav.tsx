'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    const headingEls = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6, h7')).filter((el) => el.id.length > 0);

    const nested = getNestedHeadings(headingEls as HTMLHeadingElement[], 2);

    setNestedHeadings([titleNode, ...nested]);
  }, []);

  return { nestedHeadings };
};

function HeadingNode({ node }: { node: HeadingNode }) {
  return (
    <li key={node.id} className=''>
      <p className='text-balance'>
        <Link
          href={`#${node.id}`}
          className='text-balance font-mono text-sm leading-relaxed text-ctp-subtext0 hover:text-ctp-text md:max-w-xs lg:max-w-sm md:break-words lg:break-keep'
        >
          {node.title}
        </Link>
      </p>
      <ul className='list-none pl-[2ch]'>
        {node.children && node.children.map((childNode) => <HeadingNode key={childNode.id} node={childNode} />)}
      </ul>
    </li>
  );
}

function Headings({ tree }: { tree: HeadingNode[] }) {
  return (
    <ul className='list-none leading-relaxed'>
      {tree.map((heading) => (
        <HeadingNode key={heading.id} node={heading} />
      ))}
    </ul>
  );
}

const useIntersectionObserver = () => {
  useEffect(() => {});
};

export default function ToCMenu() {
  const { nestedHeadings } = useHeadingsData();
  console.log('filtered:', nestedHeadings);

  return (
    <div className='flex h-screen max-h-[calc(100vh-4rem)] w-full min-w-[22rem] md:max-w-xs lg:max-w-sm py-10 items-start justify-center overflow-y-auto bg-ctp-base/20  text-slate-100 sticky top-16 dark:bg-ctp-base/20'>
      <nav aria-label='Table of contents' className='w-full px-4'>
        <Headings tree={nestedHeadings as HeadingNode[]} />
      </nav>
    </div>
  );
}
