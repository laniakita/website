'use client';

import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { useRef } from 'react';
import { useIntersectionObserver } from '../utils';
import MiniPostPreview from '../previews/mini-post-preview';

export default function MiniPostsRoller() {
  function PostMap({ visible }: { visible: boolean }) {
    return allPosts
      .sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)))
      .slice(0, 10)
      .map((post, idx) => (
        <li
          key={crypto.randomUUID()}
          className={`${visible ? 'motion-safe:animate-big-fade-in-up motion-safe:opacity-0' : 'motion-safe:animate-big-fade-down'} min-w-80 overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans @3xl:min-w-96 dark:border-ctp-base dark:bg-ctp-midnight`}
          style={{ animationDelay: `${(0.5 + idx) / 10}s` }}
        >
          <MiniPostPreview post={post} />
        </li>
      ));
  }

  const menuRef = useRef<HTMLElement>(null!);
  const visible = useIntersectionObserver(menuRef);

  return (
    <menu
      ref={menuRef}
      className='flex w-full flex-row gap-4 overflow-x-auto overflow-y-hidden bg-ctp-crust p-6 @3xl:gap-6 @3xl:py-20 @min-[66rem]:px-20 dark:bg-ctp-crust/40'
    >
      <PostMap visible={visible} />
    </menu>
  );
}
