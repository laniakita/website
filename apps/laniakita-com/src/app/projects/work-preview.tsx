'use client';
import Link from 'next/link';
import Image from 'next/image';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import { imageLoader } from '@/utils/image-loader';
import { toBase64, shimmer } from '@/utils/shimmer-utils';
import type { WorkMetaProps } from '@/app/projects/page';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

export default function WorkPreview({ workMetaObj }: { workMetaObj: WorkMetaProps }) {
  const published = dayjs(workMetaObj.published).format('L');
  return (
    <>
      {/* neat css tip: use padding instead of margin when working with flex basis / flex grids */}
      <div className='flex w-full basis-full md:basis-1/2 md:p-2 lg:basis-1/3'>
        <div className='flex w-full flex-col gap-10 overflow-hidden border-y border-ctp-surface0  p-10 md:gap-0 md:rounded-2xl md:border md:p-0'>
          <Link href={`/projects/${workMetaObj.slug}`} className=''>
            {workMetaObj.teaserImg && workMetaObj.teaserAlt ? (
              <div className='relative min-h-96 overflow-hidden rounded-2xl md:rounded-none'>
                <Image
                  loader={imageLoader}
                  src={workMetaObj.teaserImg}
                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  alt={workMetaObj.teaserAlt}
                  fill
                  className={`object-cover transition-all `}
                  sizes='(max-width: 300px) 70vw, (max-width: 600px) 45vw, (max-width:1024px) 27vw'
                />
              </div>
            ) : (
              <div className='min-h-96 rounded-2xl bg-ctp-sapphire md:rounded-none' />
            )}
          </Link>
          <div className='flex h-full flex-col items-stretch justify-between gap-6 md:p-10'>
            <div className='flex flex-col gap-6 '>
              <Link href={`/projects/${workMetaObj.slug}`} className='text-ctp-text hover:text-ctp-mauve'>
                <h3 className='text-3xl font-black supports-[text-wrap:balance]:text-balance'>{workMetaObj.title}</h3>
              </Link>
              <div className='w-full rounded bg-ctp-text py-px' />
              <p className='prose-protocol-omega prose prose-catppuccin supports-[text-wrap:balance]:text-pretty'>
                {workMetaObj.descr}
              </p>
              <p className='font-mono font-semibold'>{published}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/*   <div className='flex w-full flex-col gap-6'>
              <div className='flex flex-wrap gap-4'>
                {workMetaObj.tech.map((item) => (
                  <p
                    key={workMetaObj.tech.indexOf(item)}
                    className='rounded-3xl bg-ctp-mauve px-4 py-1 font-mono text-xs font-semibold lowercase text-ctp-base'
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
  */
