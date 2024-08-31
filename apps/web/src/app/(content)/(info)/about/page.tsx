import type { Metadata } from 'next';
import { allPages } from 'contentlayer/generated';
import { PageCommon } from '../page-common';
import { descriptionHelper } from '../../blog/post-components';

const data = allPages.find((page) => page.url === '/about');
const description = descriptionHelper(data!.body.raw, data?.url, true);

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
    card: 'summary',
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
