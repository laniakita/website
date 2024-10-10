import { useId } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { compareDesc } from 'date-fns';
import { descriptionHelper } from '@/lib/description-helper';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { allPages, allPosts, allProjects, type Project } from 'contentlayer/generated';
import GlobalMDXComponent from '@/components/mdx/global-mdx-components';
import GlobalMDXRenderer from '@/components/mdx/global-mdx-renderer';
import PostDate from '@/app/(content)/blog/[id]/[slug]/post-date';
import { BASE_URL, SHOWCASE_URL } from '@/lib/constants';

const pageData = allPages.find((page) => page.url === '/projects');
const description = descriptionHelper(pageData?.body.raw, pageData?.url, true);

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
    card: 'summary_large_image',
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
  const projectData = allProjects.sort((a, b) =>
    compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)),
  );

  return (
    <main className='simple-color-trans common-padding bg-ctp-base dark:bg-ctp-midnight'>
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
          {projectData.map((proj) => (
            <ProjectPreview key={`project-${uKey}-${Math.floor(Math.PI * Math.random())}`} {...proj} />
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
    if (!getPost) return;
    return descriptionHelper(getPost.body.raw, getPost.url);
  };

  const descriptionX = data.blogPost ? getDescription(data) : data.description;
  
  function projectLink () {
    if (data.offsite) {
      return `${SHOWCASE_URL}${data.url}`
    }
    return `${BASE_URL}${data.url}`
  }

  return (
    <div className='flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 dark:border-ctp-base'>
      {res.src ? (
        <Link href={projectLink()} target='_blank'>
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
        <div className='flex flex-col gap-2'>
          <h2 className='w-fit text-balance text-3xl font-black'>
            <Link href={projectLink()} target='_blank' className='text-ctp-text'>
              <span className='relative'>
                {data.title}
                <span className='icon-[ph--arrow-up-right-bold] absolute bottom-1 ml-px text-xl' />
              </span>
            </Link>
          </h2>
          <div className=''>
            {data.updated ? (
              <div className='flex flex-wrap gap-x-2 font-mono'>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>Released:</strong> <PostDate date={data.date} />
                </p>
                <span className=''>|</span>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>Updated:</strong> <PostDate date={data.updated} />
                </p>
              </div>
            ) : (
              <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                <strong>Released:</strong> <PostDate date={data.date} />
              </p>
            )}
          </div>
        </div>
        <div className='h-px w-full bg-ctp-surface0 dark:bg-ctp-base' />
        <div className='prose-protocol-omega max-w-full prose-p:my-0 prose-a:no-underline'>
          {/* @ts-expect-error -- single string, but still works. */}
          <GlobalMDXRenderer>{descriptionX}</GlobalMDXRenderer>
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
