import Image from 'next/image';
import Link from 'next/link';
import type { FeaturedImageR1 } from '@/lib/image-process';
import GlobalMDXRenderer from '@/components/mdx/global-mdx-renderer';
import { CatTag, CatTagRoller } from './cat-tag-roller';
import LocalDate from './local-date';
import { allPosts } from '@/lib/fumadocs';

export default function PostPreviewV4(post: (typeof allPosts)[0]) {
  const res = post.featured_image as FeaturedImageR1;

  return (
    <div className='flex basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans dark:border-ctp-base dark:bg-ctp-midnight'>
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
            className='object-contain'
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
        <div className='prose-protocol-omega max-w-full text-pretty prose-p:my-0 prose-a:no-underline'>
          <GlobalMDXRenderer>{post.description}</GlobalMDXRenderer>
        </div>
        <div className='h-px w-full rounded bg-ctp-surface0' />
        <CatTagRoller cats={post.categories as CatTag[]} tags={post.tags as CatTag[]} />
      </div>
    </div>
  );
}
