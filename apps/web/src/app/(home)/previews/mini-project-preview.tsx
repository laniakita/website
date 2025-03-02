import { projects } from '$/.source';
import LocalDate from '@/app/(content)/blog/local-date';
import GlobalMDXRenderer from '@/components/mdx/global-mdx-renderer';
import { APP_URL, SHOWCASE_URL } from '@/lib/constants';
import type { FeaturedImageR1 } from '@/lib/image-process';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';

type ProjectProps = typeof projects[0];

export default function MiniProjectPreview(data: ProjectProps) {
  const res = data.featured_image as FeaturedImageR1;
  const uKey = useId();
  const projDescription = data.description;

  function projectLink() {
    if (data.foreignUrl) {
      return data.foreignUrl;
    } else if (!data.embedded && !data.foreignUrl) {
      return `${SHOWCASE_URL}${data.url}`;
    }
    return `${APP_URL}${data.url}`;
  }

  return (
    <div className='flex flex-col'>
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
            className='h-64 object-cover @3xl:h-96'
          />
        </Link>
      ) : (
        ''
      )}
      <div className='flex flex-col gap-4 p-8 lg:p-10'>
        <div className='flex flex-col gap-2'>
          <h2 className='w-fit text-3xl font-black text-balance'>
            <Link href={projectLink()} target='_blank' className='text-ctp-text'>
              <span className='relative'>
                {data.title}
                <span className='absolute bottom-1 ml-px icon-[ph--arrow-up-right-bold] text-xl' />
              </span>
            </Link>
          </h2>

          <div className=''>
            {data.updated ? (
              <div className='flex flex-wrap gap-x-2 font-mono'>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>Released:</strong> <LocalDate date={data.date} />
                </p>
                <span className=''>|</span>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>Updated:</strong> <LocalDate date={data.updated} />
                </p>
              </div>
            ) : (
              <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                <strong>Released:</strong> <LocalDate date={data.date} />
              </p>
            )}
          </div>
          <div className='prose-protocol-omega max-w-full prose-p:my-0 prose-a:no-underline'>
            <GlobalMDXRenderer>{projDescription}</GlobalMDXRenderer>
          </div>
        </div>

        <div className='h-px w-full bg-ctp-surface0 dark:bg-ctp-base' />
        <div className='flex flex-row gap-[1ch]'>
          <p>
            {data.tech?.map((tag, idx) => (
              <span
                key={`project-preview-${uKey}-${Math.floor(Math.random() * 100 + idx)}-${idx * Math.random()}`}
                className='w-fit font-mono text-sm font-semibold'
              >
                {tag}
                {data.tech && idx < data.tech.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
