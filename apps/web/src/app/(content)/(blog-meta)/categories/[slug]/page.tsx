import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { compareDesc } from 'date-fns';
import { allCategories, allPosts } from 'contentlayer/generated';
import { descriptionHelper } from '@/lib/description-helper';
import { MiniLayout } from '../../cat-tag-common';

export const dynamicParams = false;

export function generateStaticParams() {
  const cats = allCategories;
  return cats.map((catX) => ({
    slug: catX.url.split('/').pop(),
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const catData = allCategories.find((catY) => catY.url.split('/').pop() === params.slug);

  const description = descriptionHelper(catData?.body.raw, catData?.url, true);

  const previousImages = (await parent).openGraph?.images ?? [];
  const previousImagesTwitter = (await parent).twitter?.images ?? [];

  return {
    title: catData?.title,
    authors: [{ name: 'Lani Akita' }],
    description,
    openGraph: {
      title: catData?.title,
      description,
      images: [
        {
          alt: `${catData?.title}`,
          type: 'image/png',
          width: 1200,
          height: 630,
          url: `/opengraph/categories/${params.slug}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary',
      title: catData?.title,
      description,
      images: [
        {
          alt: `${catData?.title}`,
          type: 'image/png',
          width: 1600,
          height: 900,
          url: `/opengraph/categories/${params.slug}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = allCategories.find((catX) => catX.url.split('/').pop() === params.slug);
  const matchingPosts = allPosts
    .filter((postX) => postX.categories?.some((cat) => (cat as unknown as { slug: string }).slug === params.slug))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (!category) return notFound();

  return <MiniLayout data={category} posts={matchingPosts} />;
}
