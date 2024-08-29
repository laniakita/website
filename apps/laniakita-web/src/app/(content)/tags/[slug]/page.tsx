import type { Metadata, ResolvingMetadata } from 'next';
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
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const tagData = allTags.find((tagY) => tagY.url.split('/').pop() === params.slug);

  const description = descriptionHelper(tagData?.body.raw, tagData?.url, true);
  const previousImages = (await parent).openGraph?.images ?? [];
  const previousImagesTwitter = (await parent).twitter?.images ?? [];

  return {
    title: tagData?.title,
    authors: [{ name: 'Lani Akita' }],
    description,
    openGraph: {
      title: tagData?.title,
      description,
      images: [
        {
          alt: `${tagData?.title}`,
          type: 'image/jpeg',
          width: 1200,
          height: 630,
          url: `/opengraph/tags/${params.slug}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary',
      title: tagData?.title,
      description,
      images: [
        {
          alt: `${tagData?.title}`,
          type: 'image/jpeg',
          width: 1600,
          height: 900,
          url: `/opengraph/tags/${params.slug}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
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
