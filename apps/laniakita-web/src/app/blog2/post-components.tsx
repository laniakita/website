import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';
import localLoader from '@/lib/local-loader';
import { type Post } from 'contentlayer/generated';
import LocalDate from './local-date';
import { CatTagRoller } from './cat-tag-roller';

export default function PostRollerV4({ posts }: { posts: Post[] }) {
  const uniqueKey = useId();

  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col gap-2 md:gap-6'>
        {posts.map((post, idx) => (
          <PostPreviewV4 key={`blog-post-${uniqueKey}-${Math.floor(Math.random() * 1000)}`} {...post} />
        ))}
      </div>
    </div>
  );
}

async function PostPreviewV4(post: Post) {
  const descriptionStr = descriptionHelper(post.body.raw, post.url)!;

  return (
    <div className='flex basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 dark:border-ctp-base'>
      {post.featured_image.src !== null || post.featured_image.src !== undefined ? (
        <Link href={post.url}>
          <Image
            loader={
              localLoader
              //imageLoader
            }
            src={post.featured_image.src}
            placeholder='blur'
            blurDataURL={post.featured_image.base64}
            alt={post.altText!}
            height={post.featured_image.height}
            width={post.featured_image.width}
            sizes='(max-width: 300px) 70vw, (max-width: 600px) 45vw, (max-width:1500px) 27vw'
            className='object-contain'
          />
        </Link>
      ) : (
        ''
      )}
      <div className='flex flex-col gap-4 p-8 lg:p-10'>
        <div className=''>
          <div className='flex flex-wrap gap-[1ch] pb-2'>
            <p className='w-fit rounded-full font-mono'>
              <LocalDate date={new Date(post.date)} />
            </p>
            <span className='font-mono'>|</span>
            <CatTagRoller cats={post.categories} tags={post.tags} />
          </div>

          <h2 className='w-fit text-balance text-3xl font-black'>
            <Link href={post.url} className='text-ctp-text'>
              {post.headline}
            </Link>
          </h2>
          <h3 className='text-balance pt-2 text-2xl font-light'>{post.subheadline}</h3>
        </div>
        <div className='h-px w-full rounded bg-ctp-surface0' />
        <div className='prose-protocol-omega max-w-full text-pretty prose-p:my-0 prose-a:no-underline'>
          <Markdown options={{ forceBlock: true }}>{descriptionStr}</Markdown>
        </div>
      </div>
    </div>
  );
}

const descriptionHelper = (rawStr: string, postSlug?: string) => {
  if (!rawStr) return;

  const findDescr = rawStr.split('\n').map((strPara) => {
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && strPara.split(' ')[0] !== '##') {
      return strPara;
    }
    return undefined;
  });

  const foundDescr = findDescr.filter((el) => el)[0]!.split(' ');

  const endInjection = foundDescr[foundDescr.length - 1]
    ?.split('.')
    .toSpliced(-1, 1, `... [\`READ_MORE =>\`](/${postSlug ?? 'blog'})`)
    .join('');

  foundDescr.splice(-1, 1, endInjection!).join(' ');

  return foundDescr.join(' ');
};
