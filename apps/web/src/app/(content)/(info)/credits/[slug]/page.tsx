import type { Metadata, ResolvingMetadata } from 'next';
import { allPages } from 'contentlayer/generated';
import { descriptionHelper } from '@/lib/description-helper';
import { PageCommon } from '@/app/(content)/(info)/page-common';

export const dynamicParams = false;

export function generateStaticParams() {
  const credits = allPages.filter((page) => page._raw.sourceFileDir === 'pages/credits');
  return credits.map((cred) => ({
    slug: cred.url.split('/').pop(),
  }));
}
export async function generateMetadata(props: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const data = allPages.find((credit) => credit.url.split('/').pop() === params.slug);
  /* eslint-disable @typescript-eslint/no-unnecessary-condition -- testing */
  const description = descriptionHelper(data?.body?.raw, data?.url, true);

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
          alt: data?.title,
          type: 'image/png',
          width: 1200,
          height: 630,
          url: `/opengraph/credits/${params.slug}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data?.title,
      description,
      images: [
        {
          alt: data?.title,
          type: 'image/png',
          width: 1600,
          height: 900,
          url: `/opengraph/credits/${params.slug}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
    },
  };
}

export default async function ContactPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <PageCommon slug={params.slug} prefix='credits' />;
}
