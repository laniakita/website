import type { ReactElement, ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { BlogPosting, WithContext } from 'schema-dts';
import { compareDesc } from 'date-fns';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import ReadingBar from '@/components/reading-bar';
import { PostHeader2 } from '@/app/(content)/blog/post-header-2';
import { allPosts } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { BASE_URL } from '@/lib/constants';
import BlogImageBlurServer from '../../img-blur-server';
import { descriptionHelper } from '../../post-components';
import { catTagData } from '../../cat-tag-roller';


export function generateStaticParams() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  return posts.map((meta) => ({
    id: meta.id.split('-').shift(),
    slug: meta.url.split('/').pop(),
  }));
}

export async function generateMetadata({ params }: { params: { id: string; slug: string}},
  parent: ResolvingMetadata
): Promise<Metadata> {

  const postData = allPosts.find(
    (postX) => postX.id.split('-').shift() === params.id && postX.url.split('/').pop() === params.slug,
  );

  const description = descriptionHelper(postData?.body.raw, postData?.url, true);
  const previousImages = (await parent).openGraph?.images ?? []

  const previousImagesTwitter = (await parent).twitter?.images ?? []
  return {
    title: postData?.headline,
    authors: [{ name: 'Lani Akita' }],
    description,
    openGraph: {
      title: postData?.headline,
      description,
      images: [
        {
          alt: `${(postData?.featured_image as FeaturedImageR1).altText || postData?.headline}`,
          type: 'image/jpeg',
          width: 1200,
          height: 630,
          url: `/opengraph/blog/${params.id}/${params.slug}`
        },
        ...previousImages
      ],
    },
    twitter: {
      card: 'summary',
      title: postData?.headline,
      description,
      images: [
        {
          alt: `${(postData?.featured_image as FeaturedImageR1).altText || postData?.headline}`,
          type: 'image/jpeg',
          width: 1600,
          height: 900,
          url: `/opengraph/blog/${params.id}/${params.slug}?twitter=true`
        },
        ...previousImagesTwitter
      ],
    },
  };
}

export function Paragraph(props: { children?: ReactNode }) {
  if (typeof props.children !== 'string') {
    if (
      typeof (props.children as ReactElement).type === 'function' ||
      (props.children as ReactElement).type === 'img'
    ) {
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
      postX.id.split('-').shift() === params.id ||
      postX.url.split('/').pop() === params.slug,
  );

  if (post) {
    if (post.id.split('-').shift() !== params.id) {
      redirect(`/blog/${post.id.split('-').shift()}/${params.slug}`);
    } else if (post.url.split('/').pop() !== params.slug) {
      redirect(`/blog/${params.id}/${post.url.split('/').pop()}`);
    }
  }

  const MDXContent = useMDXComponent(post ? post.body.code : '');

  if (!post) {
    return notFound();
  }

  const catTagArr = catTagData({ cats: post.categories, tags: post.tags }).map((catTag) => catTag?.title);

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    name: post.headline,
    url: `${BASE_URL}${post.url}`,
    description: descriptionHelper(post.body.raw, post.url, true),
    author: 'Lani Akita',
    editor: 'Lani Akita',
    dateCreated: post.date,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    thumbnailUrl: `${BASE_URL}/opengraph/blog/${params.id}/${params.slug}?twitter=true`,
    keywords: post.keywords ?? (catTagArr as string[]),
    countryOfOrigin: 'United States',
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className='fixed left-0 top-[3.8rem] z-50 w-full'>
        <ReadingBar />
      </div>
      <main className='motion-safe:simple-color-trans pb-common -mb-0.5 min-h-full max-w-full bg-ctp-base dark:bg-ctp-midnight'>
        <article id='content' className='mx-0 flex size-full flex-col items-center justify-center px-0'>
          <PostHeader2 {...post} />
          <div className='flex min-h-full items-center justify-center px-10 '>
            <div className='prose-protocol-omega mx-0 max-w-3xl px-0'>
              <MDXContent code={post.body.code} components={mdxComponents} />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
