import { blog } from '$/.source';
import { CatTag, CatTagRoller } from '@/app/(content)/blog/cat-tag-roller';
import LocalDate from '@/app/(content)/blog/local-date';
import type { FeaturedImageR1 } from '@/lib/image-process';
import Image from 'next/image';
import Link from 'next/link';
import { type HTMLAttributes } from 'react';

export interface MiniPostPreviewProps extends HTMLAttributes<HTMLDivElement> {
  post: typeof blog[0];
  parentExtraClass?: string;
}

export default function MiniPostPreview(props: MiniPostPreviewProps) {
  const post = props.post;
  const res = post.featured_image as FeaturedImageR1;

  return (
    <div {...props} className={`flex flex-col ${props.parentExtraClass}`}>
      {res.hasImage ? (
        <Link href={post.url}>
          <Image
            src={res.src}
            placeholder='blur'
            blurDataURL={res.base64}
            alt={post.altText ?? ''}
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
          <div className=''>
            {post.updated ? (
              <div className='flex flex-wrap gap-x-2 font-mono'>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>Updated:</strong> <LocalDate date={post.updated} />
                </p>
              </div>
            ) : (
              <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                <LocalDate date={post.date} />
              </p>
            )}
          </div>

          <div>
            <h2 className='w-fit post-preview-headline'>
              <Link href={post.url} className='text-ctp-text'>
                {post.headline}
              </Link>
            </h2>
            <h3 className='post-preview-subheadline'>{post.subheadline}</h3>
          </div>
        </div>
        <div className='h-px w-full rounded bg-ctp-surface0' />
        <CatTagRoller cats={post.categories as CatTag[]} tags={post.tags as CatTag[]} />
      </div>
    </div>
  );
}
