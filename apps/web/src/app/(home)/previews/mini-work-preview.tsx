import LocalDate from '@/app/(content)/blog/local-date';
import { FeaturedImageR1 } from '@/lib/image-process';
import { Work } from 'contentlayer/generated';
import Image from 'next/image';
import Link from 'next/link';

export function MiniWorkPreview(data: Work) {
  const res = data.featured_image as FeaturedImageR1;

  return (
    <div className=''>
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
            className='h-[30rem] object-cover object-top'
          />
        </Link>
      ) : (
        ''
      )}

      <div className='absolute inset-x-0 bottom-0 flex flex-col gap-4 bg-ctp-base/80 p-8 backdrop-blur lg:p-10'>
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
                <LocalDate date={data.startDate} />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
