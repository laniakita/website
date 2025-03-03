import type { Metadata } from 'next';
import { allPages } from '@/lib/fumadocs';
import { PageCommon } from '@/app/(content)/(info)/page-common';

const data = allPages.find((page) => page.url === '/pages/contact');

export const metadata: Metadata = {
  title: data?.title,
  authors: [{ name: 'Lani Akita' }],
  description: data?.description,
  openGraph: {
    title: data?.title,
    description: data?.description,
    images: [
      {
        alt: `${data?.title}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/static/contact`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: data?.title,
    description: data?.description,
    images: [
      {
        alt: `${data?.title}`,
        type: 'image/png',
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
