/* eslint-disable @typescript-eslint/no-unsafe-assignment -- I'm not sure if you can type an MDX value */
import type { Metadata, ResolvingMetadata } from 'next';
import matter from 'gray-matter';
import { batchMatterFetch, fetchMdx, fetchMdxPath } from '@/utils/mdx-utils';
import { PostHeader } from '@/app/blog/post-header';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';

export async function generateStaticParams() {
  const postMetas = await batchMatterFetch('./src/app/blog/posts/published');
  return postMetas!.map((meta) => ({
    slug: (meta as PostTeaserObjectProps).slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const folder = './src/app/blog/posts/published';
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

  const heroImg = (matterData as PostTeaserObjectProps).heroFile;

  return {
    title: (matterData as PostTeaserObjectProps).headline,
    authors: [{ name: (matterData as PostTeaserObjectProps).author }],
    description: descr[0],
    openGraph: {
      title: (matterData as PostTeaserObjectProps).headline,
      description: descr[0],
      images: [heroImg ? heroImg : '', ...previousImages],
    },
    twitter: {
      card: 'summary',
      title: (matterData as PostTeaserObjectProps).headline,
      description: descr[0],
      images: [heroImg ? heroImg : '', ...previousImages],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  //const filePath = path.resolve(process.cwd(), './src/app/blog/posts/published/', `${params.slug}.mdx`);
  //const matterData = await fetchFrontmatter(filePath);
  const getFile = await fetchMdx('./src/app/blog/posts/published', params.slug);
  if (typeof getFile !== 'string') return;
  const matterData = matter(getFile).data;
  const getPath = await fetchMdxPath('./src/app/blog/posts/published', params.slug);
  if (!getPath) return;
  const findPathIndent = getPath.split('/').map((segment, index) => {
    if (segment === 'app') {
      return index;
    }
    return undefined;
  });
  const finalIndent = findPathIndent.filter((el) => el);
  const modPath = getPath
    .split('/')
    .slice(finalIndent[0]! + 2, getPath.length - 1)
    .join('/');

  const { default: MDXContent } = await import(`@/app/blog/${modPath}`);

  return (
    <main className='motion-safe:simple-color-trans -mb-0.5 min-h-full max-w-full bg-ctp-base dark:bg-ctp-midnight'>
      {(matterData as unknown) !== undefined && (
        <article id='content' className='flex size-full flex-col items-center justify-center'>
          <PostHeader dataObject={matterData as PostTeaserObjectProps} />

          <div className='flex min-h-full items-center justify-center px-10 py-6'>
            <div className='prose-protocol-omega'>
              <MDXContent />
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
