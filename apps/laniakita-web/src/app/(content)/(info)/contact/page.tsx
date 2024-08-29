import type { Metadata } from 'next';
import { allPages } from 'contentlayer/generated';
import { PageCommon } from '../page-common';
import { descriptionHelper } from '../../blog/post-components';

const data = allPages.find((page) => page.url === '/contact');
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
        type: 'image/jpeg',
        width: 1200,
        height: 630,
        url: `/opengraph/static/contact`,
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
        type: 'image/jpeg',
        width: 1600,
        height: 900,
        url: `/opengraph/static/contact?twitter=true`,
      },
    ],
  },
};

export default function ContactPage() {
  return <PageCommon slug='contact' />;
}