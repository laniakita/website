import path from 'node:path';
import type { Metadata, ResolvingMetadata } from 'next';
import dynamic from 'next/dynamic';
import matter from 'gray-matter';
import { batchMatterFetch, fetchFrontmatter, fetchMdx } from '@/utils/mdx-utils';
import type { WorkMetaProps } from '../page';

const ServerOnlyProjPost = dynamic(() => import('../server-mdx'), { ssr: true });
const ClientProjPost = dynamic(() => import('../client-mdx'), { ssr: false });

export async function generateStaticParams() {
  const projMetas = await batchMatterFetch('./src/app/projects/posts/published');
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
  const filePath = path.resolve(process.cwd(), './src/app/projects/posts/published/', `${params.slug}.mdx`);
  const matterData = await fetchFrontmatter(filePath);
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- I'm not sure if you can type an MDX value
  const { default: MDXContent } = await import(`@/app/projects/posts/published/${params.slug}.mdx`);

  return (
    <main className='size-full min-h-screen'>
      {(matterData as WorkMetaProps).type === 'computer-graphics' ? (
        <ClientProjPost frontmatter={matterData as WorkMetaProps}>
          <MDXContent />
        </ClientProjPost>
      ) : (
        <ServerOnlyProjPost frontmatter={matterData as WorkMetaProps}>
          <MDXContent />
        </ServerOnlyProjPost>
      )}
    </main>
  );
}
