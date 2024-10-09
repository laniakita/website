import Image from 'next/image';
import Link from 'next/link';
import { descriptionHelper } from '@/lib/description-helper';
import { type Post } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import GlobalMDXRenderer from '@/components/mdx/global-mdx-renderer';
import { CatTagRoller } from './cat-tag-roller';
import PostDate from './[id]/[slug]/post-date';

export default function PostPreviewV4(post: Post) {
  const descriptionStr = descriptionHelper(post.body.raw, post.url)!;
  const res = post.featured_image as FeaturedImageR1;

  return (
    <div className='flex basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 dark:border-ctp-base'>
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
                  <strong>Updated:</strong> <PostDate date={post.updated} />
                </p>
              </div>
            ) : (
              <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                <PostDate date={post.date} />
              </p>
            )}
          </div>

          <div>
            <h2 className='w-fit text-balance text-3xl font-black'>
              <Link href={post.url} className='text-ctp-text'>
                {post.headline}
              </Link>
            </h2>
            <h3 className='text-balance text-2xl font-light'>{post.subheadline}</h3>
          </div>
        </div>
        <div className='h-px w-full rounded bg-ctp-surface0' />
        <div className='prose-protocol-omega max-w-full text-pretty prose-p:my-0 prose-a:no-underline'>
          <GlobalMDXRenderer>{descriptionStr}</GlobalMDXRenderer>
        </div>
        <div className='h-px w-full rounded bg-ctp-surface0' />
        <CatTagRoller cats={post.categories} tags={post.tags} />
      </div>
    </div>
  );
}
