import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Link from 'next/link';
import { type Post } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import LocalDate from './local-date';
import { CatTagRoller } from './cat-tag-roller';

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
            alt={post.altText}
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

export const descriptionHelper = (rawStr: string | undefined, postSlug?: string | undefined, justDescr?: boolean) => {
  if (!rawStr) return;

  const findDescr = rawStr.split('\n').map((strPara) => {
    const paraFound = strPara.split(' ')[0];
    // negatively matches digits, upper/lowercase letters, whitespaces, colons, and accented latin chars.
    // this results in matching everything else, i.e. headers, block quotes, etc.
    if (strPara !== '' && !/[^a-zA-Z\d\s:\u00C0-\u00FF]/.test(paraFound!)) {
      return strPara;
    }
    return undefined;
  }) as string[];

  const foundDescr = findDescr.filter((el) => el)[0]?.split(' ');

  if (!foundDescr || foundDescr.length <= 1) return;

  const endInjection = foundDescr[foundDescr.length - 1]?.split('.');

  if (!endInjection || endInjection.length <= 1) return;

  const inject = endInjection.toSpliced(-1, 1, `... <nobr>[\`READ_MORE =>\`](${postSlug ?? 'blog'})</nobr>`);
  const injected = inject.join('');

  if (!injected) return;

  foundDescr.splice(-1, 1, injected).join(' ');

  return justDescr ? findDescr.filter((el) => el)[0] : foundDescr.join(' ');
};
