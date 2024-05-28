import type { Metadata, ResolvingMetadata } from 'next';
import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { redirect } from 'next/navigation';
import { PostHeader } from '@/app/blog/post-header';
import {
  type PostQ,
  type QueryPostMetaItem,
  queryPostByIdandSlugOrJustIdForJustRawStr,
  queryPostMetaByIdandSlugOrJustId,
  queryPostMetas,
} from '@/lib/node-db-funcs';
import { resMdxV3 } from '@/utils/mdxbundler-main';
import BlogImageBlurServer from '@/app/blog/blog-image-blur-wrapper';
import descriptionHelper from '@/utils/description-helper';

export async function generateStaticParams() {
  const postMetas = (await queryPostMetas()) as unknown as QueryPostMetaItem[];
  return postMetas.map((meta) => ({
    id: meta.id.split('-').shift(),
    slug: meta.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { id: string; slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metaRes = (await queryPostMetaByIdandSlugOrJustId({
    idStr: params.id,
    slugStr: params.slug,
  })) as unknown as QueryPostMetaItem;
  const rawRes = await queryPostByIdandSlugOrJustIdForJustRawStr({ idStr: params.id, slugStr: params.slug });

  const findDescr = rawRes?.rawStr ? descriptionHelper(rawRes.rawStr) : ["Lani's Blog"];
  const descr = findDescr ? findDescr.filter((el) => el) : '';
  const previousImages = (await parent).openGraph?.images ?? [];
  const featuredImg = metaRes.featuredImage?.fileLocation;
  return {
    title: metaRes.headline,
    authors: [{ name: metaRes.author.name }],
    description: descr[0],
    openGraph: {
      title: metaRes.headline,
      description: descr[0],
      images: [featuredImg ? featuredImg : '', ...previousImages],
    },
    twitter: {
      card: 'summary',
      title: metaRes.headline,
      description: descr[0],
      images: [featuredImg ? featuredImg : '', ...previousImages],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { id: string; slug: string } }) {
  const postQ = (await queryPostMetaByIdandSlugOrJustId({
    idStr: params.id,
    slugStr: params.slug,
  })) as unknown as PostQ;
  if (postQ.slug !== params.slug) {
    redirect(`/blog/posts/${params.id}/${postQ.slug}`);
  }
  const cwdFolderStrPre = postQ.localKey.split('/');
  const cwdFolderStr = cwdFolderStrPre.slice(0, cwdFolderStrPre.length - 1).join('/');
  const rawMDX = postQ.rawStr;
  if (!rawMDX) return;
  if (!cwdFolderStr) return;
  const resMdx = await resMdxV3(rawMDX, cwdFolderStr, params.id, 'blog');
  return (
    <main className='motion-safe:simple-color-trans -mb-0.5 min-h-full max-w-full bg-ctp-base dark:bg-ctp-midnight'>
      {(resMdx as unknown) !== undefined && (
        <article id='content' className='flex size-full flex-col items-center justify-center'>
          <PostHeader dataObject={postQ} />

          <div className='flex min-h-full items-center justify-center px-10 py-6'>
            <div className='prose-protocol-omega'>
              <MdxJsx code={resMdx.code} />
            </div>
          </div>
        </article>
      )}
    </main>
  );
}

export function MdxJsx({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={{ img: BlogImageBlurServer }} />;
}