import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { batchMatterFetch, fetchMdx } from '@/utils/mdx-utils';
import { resMdxV3 } from '@/utils/mdx-bundler-utils';
import type { WorkMetaProps } from '../page';

export async function generateStaticParams() {
  const projMetas = await batchMatterFetch('./src/app/projects/works');
  if (!projMetas) return
  return projMetas.map((meta) => ({
    slug: (meta as WorkMetaProps).slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const folder = './src/app/projects/works';
  const data = await fetchMdx(folder, params.slug);
  if (!data) return;
  // eslint-disable-next-line -- any is needed here to make mdx-bundler types happy
  const resData: { code: string; frontmatter: Record<string, any> } = await resMdxV3(data, folder, params.slug);
  return <ProjPost code={resData.code} frontmatter={resData.frontmatter} />;
}

// eslint-disable-next-line -- any is needed here to make mdx-bundler types happy
function ProjPost({ code, frontmatter }: { code: string; frontmatter: Record<string, any> }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <article className=''>
      <header className='flex items-center justify-center p-10 md:py-20 lg:pb-[6.5rem] lg:pt-36'>
        <div className='flex w-full max-w-xl flex-col gap-10'>
          <h1 className='text-4xl font-black md:text-5xl'>{(frontmatter as WorkMetaProps).title}</h1>
          <p className='prose-protocol-omega'>{(frontmatter as WorkMetaProps).descr}</p>
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
