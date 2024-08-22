import { PostHeader2 } from '@/app/blog2/post-header-2';
import { allPosts } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { notFound, redirect } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { id: string; slug: string } }) {
  const post = allPosts.find(
    (post) =>
      (post.id?.split('-').shift() === params.id && post.url.split('/').pop() === params.slug) ||
      post.id?.split('-').shift() === params.id,
  );

  if (!post) return notFound();
  if (post.url.split('/').pop() !== params.slug) {
    redirect(`/blog2/${params.id}/${post.url.split('/').pop()}`);
  }

  const MDXContent = useMDXComponent(post.body.code);

  //console.log(post);
  return (
    <main className='motion-safe:simple-color-trans -mb-0.5 min-h-full max-w-full bg-ctp-base dark:bg-ctp-midnight'>
      {post !== undefined && (
        <article id='content' className='flex size-full flex-col items-center justify-center'>
          <PostHeader2 {...post} />
          <div className='flex min-h-full items-center justify-center px-10 py-6'>
            <div className='prose-protocol-omega'>
              <MDXContent code={post.body.code} />
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
