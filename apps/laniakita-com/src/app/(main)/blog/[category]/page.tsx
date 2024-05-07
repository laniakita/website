import { Suspense, useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import type { Metadata, ResolvingMetadata } from 'next'
import matter from 'gray-matter';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import LoadingSpinner from '@/components/loading-spinner';
import PreviewRollerV3 from '@/components/blog/post-roller-v3';
import { queryCategoryDescr, queryPostsByCategory, queryCategoryMetas } from '@/utils/mdxlite-utils';
import { resMdx } from '@/utils/mdx-bundler-utils';
import type { PostTeaserObjectProps } from '../page';

export async function generateStaticParams() {
  const catMetas = await queryCategoryMetas();
  return catMetas.map((postObj) => ({
    category: postObj.title.replaceAll(' ', '_'),
  }));
}


export async function generateMetadata(
  { params }: { params: { category: string }},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const catDeserializer = params.category.replaceAll('_', ' ');
  const descrQ = await queryCategoryDescr(catDeserializer);
  const descrSource = descrQ?.rawContent?.trim();
  const descrMatter = descrSource && matter(descrSource).content
  const previousImages = (await parent).openGraph?.images ?? []

  return {
    title: catDeserializer,
    description: descrMatter?.split('\n')[0],
    openGraph: {
      title: descrQ?.title,
      description: descrMatter ? descrMatter.split('\n')[0] : '',
      images: [...previousImages]
    }
  }
}

export default async function Page({ params }: { params: { category: string } }) {
  const catDeserializer = params.category.replaceAll('_', ' ');
  const descrQ = await queryCategoryDescr(catDeserializer);
  const descrSource = descrQ?.rawContent?.trim();
  const resBundle = descrSource && (await resMdx(descrSource, 'category-info', params.category));
  const catDataArr = await queryPostsByCategory(catDeserializer);

  return (
    <Suspense fallback={<LoadingSpinner overrides='h-screen bg-black' />}>
      <div className='simple-color-trans relative z-[5] -mb-1  bg-ctp-base dark:bg-ctp-midnight'>
        <div className='flex flex-col gap-6 p-10 md:gap-10 lg:pt-[5.5rem] 2xl:px-20'>
          <div className='space-y-2'>
            <h3 className='font-mono text-xl font-semibold'>Posts tagged:</h3>
            <h1 className=' text-5xl font-black uppercase md:text-6xl'>#{catDeserializer}</h1>
          </div>
          {resBundle ? (
            <Description code={resBundle.code} />
          ) : (
            <div className='prose prose-catppuccin w-full max-w-2xl'>
              <p>whoops, no posts found!</p>
            </div>
          )}
        </div>
        <PostNumStoreProvider>
          {catDataArr.length >= 1 && <PreviewRollerV3 isCat dataArr={catDataArr as PostTeaserObjectProps[]} />}
        </PostNumStoreProvider>
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


 *   


function MDXtoJSX({ markdownString }: { markdownString: string }) {
  return (
    <div className='prose prose-catppuccin w-full max-w-2xl'>
      <Markdown>{markdownString}</Markdown>
    </div>
  );
}

*/
