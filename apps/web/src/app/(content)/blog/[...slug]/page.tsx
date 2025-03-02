import { notFound, redirect } from 'next/navigation';
import { allPosts } from '@/lib/fumadocs';
import { PostHeader2 } from './post-header-2';
import CommentsComponent from './comments/core';
import { mdxComponents } from '@/mdx-components';

export function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: [post.url.split('/').pop()],
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  const post = allPosts.find((postX) => slug.some((sl) => postX.url.split('/').pop() === sl));

  if (!post) {
    return notFound();
  }

  if (post && slug.length > 1) {
    redirect(post.url);
  }

  const MDX = post.body;

  return (
    <main className='-mb-0.5 flex min-h-full w-full flex-col pb-common'>
      <article id='content'>
        <PostHeader2 {...post} />
        <div className='w-full px-6'>
          <div className='prose-protocol-omega mx-auto max-w-4xl md:max-w-2xl'>
            {/* @ts-expect-error -- types issues */}
            <MDX components={mdxComponents} />
          </div>
        </div>
      </article>
      <CommentsComponent />
    </main>
  );
}
