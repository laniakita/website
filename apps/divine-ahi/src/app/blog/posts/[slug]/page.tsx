import { useMemo } from 'react';
import Link from 'next/link';
import { getMDXComponent } from 'mdx-bundler/client';
import { queryPostMetas, querySinglePost } from '@/lib/utils/mdxlite';
import { resMdx } from '@/lib/utils/mdx-bundler-utils';
import type { PostTeaserObjectProps } from '@/app/blog/page';
import { PostHeader } from '@/components/blog/post-header';
import CodeHighlighter from '@/components/code-highlighter';

export async function generateStaticParams() {
  const postMetas = await queryPostMetas();
  return postMetas.map((postObj) => ({
    slug: postObj.headline.replaceAll(' ', '_'),
  }));
}



export default async function Page({ params }: { params: { slug: string } }) {
  const slugDeserializer = params.slug.replaceAll('_', ' ');
  const postQ = await querySinglePost(slugDeserializer);
  const postSource = postQ?.rawContent?.trim();
  const resBundle = postSource && (await resMdx(postSource, 'blog-posts', params.slug));
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
        <div className='prose prose-catppuccin min-h-full max-w-3xl prose-pre:ctp-mocha prose-code:text-base prose-pre:max-w-[92.5vw] prose-pre:overflow-visible prose-pre:bg-ctp-base'>
          <Component  />
        </div>
      </div>
    </article>
  );
}
