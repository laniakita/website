'use client';

import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { HomePostPreview } from '../previews/mini-post-preview';

export default function MiniPostRoller() {
  return allPosts
    .sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)))
    .slice(0, 10)
    .map((post) => <HomePostPreview key={crypto.randomUUID()} {...{ post: post }} />);
}
