import localLoader from '@/lib/local-loader';
import { imageLoader } from '@/utils/image-loader';
import { resMdxNoImgBundle } from '@/utils/mdxbundler-main';
import { allCategories, allTags, type Post } from 'contentlayer/generated';
import { getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';
import { useMemo } from 'react';
import LocalDate from './local-date';
import Link from 'next/link';
import { Jersey_10 } from 'next/font/google';

export default function PostRollerV4({ posts }: { posts: Post[] }) {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col gap-6 md:gap-10'>
        {posts.map((post, idx) => (
          <PostPreviewV4 key={idx} {...post} />
        ))}
      </div>
    </div>
  );
}

function MiniMDX({ code, frontmatter }: Record<string, any>) {
  const MDXComponent = useMemo(() => getMDXComponent(code), [code]);
  return (
    <>
      <MDXComponent />
    </>
  );
}

interface CatTag {
  slug: string;
}

function CatTagRoller({ cats, tags }: { cats?: string[] | undefined; tags?: string[] | undefined }) {
  const categories = cats
    ? cats.map((cat) => {
        const category = allCategories.find(
          (category) => category._raw.flattenedPath === `categories/${(cat as unknown as CatTag).slug}`,
        );

        return category;
      })
    : [];
  const tagsArr = tags
    ? tags.map((tagIdx) => {
        const tag = allTags.find((tag) => tag._raw.flattenedPath === `tags/${(tagIdx as unknown as CatTag).slug}`);

        return tag;
      })
    : [];

  const comboArr = [...categories, ...tagsArr];

  return (
    <div className='flex flex-wrap'>
      {comboArr
        ? comboArr.map((combo, idx) => (
            <p key={idx} className='font-mono'>
              <Link href={`/${combo?._raw.flattenedPath}`}>
                <span className='font-bold'>{`${combo?.type === 'Tag' ? '#' : ''}${combo?.title}`}</span>
              </Link>
              {comboArr[idx]?.type === 'Category' && comboArr[idx + 1]?.type === 'Tag' ? (
                <span className='px-[1ch]'>{`|`}</span>
              ) : (
                idx < comboArr.length - 1 && <span className='pr-[1ch]'>{`,`}</span>
              )}
            </p>
          ))
        : ''}
    </div>
  );
}

async function PostPreviewV4(post: Post) {
  const descriptionStr = descriptionHelper(post.body.raw, post.url) as string;
  const MDXStr = await resMdxNoImgBundle(descriptionStr, './content2');

  return (
    <div className='flex basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 dark:border-ctp-base'>
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
      <div className='flex flex-col gap-6 p-6 md:p-10'>
        <div className=''>
          <div className='flex flex-wrap gap-[1ch] pb-2'>
            <p className='w-fit rounded-full font-mono'>
              <LocalDate date={new Date(post.date)} />
            </p>
            <span className='font-mono'>{'|'}</span>
            <CatTagRoller cats={post.categories} tags={post.tags} />
          </div>
          <h2 className='text-balance text-3xl font-black'>{post.headline}</h2>
          <h3 className='text-balance pt-2 text-2xl font-semibold'>{post.subheadline}</h3>
        </div>
        <div className='h-px w-full rounded bg-ctp-surface0' />
        <div className='prose-protocol-omega max-w-full text-pretty prose-p:my-0 prose-p:text-base prose-a:no-underline prose-code:text-xs'>
          <MiniMDX code={MDXStr.code} />
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

  console.log(foundDescr.splice(-1, 1, endInjection!).join(' '));

  return foundDescr.join(' ');
};
