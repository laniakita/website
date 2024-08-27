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
  },
  twitter: {
    card: 'summary',
    title: data?.title,
    description,
  },
};

export default function AboutPage() {
  return <PageCommon slug='about' />;
}
