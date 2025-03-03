import { categories, tags } from '$/.source';
import { allPosts } from '@/lib/fumadocs';
import PostRollerV4 from '@/app/(content)/blog/post-roller-v4';
import { mdxComponents } from '@/mdx-components';

export function MiniLayout({
  data,
  posts,
  isTag,
}: {
  data: (typeof categories)[0] | (typeof tags)[0];
  posts: typeof allPosts;
  isTag?: boolean;
}) {
  const MDXComponent = data.body;
  return (
    <div className='relative z-[5] -mb-1 flex flex-col gap-4 common-padding md:gap-6'>
      <div className='flex items-center justify-center'>
        <div className='flex w-full max-w-3xl flex-col gap-4 rounded-md border border-ctp-surface0 bg-ctp-base p-8 motion-safe:simple-color-trans dark:border-ctp-base dark:bg-ctp-midnight'>
          <div className=''>
            <h1 className='text-3xl font-black md:text-4xl'>{`${isTag ? '#' : ''}${data.title}`}</h1>
          </div>
          <div className='h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base' />
          <div className='prose-protocol-omega w-full max-w-sm prose-p:my-0'>
            {/* @ts-expect-error -- types issues */}
            <MDXComponent components={mdxComponents} />
          </div>
        </div>
      </div>
      {posts.length >= 1 ? (
        <PostRollerV4 posts={posts} isBlog={false} />
      ) : (
        <div>
          <p>Oops no matching posts founds. Hmm, somethings wrong here.</p>
        </div>
      )}
    </div>
  );
}
