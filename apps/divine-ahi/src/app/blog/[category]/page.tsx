import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { getMDXComponent } from 'mdx-bundler/client';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import LoadingSpinner from '@/components/loading-spinner';
import PreviewRollerV3 from '@/components/blog/post-roller-v3';
import { queryCategoryDescr } from '@/lib/utils/mdxlite';
import { resMdx } from '@/lib/utils/mdx-bundler-utils';


//import path from 'node:path';
//import process from 'node:process';
//import { insertFromRawIndex } from '@/lib/utils/mdxlite';

/*
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
*/

export default async function Page({ params }: { params: { category: string } }) {
  //const folder = path.resolve(process.cwd(), 'src/content')
  //await insertFromRawIndex(folder)

    

  //const pageDataStr = await getSinglePost({ isDescr: true, category: params.category });
  //const catDataArr = await getPostsV3({category: params.category});
  const descrQ = await queryCategoryDescr(params.category);
  const descrSource = descrQ?.rawContent?.trim();
  const resBundle = descrSource && await resMdx(descrSource, 'category-info')

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
          { resBundle ? <Description code={resBundle.code} /> : ''}
        </div>
      </div>
    </Suspense>
  );
}

function Description({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <div className='prose prose-catppuccin w-full max-w-2xl'>
      <Component />
    </div>
  );
}

/*
 *
 *>
          { catDataArr!.length >= 1 && <PreviewRollerV3 isCat={true} dataArr={catDataArr} /> }
        </PostNumStoreProvider>


function MDXtoJSX({ markdownString }: { markdownString: string }) {
  return (
    <div className='prose prose-catppuccin w-full max-w-2xl'>
      <Markdown>{markdownString}</Markdown>
    </div>
  );
}


 *   <PostNumStoreProvider>
          { catDataArr!.length >= 1 && <PreviewRollerV3 isCat={true} dataArr={catDataArr} /> }
        </PostNumStoreProvider>


function MDXtoJSX({ markdownString }: { markdownString: string }) {
  return (
    <div className='prose prose-catppuccin w-full max-w-2xl'>
      <Markdown>{markdownString}</Markdown>
    </div>
  );
}

*/
