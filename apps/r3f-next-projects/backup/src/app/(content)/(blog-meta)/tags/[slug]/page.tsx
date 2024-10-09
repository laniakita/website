import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { compareDesc } from 'date-fns';
import { allTags, allPosts } from 'contentlayer/generated';
import { descriptionHelper } from '@/lib/description-helper';
import { MiniLayout } from '../../cat-tag-common';

export const dynamicParams = false;

export function generateStaticParams() {
  const tags = allTags;
  return tags.map((tagX) => ({
    slug: tagX.url.split('/').pop(),
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const data = allTags.find((tagY) => tagY.url === `/tags/${params.slug}`);

  const description = data?.body.raw && data.url ? descriptionHelper(data.body.raw, data.url, true) : 'Tag page.';

  const previousImages = (await parent).openGraph?.images ?? [];
  const previousImagesTwitter = (await parent).twitter?.images ?? [];

  return {
    title: data?.title,
    authors: [{ name: 'Lani Akita' }],
    description,
    openGraph: {
      title: data?.title,
      description,
      images: [
        {
          alt: `${data?.title}`,
          type: 'image/png',
          width: 1200,
          height: 630,
          url: `/opengraph/tags/${params.slug}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary',
      title: data?.title,
      description,
      images: [
        {
          alt: `${data?.title}`,
          type: 'image/png',
          width: 1600,
          height: 900,
          url: `/opengraph/tags/${params.slug}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
    },
  };
}

export default async function TagPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const tag = allTags.find((tagX) => tagX.url === `/tags/${params.slug}`);
  const matchingPosts = allPosts
    .filter((postX) => postX.tags?.some((tagZ) => (tagZ as unknown as { slug: string }).slug === params.slug))
    .sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)));

  if (!tag) return notFound();

  return <MiniLayout data={tag} posts={matchingPosts} />;
}
