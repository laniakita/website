import { useId } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { compareDesc } from 'date-fns';
import Markdown from 'markdown-to-jsx';
import { MDXComponent } from '@/components/cat-tag-common';
import type { FeaturedImageR1 } from '@/lib/image-process';
import LocalDate from '@/app/(content)/blog/local-date';
import { descriptionHelper } from '@/app/(content)/blog/post-components';
import { allPages, allPosts, allProjects, type Project } from "contentlayer/generated";

const pageData = allPages.find((page) => page.url === '/projects');
const description = descriptionHelper(pageData!.body.raw, pageData?.url, true);

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
        url: `/opengraph/static/projects`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: pageData?.title,
    description,
    images: [
      {
        alt: `${pageData?.title}`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/static/projects?twitter=true`,
      },
    ],
  },
};

export default function Projects() {
  const uKey = useId();
  const data = allPages.find((page) => page.url.split('/').pop() === 'projects');
  if (!data) return notFound();
  const projectData = allProjects.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <main className='simple-color-trans pt-common pb-common px-page-common bg-ctp-base dark:bg-ctp-midnight'>
      <div className='flex flex-col items-center justify-center gap-4 md:gap-6'>
        <div className='flex w-full max-w-3xl flex-col gap-4 rounded-md border border-ctp-surface0 p-8 dark:border-ctp-base'>
          <div className=''>
            <h1 className='text-3xl font-black md:text-4xl'>{data.title}</h1>
          </div>
          <div className='h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base' />
          <div className='prose-protocol-omega w-full max-w-sm prose-p:my-0'>
            <MDXComponent content={data.body.code} />
          </div>
        </div>

        <div className='flex size-full max-w-3xl flex-wrap items-center justify-center gap-4 md:gap-6'>
          {projectData.map((proj) => (
            <ProjectPreview key={`project-${uKey}`} {...proj} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ProjectPreview(data: Project) {
  const res = data.featured_image as FeaturedImageR1;
  const uKey = useId();
  const getDescription = (dataX: Project) => {
    const getPost = allPosts.find((post) => post.url === dataX.blogPost);
    return descriptionHelper(getPost!.body.raw, getPost!.url);
  };

  const descriptionX = data.blogPost ? getDescription(data) : data.description;

  return (
    <div className='flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 dark:border-ctp-base'>
      {res.src ? (
        <Link href={data.link ?? data.url} target='_blank'>
          <Image
            src={res.src}
            placeholder='blur'
            blurDataURL={res.base64}
            alt={res.altText}
            height={res.height}
            width={res.width}
            sizes='(max-width: 300px) 70vw, (max-width: 600px) 45vw, (max-width:1500px) 27vw'
            className='object-contain'
          />
        </Link>
      ) : (
        ''
      )}
      <div className='flex flex-col gap-4 p-8 lg:p-10'>
        <div>
          <div className='flex flex-wrap gap-[1ch] pb-2'>
            <p className='w-fit rounded-full font-mono'>
              <LocalDate date={new Date(data.date)} />
            </p>
          </div>
          <h2 className='w-fit text-balance text-3xl font-black'>
            <Link href={data.link ?? data.url} target='_blank' className='flex flex-row items-end text-ctp-text'>
              {data.title}
              <span className='icon-[ph--arrow-up-right-bold] mb-1 text-xl' />
            </Link>
          </h2>
        </div>
        <div className='h-px w-full bg-ctp-surface0 dark:bg-ctp-base' />
        <div className='prose-protocol-omega max-w-full text-pretty prose-p:my-0 prose-a:no-underline'>
          {/* @ts-expect-error -- there's only one string */}
          <Markdown options={{ forceBlock: true }}>{descriptionX}</Markdown>
        </div>

        <div className='h-px w-full bg-ctp-surface0 dark:bg-ctp-base' />
        <div className='flex flex-row gap-[1ch]'>
          <div className='flex flex-wrap gap-[1ch]'>
            {data.tech?.map((tag, idx) => (
              <p
                key={`project-preview-${uKey}-${Math.floor(Math.random() * 100 + idx)}`}
                className='w-fit font-mono text-sm font-semibold'
              >
                {tag}
                {data.tech && idx < data.tech.length - 1 ? <span>,</span> : ''}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}