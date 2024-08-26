import { notFound } from 'next/navigation';
import { compareDesc } from 'date-fns';
import { allTags, allPosts } from 'contentlayer/generated';
import { MiniLayout } from '@/components/cat-tag-common';

export default function TagPage({ params }: { params: { prefix: string; slug: string } }) {
  const tag = allTags.find((tagX) => tagX.url.split('/').pop() === params.slug);
  const matchingPosts = allPosts
    .filter((postX) => postX.tags?.some((tagXP) => (tagXP as unknown as { slug: string }).slug === params.slug))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (!tag) return notFound();

  return <MiniLayout data={tag} posts={matchingPosts} />;
}
