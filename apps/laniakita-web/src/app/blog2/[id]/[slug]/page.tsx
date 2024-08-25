import type { ReactElement, ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import ReadingBar from '@/components/reading-bar';
import { PostHeader2 } from '@/app/blog2/post-header-2';
import { allPosts } from 'contentlayer/generated';
import BlogImageBlurServer from '../../img-blur-server';

export function Paragraph(props: { children?: ReactNode }) {
  if (typeof props.children !== 'string') {
    if ((typeof (props.children as ReactElement).type === 'function') || (props.children as ReactElement).type === 'img') {
      return <>{props.children}</>;
    }
  }
  return <p {...props} />;
}

const mdxComponents = { p: Paragraph, img: BlogImageBlurServer };

export default function BlogPostPage({ params }: { params: { id: string; slug: string } }) {
  const post = allPosts.find(
    (postX) =>
      (postX.id.split('-').shift() === params.id && postX.url.split('/').pop() === params.slug) ||
      postX.id.split('-').shift() === params.id,
  );

  if (post && post.url.split('/').pop() !== params.slug) {
    redirect(`/blog2/${params.id}/${post.url.split('/').pop()}`);
  }

  const MDXContent = useMDXComponent(post ? post.body.code : '');

  if (!post) {
    return notFound();
  }

  return (
    <>
      <div className='fixed left-0 top-[3.8rem] z-50 w-full'>
        <ReadingBar />
      </div>
      <main className='motion-safe:simple-color-trans -mb-0.5 min-h-full max-w-full bg-ctp-base dark:bg-ctp-midnight'>
        <article id='content' className='flex size-full flex-col items-center justify-center'>
          <PostHeader2 {...post} />
          <div className='flex min-h-full items-center justify-center px-10 py-6'>
            <div className='prose-protocol-omega max-w-3xl '>
              <MDXContent code={post.body.code} components={mdxComponents} />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
