import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compareDesc } from 'date-fns';
import { allTags, allPosts } from 'contentlayer/generated';
import { MiniLayout } from '@/components/cat-tag-common';
import { descriptionHelper } from '../../blog/post-components';

export function generateStaticParams() {
  const tags = allTags;
  return tags.map((tagX) => ({
    slug: tagX.url.split('/').pop(),
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tagData = allTags.find((tagY) => tagY.url.split('/').pop() === params.slug);

  const description = descriptionHelper(tagData?.body.raw, tagData?.url, true);

  return {
    title: tagData?.title,
    authors: [{ name: 'Lani Akita' }],
    description,
    openGraph: {
      title: tagData?.title,
      description,
    },
    twitter: {
      card: 'summary',
      title: tagData?.title,
      description,
    },
  };
}

export default function TagPage({ params }: { params: { prefix: string; slug: string } }) {
  const tag = allTags.find((tagX) => tagX.url.split('/').pop() === params.slug);
  const matchingPosts = allPosts
    .filter((postX) => postX.tags?.some((tagXP) => (tagXP as unknown as { slug: string }).slug === params.slug))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (!tag) return notFound();

  return <MiniLayout data={tag} posts={matchingPosts} isTag />;
}
