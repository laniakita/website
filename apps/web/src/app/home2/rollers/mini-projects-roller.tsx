
import { allProjects } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import MiniProjectPreview from '../previews/mini-project-preview';

export default function MiniProjectsRoller({visible}:{visible: boolean}) {

  return allProjects
    .sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)))
    .slice(0, 10)
    .map((project, idx) =>
      <li key={crypto.randomUUID()} className={`${visible ? 'motion-safe:animate-big-fade-in-up motion-safe:opacity-100' : 'motion-safe:animate-big-fade-down opacity-0' }  min-w-96 overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base dark:bg-ctp-midnight motion-safe:simple-color-trans dark:border-ctp-base opacity-0`} style={{ animationDelay: `${(0.5 + idx)/10}s` }}>
        <MiniProjectPreview  {...project} />
      </li>
    )
}
