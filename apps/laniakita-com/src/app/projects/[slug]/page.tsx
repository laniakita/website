import { Suspense, useMemo } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'mdx-bundler/client';
import matter from 'gray-matter';
import { batchMatterFetch, fetchFrontmatter, fetchMdx } from '@/utils/mdx-utils';
import { resMdxV3 } from '@/utils/mdx-bundler-utils';
import type { WorkMetaProps } from '../page';
import ClientProjPost from '../client-mdx';
import path from 'node:path';

/*
export async function generateStaticParams() {
  const projMetas = await batchMatterFetch('./src/app/projects/works');
  return projMetas!.map((meta) => ({
    slug: (meta as WorkMetaProps).slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const folder = './src/app/projects/works';
  const data = await fetchMdx(folder, params.slug);
  const matterData = matter(data!).data;
  const projDescrMatter = matter(data!).content;

  const findDescr = projDescrMatter.split('\n').map((strPara) => {
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && strPara.split(' ')[0] !== '##') {
      return strPara;
    }
    return undefined;
  });

  const descr = findDescr.filter((el) => el);

  const previousImages = (await parent).openGraph?.images ?? [];

  const teaserImg = (matterData as WorkMetaProps).teaserImg;

  return {
    title: (matterData as WorkMetaProps).title,
    description: descr[0],
    openGraph: {
      title: (matterData as WorkMetaProps).title,
      description: descr[0],
      images: [teaserImg ? teaserImg : '', ...previousImages],
    },
    twitter: {
      card: 'summary',
      title: (matterData as WorkMetaProps).title,
      description: descr[0],
      images: [teaserImg ? teaserImg : '', ...previousImages],
    },
  };
}
*/

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const filePath = path.resolve(process.cwd(), './src/app/projects/posts/published/', `${params.slug}.mdx`)
  const matterData = await fetchFrontmatter(filePath)
  console.log(matterData)

  const { default: MDXContent } = await import(`@/app/projects/posts/published/${params.slug}.mdx`)


  return (
    <Suspense>
      <ClientProjPost frontmatter={matterData!}>
        <MDXContent />
      </ClientProjPost>
    </Suspense>
  );
}

/*
  const resData: { code: string; frontmatter: Record<string, any> } = await resMdxV3(data, folder, params.slug);


      {(resData.frontmatter as WorkMetaProps).type === 'computer-graphics' ? (
        <ClientProjPost code={resData.code} frontmatter={resData.frontmatter} />
      ) : (
        <DefaultProjPost code={resData.code} frontmatter={resData.frontmatter} />
      )}

// eslint-disable-next-line -- any is needed here to make mdx-bundler types happy
function DefaultProjPost({ code, frontmatter }: { code: string; frontmatter: Record<string, any> }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <article className=''>
      <header className='flex size-full flex-col items-center justify-center'>
        <div className='flex w-full items-center justify-center px-10 pt-10 md:pt-20 lg:pb-[6.5rem] lg:pt-36'>
          <div className='flex w-full max-w-xl flex-col gap-10'>
            <h1 className='text-4xl font-black md:text-5xl'>{(frontmatter as WorkMetaProps).title}</h1>
            <p className='prose-protocol-omega'>{(frontmatter as WorkMetaProps).descr}</p>
          </div>
        </div>
      </header>
      <div className='flex min-h-full items-center justify-center px-10 py-6'>
        <div className='prose-protocol-omega w-full'>
          <Component />
        </div>
      </div>
    </article>
  );
}
*/