import { works } from '$/.source';
import { MiniWorkPreview } from '../previews/mini-work-preview';
import { useRef } from 'react';
import { motion } from 'motion/react';

type AllWorksProps = typeof works;

export function MiniWorkRoller({ allWorks }: { allWorks: AllWorksProps }) {
  const menuRef = useRef<HTMLElement>(null!);

  return (
    <menu ref={menuRef} className='flex w-full flex-col gap-6 @3xl:flex-row'>
      <WorksMap allWorks={allWorks} />
    </menu>
  );
}

function WorksMap({ allWorks }: { allWorks: AllWorksProps }) {
  return allWorks.map((work, idx) => (
    <motion.li
      key={crypto.randomUUID()}
      initial={{ opacity: 0, transform: 'translate3d(0rem, 10rem, 0rem)' }}
      whileInView={{
        opacity: 1,
        transform: 'translate3d(0rem, 0%, 0rem)',
        transition: {
          duration: 0.8,
          delay: (0.5 + idx) / 10,
          ease: 'backOut',
        },
      }}
      viewport={{ once: true }}
      className={`relative z-10 flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans @3xl:min-w-96 dark:border-ctp-base dark:bg-ctp-midnight`}
      style={{ animationDelay: `${(0.5 + idx) / 10}s` }}
    >
      <MiniWorkPreview key={crypto.randomUUID()} {...work} />
    </motion.li>
  ));
}
