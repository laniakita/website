import type { Metadata } from 'next';
import { allPages } from 'content-collections';
import { PageCommon } from '@/app/(content)/(info)/page-common';
import { descriptionHelper } from '@/lib/description-helper';

const data = allPages.find((page) => page.url === '/about');

const description = descriptionHelper(data?.content, data?.url, true);

export const metadata: Metadata = {
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
        url: `/opengraph/static/about`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: data?.title,
    description,
    images: [
      {
        alt: `${data?.title}`,
        type: 'image/png',
        width: 1600,
        height: 900,
        url: `/opengraph/static/about?twitter=true`,
      },
    ],
  },
};

export default function AboutPage() {
  return <PageCommon slug='about' />;
}
