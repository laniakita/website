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
  const tagData = allPages.find((credit) => credit.url.split('/').pop() === params.slug);

  const previousImages = (await parent).openGraph?.images ?? [];
  const description = descriptionHelper(tagData!.body.raw, tagData!.url, true);

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



export default function ContactPage({params}: {params: {slug: string;}}) {
  return (
    <PageCommon slug={params.slug} prefix='credits' />
  );
}
