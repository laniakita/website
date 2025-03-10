import { works } from '$/.source';
import { MiniWorkPreview } from '../previews/mini-work-preview';
import { useIntersectionObserver } from '../utils';
import { useRef } from 'react';

type AllWorksProps = typeof works;

export function MiniWorkRoller({ allWorks }: { allWorks: AllWorksProps }) {
  function WorksMap({ visible }: { visible: boolean }) {
    return allWorks.map((work, idx) => (
      <li
        key={crypto.randomUUID()}
        className={`${visible ? 'motion-safe:animate-big-fade-in-up motion-safe:opacity-0' : 'motion-safe:animate-big-fade-down'} relative z-10 flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans @3xl:min-w-96 dark:border-ctp-base dark:bg-ctp-midnight`}
        style={{ animationDelay: `${(0.5 + idx) / 10}s` }}
      >
        <MiniWorkPreview key={crypto.randomUUID()} {...work} />
      </li>
    ));
  }

  const menuRef = useRef<HTMLElement>(null!);
  const visible = useIntersectionObserver(menuRef);

  return (
    <menu ref={menuRef} className='flex w-full flex-col gap-6 @3xl:flex-row'>
      <WorksMap visible={visible} />
    </menu>
  );
}
