/*
import { Suspense } from 'react';
import LoadingSpinner from '@/components/loadingSpinner';
import Link from 'next/link';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import PreviewRollerV3 from '@/components/blog/postRollerV3';
import Markdown from 'markdown-to-jsx';
import { getAllCategoryTitles, getSinglePost, getPostsV3, getAllCategoryKeys } from '@/lib/bucketUtils';
import { _Object } from '@aws-sdk/client-s3';

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  const getCatKeys = await getAllCategoryKeys()
  const getCategoryParams = await getAllCategoryTitles(getCatKeys as Array<_Object>);
  if (!getCategoryParams) {
    return
  }
  return getCategoryParams.map((title) => ({
    category: title,
  }));
}

export default async function Page({ params }: { params: { category: string } }) {
  const pageDataStr = await getSinglePost({ isDescr: true, category: params.category });
  const catDataArr = await getPostsV3({category: params.category});
  

  return (
    <Suspense fallback={<LoadingSpinner overrides='h-screen bg-black' />}>
      <div className='simple-color-trans relative z-[5] -mb-1  bg-ctp-base dark:bg-ctp-crust'>
        <div className='flex flex-col gap-6 px-4 py-6 md:gap-10  md:p-10 lg:pt-[5.5rem] 2xl:px-20'>
          <div className='flex flex-row gap-2 font-mono text-sm lowercase'>
            <Link href='/'>Home</Link>
            <span>{`>`}</span>
            <Link href='/blog'>Blog</Link>
            <span>{`>`}</span>
            <p>{params.category}</p>
          </div>
          <div className='space-y-2'>
            <h3 className='font-mono text-xl font-semibold'>Posts tagged:</h3>
            <h1 className=' text-5xl font-black uppercase md:text-6xl'>#{params.category}</h1>
          </div>
          {pageDataStr && <MDXtoJSX markdownString={pageDataStr} />}
        </div>
        
        <PostNumStoreProvider>
          { catDataArr!.length >= 1 && <PreviewRollerV3 isCat={true} dataArr={catDataArr} /> }
        </PostNumStoreProvider>
        {/
          { catMatches.length >= 1 &&  }
        //}
      </div>
    </Suspense>
  );
}

function MDXtoJSX({ markdownString }: { markdownString: string }) {
  return (
    <div className='prose prose-catppuccin w-full max-w-2xl'>
      <Markdown>{markdownString}</Markdown>
    </div>
  );
}

*/
