import { useId } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { compareDesc } from 'date-fns';
import { allPages, allWorks } from 'content-collections';
import { descriptionHelper } from '@/lib/description-helper';
import GlobalMDXComponent from '@/components/mdx/global-mdx-components';
import { WorkPreview } from './work-preview';

const pageData = allPages.find((page) => page.url === '/work');
const description = descriptionHelper(pageData?.content, pageData?.url, true);

export const metadata: Metadata = {
  title: pageData?.title,
  authors: [{ name: 'Lani Akita' }],
  description,
  openGraph: {
    title: pageData?.title,
    description,
    images: [
      {
        alt: `${pageData?.title}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/static/work`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageData?.title,
    description,
    images: [
      {
        alt: `${pageData?.title}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/static/work?twitter=true`,
      },
    ],
  },
};

export default function Works() {
  const uKey = useId();
  const data = allPages.find((page) => page.url.split('/').pop() === 'work');
  if (!data) return notFound();
  const workData = allWorks.sort((a, b) =>
    compareDesc(new Date(a.endDate ?? a.startDate), new Date(b.endDate ?? b.startDate)),
  );

  return (
    <main className='common-padding'>
      <div className='flex flex-col items-center justify-center gap-4 md:gap-6'>
        <div className='flex w-full max-w-3xl flex-col gap-4 rounded-md border border-ctp-surface0 p-8 dark:border-ctp-base'>
          <div className=''>
            <h1 className='text-3xl font-black md:text-4xl'>{data.title}</h1>
          </div>
          <div className='h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base' />
          <div className='prose-protocol-omega w-full max-w-sm prose-p:my-0'>
            <GlobalMDXComponent {...data} />
          </div>
        </div>

        <div className='flex size-full max-w-3xl flex-wrap items-center justify-center gap-4 md:gap-6'>
          {workData.map((proj, idx) => (
            <WorkPreview
              key={`work-${uKey}-${Math.floor(Math.PI * Math.random() * 1000)}-${idx * Math.random()}`}
              {...proj}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
