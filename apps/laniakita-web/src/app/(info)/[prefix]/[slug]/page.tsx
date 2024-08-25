import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { compareDesc } from 'date-fns';
import { allCategories, allTags, allPosts, type Post, type Tag, type Category } from 'contentlayer/generated';
import PostRollerV4 from '@/app/blog2/post-roller-v4';

export default function CatTagPage({ params }: { params: { prefix: string; slug: string } }) {
  if (params.prefix === 'tags') {
    const tag = allTags.find((tagX) => tagX.url.split('/').pop() === params.slug);
    const matchingPosts = allPosts
      .filter((postX) => postX.tags?.some((tagXP) => (tagXP as unknown as { slug: string }).slug === params.slug))
      .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

    if (!tag) return notFound();

    return <MiniLayout data={tag} posts={matchingPosts} />;
  } else if (params.prefix === 'categories') {
    const category = allCategories.find((catX) => catX.url.split('/').pop() === params.slug);
    const matchingPosts = allPosts
      .filter((postX) => postX.categories?.some((cat) => (cat as unknown as { slug: string }).slug === params.slug))
      .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

    if (!category) return notFound();

    return <MiniLayout data={category} posts={matchingPosts} />;
  }
  /* I'm skeptical of returning a 404, since this returns a 404
   * for every page other than cats and tags. However, routing
   * still works, so I'm guessing next.js just tries the next
   * available route. Though, I won't be surprised if this
   * "hacky" workaround for DRY+Aesthetics breaks in the 
   * future or causes bugs down the line.
   */
  return notFound();
}

function MiniLayout({ data, posts }: { data: Category | Tag; posts: Post[] }) {
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
