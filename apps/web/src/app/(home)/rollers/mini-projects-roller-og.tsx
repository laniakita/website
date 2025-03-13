'use client';

import { motion } from 'motion/react';
import MiniProjectPreview from '../previews/mini-project-preview';
import { projects } from '$/.source';

type AllProjectsProps = typeof projects;

export default function MiniProjectsRollerOG({ allProjects }: { allProjects: AllProjectsProps }) {
  return (
    <menu className='flex w-full flex-row justify-evenly gap-4 overflow-x-auto overflow-y-hidden bg-ctp-crust p-6 @3xl:gap-6 @3xl:py-20 @min-[66rem]:px-20 dark:bg-ctp-crust/40'>
      <ProjectsMap allProjects={allProjects} />
    </menu>
  );
}

function ProjectsMap({ allProjects }: { allProjects: AllProjectsProps }) {
  return allProjects.slice(0, 10).map((project, idx) => (
    <motion.li
      key={crypto.randomUUID()}
      initial={{ opacity: 0, transform: 'translate3d(0rem, 20%, 0rem)' }}
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
      className={`max-w-96 min-w-80 overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans @3xl:min-w-96 dark:border-ctp-base dark:bg-ctp-midnight`}
    >
      <MiniProjectPreview data={project} />
    </motion.li>
  ));
}
