import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { compareDesc } from 'date-fns';
import { allCategories, allPosts } from 'content-collections';
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
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const catData = allCategories.find((catY) => catY.url.split('/').pop() === params.slug);

  const description = descriptionHelper(catData?.content, catData?.url, true);

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
      card: 'summary_large_image',
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

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const category = allCategories.find((catX) => catX.url.split('/').pop() === params.slug);
  const matchingPosts = allPosts
    .filter((postX) =>
      postX.categories?.some((cat) => cat && 'url' in cat && cat.url!.split('/').pop() === params.slug),
    )
    .sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)));

  if (!category) return notFound();

  return <MiniLayout data={category} posts={matchingPosts} />;
}
