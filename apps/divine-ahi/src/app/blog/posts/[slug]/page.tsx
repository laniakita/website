import { useMemo } from 'react';
import Link from 'next/link';
import { getMDXComponent } from 'mdx-bundler/client';
import { querySinglePost } from '@/lib/utils/mdxlite';
import { resMdx } from '@/lib/utils/mdx-bundler-utils';
import { PostHeader } from '@/components/blog/post-header';
import type { PostTeaserObjectProps } from '@/app/blog/page';

/*
import { getRecentKeys, getSinglePost, getPostInfoFromKey } from '@/lib/bucketUtils';
import { PostHeader } from '@/components/blog/postHeader';
import Markdown from 'markdown-to-jsx';
import matter from 'gray-matter';

import YTEmbed from '@/components/blog/ytEmbed';
import { _Object } from '@aws-sdk/client-s3';

export const runtime = 'edge';

export const dynamicParams = false;
export const revalidate = 86400;


export async function generateStaticParams() {
  const keySet = await getRecentKeys({});
  const infoSet = keySet.map((keyObj) => {
    const dataObj = getPostInfoFromKey(keyObj as _Object);
    return dataObj;
  });

  return infoSet.map((postObj) => ({
    year: postObj.year,
    category: postObj.category,
    slug: postObj.slug,
  }));
}
*/

export default async function Page({ params }: { params: { year: string; slug: string } }) {
  const slugDeserializer = params.slug.replaceAll('_', ' ');
  const postQ = await querySinglePost(slugDeserializer);
  const postSource = postQ?.rawContent?.trim();
  const resBundle = postSource && (await resMdx(postSource, 'blog-posts'));
  const headerData = postSource && {
    id: postQ?.id,
    authorName: postQ?.authorName,
    date: postQ?.date,
    headline: postQ?.headline,
    subheadline: postQ?.subheadline,
    category: postQ?.category,
    heroFile: postQ?.heroFile,
    heroCredit: postQ?.heroCredit,
    heroCreditUrl: postQ?.heroCreditUrl,
    heroCreditUrlText: postQ?.heroCreditUrlText,
    heroAltText: postQ?.heroAltText,
  };

  return (
    <div className=' simple-color-trans -mb-0.5 min-h-full bg-ctp-base pt-6 dark:bg-ctp-crust md:pt-10 lg:pt-[5.5rem]'>
      <div className='flex items-center justify-center px-4 md:px-10'>
        <div className='w-full max-w-3xl '>
          <div className='flex flex-wrap gap-2 font-mono text-sm lowercase'>
            <Link href='/'>Home</Link>
            <span>{`>`}</span>
            <Link href='/blog'>Blog</Link>
            <span>{`>`}</span>
            <p>{params.slug}</p>
          </div>
        </div>
      </div>
      {resBundle ? <Post code={resBundle.code} teaserObj={headerData as PostTeaserObjectProps} /> : ''}
    </div>
  );
}

function Post({ code, teaserObj }: { code: string; teaserObj: PostTeaserObjectProps }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <article>
      <PostHeader dataObject={teaserObj} />
      <div className='flex min-h-full items-center justify-center px-4 py-6 md:p-10'>
        <div className='prose prose-catppuccin min-h-full max-w-3xl prose-pre:ctp-mocha prose-pre:max-w-[92.5vw] prose-pre:bg-ctp-base'>
          <Component  />
        </div>
      </div>
    </article>
  );
}

/*components={{code: TestLight}}
 *
 *      <MDXtoJSX markdownString={postStr!}>
        <PostHeader dataObject={matter(postStr!).data} />
      </MDXtoJSX>
 *
function MDXtoJSX({ markdownString, children }: { markdownString: string; children: any }) {
  return (
    <article>
      {children}
      <div className='flex min-h-full items-center justify-center px-4 py-6 md:p-10'>
        <div className='prose prose-catppuccin min-h-full max-w-3xl prose-pre:ctp-mocha prose-pre:max-w-[92.5vw] prose-pre:bg-ctp-base'>
          <Markdown options={{ overrides: { YTEmbed: { component: YTEmbed } } }}>{markdownString}</Markdown>
        </div>
      </div>
    </article>
  );
}
*/
