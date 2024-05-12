import { Suspense, useMemo } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'mdx-bundler/client';
import matter from 'gray-matter';
import { batchMatterFetch, fetchFrontmatter, fetchMdx } from '@/utils/mdx-utils';
import { resMdxV3 } from '@/utils/mdx-bundler-utils';
import type { WorkMetaProps } from '../page';
import path from 'node:path';
import dynamic from 'next/dynamic';

const ServerOnlyProjPost = dynamic(()=>import('../server-mdx'),{ssr:true});
const ClientProjPost = dynamic(()=>import('../client-mdx'), {ssr: false});


export async function generateStaticParams() {
  const projMetas = await batchMatterFetch('./src/app/projects/published');
  return projMetas!.map((meta) => ({
    slug: (meta as WorkMetaProps).slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const folder = './src/app/projects/posts/published';
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


export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const filePath = path.resolve(process.cwd(), './src/app/projects/posts/published/', `${params.slug}.mdx`)
  const matterData = await fetchFrontmatter(filePath)
  console.log(matterData)

  const { default: MDXContent } = await import(`@/app/projects/posts/published/${params.slug}.mdx`)


  return (
    <main className='min-h-screen size-full'>
      {(matterData as WorkMetaProps).type === 'computer-graphics' ? (
      <ClientProjPost frontmatter={matterData!}>
        <MDXContent />
      </ClientProjPost>
      ): (
        <ServerOnlyProjPost frontmatter={matterData!}>
          <MDXContent />
        </ServerOnlyProjPost>
      )
    }
    </main>
  );
}

/*
  const resData: { code: string; frontmatter: Record<string, any> } = await resMdxV3(data, folder, params.slug);


      {(resData.frontmatter as WorkMetaProps).type === 'computer-graphics' ? (
        <ClientProjPost code={resData.code} frontmatter={resData.frontmatter} />
      ) : (
        <DefaultProjPost code={resData.code} frontmatter={resData.frontmatter} />
      )}

*/