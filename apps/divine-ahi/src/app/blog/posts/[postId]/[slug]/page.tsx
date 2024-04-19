import { notFound, redirect } from 'next/navigation';
import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { queryPostMetas, querySinglePost } from '@/lib/utils/mdxlite-utils';
import { resMdx } from '@/lib/utils/mdx-bundler-utils';
import type { PostTeaserObjectProps } from '@/app/blog/page';
import { PostHeader } from '@/components/blog/post-header';

export async function generateStaticParams() {
  const postMetas = await queryPostMetas();
  return postMetas.map((postObj) => ({
    postId: postObj.id.split('-')[0],
    slug: postObj.headline.replaceAll(' ', '_'),
  }));
}
interface ParagraphProps {
  children?: string;
}
function Paragraph(props: unknown) {
  if (typeof (props as ParagraphProps).children === 'string') {
    return <p {...(props as ParagraphProps)} />;
  }
  return <>{(props as ParagraphProps).children}</>;
}

export default async function Page({ params }: { params: { postId: string; slug: string } }) {
  const slugDeserializer = params.slug.replaceAll('_', ' ');
  const postQ = await querySinglePost(params.postId, slugDeserializer).catch((err: unknown) => {
    console.error(err);
  });
  if (!postQ) {
    notFound();
  }
  if (slugDeserializer !== postQ.headline) {
    redirect(`/blog/posts/${params.postId}/${postQ.headline.replaceAll(' ', '_')}`);
  }
  const postSource = postQ.rawContent?.trim();

  const resBundle = postSource && (await resMdx(postSource, 'blog-posts', params.slug));
  const headerData = postSource && {
    id: postQ.id,
    authorName: postQ.authorName,
    date: postQ.date,
    headline: postQ.headline,
    subheadline: postQ.subheadline,
    category: postQ.category,
    heroFile: postQ.heroFile,
    heroCredit: postQ.heroCredit,
    heroCreditUrl: postQ.heroCreditUrl,
    heroCreditUrlText: postQ.heroCreditUrlText,
    heroAltText: postQ.heroAltText,
  };

  return (
    <div className='motion-safe:simple-color-trans -mb-0.5 min-h-full max-w-full bg-ctp-base dark:bg-ctp-crust lg:pt-10'>
      {resBundle ? <Post code={resBundle.code} teaserObj={headerData as PostTeaserObjectProps} /> : ''}
    </div>
  );
}

function Post({ code, teaserObj }: { code: string; teaserObj: PostTeaserObjectProps }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <article className=''>
      <PostHeader dataObject={teaserObj} />
      <div className='flex min-h-full items-center justify-center p-10 md:p-10'>
        <div className='prose-protocol-omega'>
          <Component components={{ p: Paragraph }} />
        </div>
      </div>
    </article>
  );
}
