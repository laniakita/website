import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { Post, Tag, Category } from 'contentlayer/generated';
import PostRollerV4 from '@/app/blog2/post-roller-v4';


export function MiniLayout({ data, posts }: { data: Category | Tag; posts: Post[] }) {
  return (
    <div className='simple-color-trans common-padding relative z-[5] -mb-1 flex flex-col gap-2 bg-ctp-base dark:bg-ctp-midnight md:gap-4'>
      <div className='flex items-center justify-center'>
        <div className='flex w-full max-w-3xl flex-col gap-2 rounded-md border border-ctp-surface0 p-6 dark:border-ctp-base'>
          <div className=''>
            <h1 className='text-4xl font-black md:text-5xl'>{data.title}</h1>
          </div>
          <div className='h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base' />
          <div className='prose-protocol-omega w-full max-w-sm prose-p:my-0'>
            <MDXComponent content={data.body.code} />
          </div>
        </div>
      </div>
      {posts.length >= 1 ? (
        <PostRollerV4 posts={posts} />
      ) : (
        <div>
          <p>Oops no categorys founds. Hmm, somethings wrong here.</p>
        </div>
      )}
    </div>
  );
}

function MDXComponent({ content }: { content: string }) {
  const MDXContent = useMDXComponent(content);
  return <MDXContent />;
}
