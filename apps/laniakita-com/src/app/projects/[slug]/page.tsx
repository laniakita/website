import { batchMatterFetch, fetchMdx } from '@/utils/mdx-utils';
import { resMdxV3 } from '@/utils/mdx-bundler-utils';
import type { WorkMetaProps } from '../page';
import ClientProjPost from '../client-mdx';

export async function generateStaticParams() {
  const projMetas = await batchMatterFetch('./src/app/projects/works');
  return projMetas!.map((meta) => ({
    slug: (meta as WorkMetaProps).slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const folder = './src/app/projects/works';
  const data = await fetchMdx(folder, params.slug);
  if (!data) return;
  // eslint-disable-next-line -- any is needed here to make mdx-bundler types happy
  const resData: { code: string; frontmatter: Record<string, any> } = await resMdxV3(data, folder, params.slug);
  return <ClientProjPost code={resData.code} frontmatter={resData.frontmatter} />;
}


