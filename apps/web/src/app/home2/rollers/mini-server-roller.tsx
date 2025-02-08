import { allWorks } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { MiniWorkPreview } from '../previews/mini-work-preview';
import { useIntersectionObserver } from '../utils';
import { useRef } from 'react';

export function MiniWorkRoller() {
  function WorksMap({ visible }: { visible: boolean }) {
    return allWorks
      .sort((a, b) => compareDesc(new Date(a.endDate ?? a.startDate), new Date(b.endDate ?? b.startDate)))
      .map((work, idx) => (
        <li key={crypto.randomUUID()} className={`${visible ? 'motion-safe:animate-big-fade-in-up motion-safe:opacity-0' : 'motion-safe:animate-big-fade-down'} min-w-96 relative z-10 flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans dark:border-ctp-base dark:bg-ctp-midnight`} style={{ animationDelay: `${(0.5 + idx) / 10}s` }}>
          <MiniWorkPreview key={crypto.randomUUID()} {...work} />
        </li>
      ));
  }

  const menuRef = useRef<HTMLElement>(null!);
  const visible = useIntersectionObserver(menuRef);

  return (
    <menu ref={menuRef} className='flex w-full flex-col @3xl:flex-row gap-6'>
      <WorksMap visible={visible} />
    </menu>
  )

}
