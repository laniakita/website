import type { Metadata, ResolvingMetadata } from 'next';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import PreviewRollerV3 from '@/app/blog/post-roller-v3';
import {
  type QueryPostMetaItem,
  type TagQ,
  descriptionHelper,
  getAllTags,
  getPostsWithTagSlug,
  tagQ,
} from '@/lib/node-db-funcs';
import { resMdxV3 } from '@/utils/mdxbundler-main';
import { MdxJsx } from '../../../posts/[id]/[slug]/page';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  const tags = (await getAllTags()) as unknown as TagQ[];
  return tags.map((meta) => ({
    id: meta.id,
    slug: meta.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { id: string; slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const tagQRes = (await tagQ(params.id, params.slug)) as unknown as TagQ;
  const findDescr = descriptionHelper(tagQRes.rawStr);
  const descr = findDescr ? findDescr.filter((el) => el) : '';
  const previousImgs = (await parent).openGraph?.images;
  const previousImages = previousImgs ? previousImgs : [''];
  return {
    title: tagQRes.title,
    description: descr[0],
    openGraph: {
      title: tagQRes.title,
      description: descr[0],
      images: [...previousImages],
    },
    twitter: {
      card: 'summary',
      title: tagQRes.title,
      description: descr[0],
      images: [...previousImages],
    },
  };
}

export default async function TagPage({ params }: { params: { id: string; slug: string } }) {
  const tagQRes = await tagQ(params.id, params.slug);
  if (tagQRes!.slug !== params.slug) {
    redirect(`/blog/posts/${params.id}/${tagQRes!.slug}`);
  }
  if (!tagQRes) return;
  const cwdFolderStrPre = tagQRes?.localKey?.split('/');
  const cwdFolderStr = cwdFolderStrPre?.slice(0, cwdFolderStrPre.length - 1).join('/');
  const rawMDX = tagQRes?.rawStr;
  if (!rawMDX) return;
  if (!cwdFolderStr) return;
  const goodSlug = tagQRes.slug
  const resMdx = await resMdxV3(rawMDX, cwdFolderStr, params.slug, 'tags');
  const matchTagArr = await getPostsWithTagSlug(params.id, goodSlug);

  return (
    <div className='simple-color-trans relative z-[5] -mb-1  bg-ctp-base dark:bg-ctp-midnight'>
      <div className='flex items-center justify-center'>
        <div className='flex w-full max-w-7xl flex-col gap-6 p-10 md:gap-10 md:py-20 lg:pb-[6.5rem] lg:pt-36 2xl:px-20'>
          <div className='space-y-2'>
            <h1 className='text-4xl font-black md:text-5xl'>#{tagQRes?.title}</h1>
          </div>
          <div className='prose-protocol-omega w-full max-w-2xl'>
            <MdxJsx code={resMdx.code} />
          </div>
        </div>
      </div>
      <PostNumStoreProvider>
        <PreviewRollerV3 isCat dataArr={matchTagArr} />
      </PostNumStoreProvider>
    </div>
  );
}
