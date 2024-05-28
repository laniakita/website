import type { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import PreviewRollerV3 from '@/app/blog/post-roller-v3';
import { getAllTags, getTag, getPostsWithTagID, type QueryPostMetaItem, type TagQ } from '@/lib/node-db-funcs';
import { resMdxV3 } from '@/utils/mdxbundler-main';
import descriptionHelper from '@/utils/description-helper';
import { MdxJsx } from '../../../posts/[id]/[slug]/page';

export async function generateStaticParams() {
  const tags = (await getAllTags()) as unknown as TagQ[];
  return tags.map((meta) => ({
    id: meta.id.split('-').shift(),
    slug: meta.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { id: string; slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const tagQRes = await getTag({ idStr: params.id, slugStr: params.slug });

  const findDescr = descriptionHelper((tagQRes as TagQ).rawStr);
  const descr = findDescr ? findDescr.filter((el) => el) : '';
  const previousImgs = (await parent).openGraph?.images;
  const previousImages = previousImgs ? previousImgs : [''];
  return {
    title: (tagQRes as TagQ).title,
    description: descr[0],
    openGraph: {
      title: (tagQRes as TagQ).title,
      description: descr[0],
      images: [...previousImages],
    },
    twitter: {
      card: 'summary',
      title: (tagQRes as TagQ).title,
      description: descr[0],
      images: [...previousImages],
    },
  };
}

export default async function TagPage({ params }: { params: { id: string; slug: string } }) {
  const firstQ = (await getTag({ idStr: params.id, slugStr: params.slug })) as unknown as TagQ;

  if (params.slug !== firstQ.slug) {
    const url = `/blog/tags/${params.id}/${firstQ.slug}`;
    redirect(url);
  }

  const relatedPostQ = await getPostsWithTagID(params.id);
  if (!relatedPostQ) return;

  const cwdFolderStrPre = firstQ.localKey.split('/');
  const cwdFolderStr = cwdFolderStrPre.slice(0, cwdFolderStrPre.length - 1).join('/');

  const rawMdx = firstQ.rawStr;
  if (!rawMdx) return;
  if (!cwdFolderStr) return;
  const resMdx = await resMdxV3(rawMdx, cwdFolderStr, firstQ.slug, 'tags');

  return (
    <div className='simple-color-trans relative z-[5] -mb-1  bg-ctp-base dark:bg-ctp-midnight'>
      <div className='flex items-center justify-center'>
        <div className='flex w-full max-w-7xl flex-col gap-6 p-10 md:gap-10 md:py-20 lg:pb-[6.5rem] lg:pt-36 2xl:px-20'>
          <div className='space-y-2'>
            <h1 className='text-4xl font-black md:text-5xl'>#{firstQ.title}</h1>
          </div>
          <div className='prose-protocol-omega w-full max-w-2xl'>
            <MdxJsx code={resMdx.code} />
          </div>
        </div>
      </div>
      {relatedPostQ.length >= 1 ? (
        <PostNumStoreProvider>
          <PreviewRollerV3 isCat dataArr={relatedPostQ as unknown as QueryPostMetaItem[]} />
        </PostNumStoreProvider>
      ) : (
        <div>
          <p>Oops no posts founds. Hmm, somethings wrong here.</p>
        </div>
      )}
    </div>
  );
}

/*
  const initQRes = await tagQ(params.id, params.slug);
   const qSlug = initQRes?.slug
  if (qSlug !== params.slug) {
    redirect(`/blog/tags/${params.id}/${qSlug}}`);
  }
  const tagQRes = await tagQ(params.id, qSlug)
  if (!tagQRes) return;
  const cwdFolderStrPre = tagQRes.localKey?.split('/');
  const cwdFolderStr = cwdFolderStrPre?.slice(0, cwdFolderStrPre.length - 1).join('/');
  const rawMDX = tagQRes.rawStr;
  if (!rawMDX) return;
  if (!cwdFolderStr) return;
  const goodSlug = tagQRes.slug
  const resMdx = await resMdxV3(rawMDX, cwdFolderStr, params.slug, 'tags');
  const matchTagArr = await getPostsWithTagSlug(params.id, goodSlug);


    <div>hi</div>


    </div>
**/
