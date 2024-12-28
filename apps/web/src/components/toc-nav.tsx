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
}

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<unknown>([]);

  useEffect(() => {
    // filtering by id length excises the sub-headline from the array
    const headingEls = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6, h7')).filter((el) => el.id.length > 0);

    const nested = getNestedHeadings(headingEls as HTMLHeadingElement[], 2);

    setNestedHeadings(nested);
  }, []);

  return { nestedHeadings };
};

function HeadingNode({ node }: { node: HeadingNode }) {
  return (
    <li key={node.id}>
      <Link href={`#${node.id}`} className='text-ctp-subtext0 hover:text-ctp-text font-mono text-sm'>{node.title}</Link>
      <ul className='list-none pl-[2ch]'>{node.children && node.children.map((childNode) => <HeadingNode key={childNode.id} node={childNode} />)}</ul>
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
  useEffect(() => {

  })
}

export default function ToCMenu() {
  const { nestedHeadings } = useHeadingsData();
  console.log('filtered:', nestedHeadings);

  return (
    <div className='flex h-screen max-h-[calc(100vh-4rem)] w-full max-w-lg bg-ctp-base/20 dark:bg-ctp-base/20 text-slate-100 md:sticky md:top-16 overflow-y-auto px-10 py-[4.5rem] items-start'>
      <nav aria-label='Table of contents' className='w-full'>
        <Headings tree={nestedHeadings as HeadingNode[]} />
      </nav>
    </div>
  );
}
