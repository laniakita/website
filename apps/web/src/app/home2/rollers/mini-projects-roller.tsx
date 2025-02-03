'use client';

import { allProjects } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import MiniProjectPreview from '../previews/mini-project-preview';

export default function MiniProjectsRoller() {
  return allProjects
    .sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)))
    .slice(0, 10)
    .map((project) => <MiniProjectPreview key={crypto.randomUUID()} {...project} />);
}
