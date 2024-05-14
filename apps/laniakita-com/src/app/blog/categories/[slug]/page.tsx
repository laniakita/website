import path from 'node:path';
import type { Metadata, ResolvingMetadata } from 'next';
import matter from 'gray-matter';
import { batchMatterFetch, batchMatterFetchByType, fetchFrontmatter, fetchMdx } from '@/utils/mdx-utils';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import PreviewRollerV3 from '@/app/blog/post-roller-v3';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';

export interface CategoryProps {
  type?: string;
  slug: string;
  title: string;
}

export async function generateStaticParams() {
  const catMetas = await batchMatterFetch('./src/app/blog/categories/posts/published');
  return catMetas!.map((meta) => ({
    slug: (meta as CategoryProps).slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const folder = './src/app/blog/categories/posts/published';
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

  //const heroImg = (matterData as PostTeaserObjectProps).heroFile;

  return {
    title: (matterData as PostTeaserObjectProps).headline,
    description: descr[0],
    openGraph: {
      title: (matterData as PostTeaserObjectProps).headline,
      description: descr[0],
      images: [...previousImages],
    },
    twitter: {
      card: 'summary',
      title: (matterData as PostTeaserObjectProps).headline,
      description: descr[0],
      images: [...previousImages],
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const filePath = path.resolve(process.cwd(), './src/app/blog/categories/posts/published/', `${params.slug}.mdx`);
  const matterData = await fetchFrontmatter(filePath);
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- I'm not sure if you can type an MDX value
  const { default: MDXContent } = await import(`@/app/blog/categories/posts/published/${params.slug}.mdx`);
  const catDataArr = await batchMatterFetchByType('./src/app/blog/posts/published', 'category-slug', params.slug);
  return (
    <div className='simple-color-trans relative z-[5] -mb-1  bg-ctp-base dark:bg-ctp-midnight'>
      <div className='flex items-center justify-center'>
        <div className='flex w-full max-w-7xl flex-col gap-6 p-10 md:gap-10 md:py-20 lg:pb-[6.5rem] lg:pt-36 2xl:px-20'>
          <div className='space-y-2'>
            <h3 className='font-mono text-xl font-semibold'>Posts tagged:</h3>
            <h1 className='text-4xl font-black md:text-5xl'>#{(matterData as CategoryProps).title}</h1>
          </div>
          <div className='prose-protocol-omega prose prose-catppuccin w-full max-w-2xl'>
            <MDXContent />
          </div>
        </div>
      </div>
      <PostNumStoreProvider>
        {catDataArr !== undefined && (catDataArr as unknown as PostTeaserObjectProps[]).length >= 1 && (
          <PreviewRollerV3 isCat dataArr={catDataArr as PostTeaserObjectProps[]} />
        )}
      </PostNumStoreProvider>
    </div>
  );
}
