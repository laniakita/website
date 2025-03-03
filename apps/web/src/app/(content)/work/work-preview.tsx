import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';
import LocalDate from '../blog/local-date';
import { works } from '$/.source';
import { mdxComponents } from '@/mdx-components';

export function WorkPreview(data: typeof works[0]) {
  const res = data.featured_image;
  const uKey = useId();
  
  const MDXComponent = data.body;

  return (
    <div className='flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans dark:border-ctp-base dark:bg-ctp-midnight'>
      {res.src ? (
        <Link href={`https://${data.domain}`} target='_blank' aria-disabled={!data.active}>
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
          <h2 className='w-fit text-3xl font-black text-balance'>
            <Link
              href={`https://${data.domain}`}
              target='_blank'
              className='text-ctp-text'
              aria-disabled={!data.active}
            >
              <span className='relative'>
                {data.title}
                <span className='absolute bottom-1 ml-px icon-[ph--arrow-up-right-bold] text-xl' />
              </span>
            </Link>
          </h2>

          <div className=''>
            {data.endDate ? (
              <div className='flex flex-wrap gap-x-2 font-mono'>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>From:</strong> <LocalDate date={data.startDate} />
                </p>
                <span className=''>|</span>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>To:</strong> <LocalDate date={data.endDate} />
                </p>
              </div>
            ) : (
              <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                <LocalDate date={data.startDate} /> - Present
              </p>
            )}
          </div>
          <div className='prose-protocol-omega max-w-full prose-a:no-underline'>
            {/* @ts-expect-error -- types issues */}
            <MDXComponent components={mdxComponents} />
          </div>
        </div>

        <div className='h-px w-full bg-ctp-surface0 dark:bg-ctp-base' />
        <div className='flex flex-row gap-[1ch]'>
          <div className='flex flex-wrap gap-[1ch]'>
            {data.tech?.map((tag, idx) => (
              <p
                key={`project-preview-${uKey}-${Math.floor(Math.random() * 100 + idx)}-${idx * Math.random()}`}
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
