import type { Metadata, ResolvingMetadata } from 'next';
import { allPages } from 'contentlayer/generated';
import { descriptionHelper } from '@/app/(content)/blog/post-components';
import { PageCommon } from '../../page-common';

export function generateStaticParams() {
  const credits = allPages.filter((page) => page._raw.sourceFileDir === 'pages/credits');
  return credits.map((cred) => ({
    slug: cred.url.split('/').pop(),
  }));
}
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const data = allPages.find((credit) => credit.url.split('/').pop() === params.slug);

  const description = descriptionHelper(data?.body.raw, data?.url, true);

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
          type: 'image/jpeg',
          width: 1200,
          height: 630,
          url: `/opengraph/credits/${params.slug}`,
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
          alt: data?.title,
          type: 'image/jpeg',
          width: 1600,
          height: 900,
          url: `/opengraph/credits/${params.slug}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
    },
  };
}

export default function ContactPage({ params }: { params: { slug: string } }) {
  return <PageCommon slug={params.slug} prefix='credits' />;
}
