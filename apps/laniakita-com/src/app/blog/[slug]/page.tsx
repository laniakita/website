import path from 'node:path';
import { fetchFrontmatter } from '@/utils/mdx-utils';
import { PostHeader } from '@/app/blog/post-header';
import type { PostTeaserObjectProps } from '../page';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const filePath = path.resolve(process.cwd(), './src/app/blog/posts/published/', `${params.slug}.mdx`);
  const matterData = await fetchFrontmatter(filePath);
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- I'm not sure if you can type an MDX value
  const { default: MDXContent } = await import(`@/app/blog/posts/published/${params.slug}.mdx`);

  return (
    <main className='motion-safe:simple-color-trans -mb-0.5 min-h-full max-w-full bg-ctp-base dark:bg-ctp-midnight'>
      {matterData!==undefined&&(
      <article className=''>
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


