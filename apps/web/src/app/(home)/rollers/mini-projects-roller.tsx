'use client';

import MiniProjectPreview from '../previews/mini-project-preview';
import { useRef } from 'react';
import { useIntersectionObserver } from '../utils';
import { projects } from '$/.source';

type AllProjectsProps = typeof projects;

export default function MiniProjectsRoller({ allProjects }: { allProjects: AllProjectsProps }) {
  function ProjMap({ visible }: { visible: boolean }) {
    return allProjects.slice(0, 10).map((project, idx) => (
      <li
        key={crypto.randomUUID()}
        className={`${visible ? 'motion-safe:animate-big-fade-in-up motion-safe:opacity-0' : 'motion-safe:animate-big-fade-down'} max-w-96 min-w-80 overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans @3xl:min-w-96 dark:border-ctp-base dark:bg-ctp-midnight`}
        style={{ animationDelay: `${(0.5 + idx) / 10}s` }}
      >
        <MiniProjectPreview {...project} />
      </li>
    ));
  }

  const menuRef = useRef<HTMLElement>(null!);
  const visible = useIntersectionObserver(menuRef);

  return (
    <menu
      ref={menuRef}
      className='flex w-full flex-row justify-evenly gap-4 overflow-x-auto overflow-y-hidden bg-ctp-crust p-6 @3xl:gap-6 @3xl:py-20 @min-[66rem]:px-20 dark:bg-ctp-crust/40'
    >
      <ProjMap visible={visible} />
    </menu>
  );
}
