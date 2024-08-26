import { useId } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { compareDesc } from 'date-fns';
import { allPages, allProjects, type Project } from '.contentlayer/generated';
import { MDXComponent } from '@/components/cat-tag-common';
import type { FeaturedImageR1 } from '@/lib/image-process';
import localLoader from '@/lib/local-loader';


export default function Projects() {
  const uKey = useId();
  const data = allPages.find((page) => page.url.split('/').pop() === 'projects');
  if (!data) return notFound();
  const projectData = allProjects.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <main className='simple-color-trans pt-common pb-common bg-ctp-base dark:bg-ctp-midnight'>
      <div className='flex flex-col items-center justify-center gap-4 px-10 md:gap-6'>
        <div className='flex min-h-full items-center justify-center'>
          <div className='prose-protocol-omega max-w-3xl '>
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
  return (
    <div className='flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 dark:border-ctp-base'>
      {res.src ? (
        <Link href={data.link ?? data.url}>
          <Image
            loader={
              localLoader
              //imageLoader
            }
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
      <div className='p-6 md:p-10'>
        <h2 className='w-fit text-balance text-3xl font-black'>
          <Link href={data.link ?? data.url} className='text-ctp-text'>
            {data.title}
          </Link>
        </h2>
      </div>
    </div>
  );
}
