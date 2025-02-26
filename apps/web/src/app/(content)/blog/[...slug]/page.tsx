import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { BlogPosting, WithContext } from 'schema-dts';
import { compareDesc } from 'date-fns';
import { allAuthors, allPosts } from 'content-collections';
import { descriptionHelper } from '@/lib/description-helper';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { APP_URL } from '@/lib/constants';
import { PostHeader2 } from './post-header-2';
import CommentsComponent from './comments/core';
//import { MDXContent } from '@content-collections/mdx/react';
import { CatTag } from '../cat-tag-roller';
//import { globalMdxComponents } from '@/components/mdx/global-mdx-components';

export function generateStaticParams() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  return posts.map((meta) => ({
    slug: [meta.url.split('/').pop()],
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string[] }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;

  const postData = allPosts.find((postX) => slug.some((sl) => postX.url.split('/').pop() === sl));

  const description = descriptionHelper(postData?.content, postData?.url, true);
  const previousImages = (await parent).openGraph?.images ?? [];

  const previousImagesTwitter = (await parent).twitter?.images ?? [];

  function descriptionTruncator(descr: string | undefined) {
    const maxLen = 200;
    if (!descr) return '';
    if (descr.length > maxLen) {
      return `${descr.substring(0, maxLen - 3)}...`;
    }
    return descr;
  }

  return {
    title: postData?.headline,
    authors: [
      { name: allAuthors.find((author) => author.url === `/authors/${postData?.author}`)?.name ?? 'Lani Akita' },
    ],
    description,
    openGraph: {
      title: postData?.headline,
      description: descriptionTruncator(description),
      images: [
        {
          alt: `${descriptionTruncator((postData?.featured_image as FeaturedImageR1).altText) || postData?.headline}`,
          type: 'image/png',
          width: 1200,
          height: 630,
          url: `/opengraph${postData?.url}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData?.headline,
      description: descriptionTruncator(description),
      images: [
        {
          alt: `${descriptionTruncator((postData?.featured_image as FeaturedImageR1).altText) || postData?.headline}`,
          type: 'image/png',
          width: 1600,
          height: 900,
          url: `/opengraph${postData?.url}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
    },
  };
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

  const catTagArr = (
    [
      ...(post.categories ? post.categories.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) : ''),
      ...(post.tags ? post.tags.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) : ''),
    ] as CatTag[]
  ).map((catTag) => {
    return catTag.title;
  }) as string[];

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.headline,
    alternativeHeadline: post.subheadline ?? undefined,
    url: `${process.env.NEXT_PUBLIC_DEPLOYED_URL ? process.env.NEXT_PUBLIC_DEPLOYED_URL : APP_URL}${post.url}`,
    description: descriptionHelper(post.content, post.url, true),
    author: 'Lani Akita',
    editor: 'Lani Akita',
    dateCreated: new Date(post.date).toISOString(),
    datePublished: new Date(post.date).toISOString(),
    dateModified: post.updated ? new Date(post.updated).toISOString() : undefined,
    image: [
      {
        '@type': 'ImageObject',
        url: `${APP_URL}${(post.featured_image as FeaturedImageR1).src}`,
        caption: `${(post.featured_image as FeaturedImageR1).caption}`,
        height: `${(post.featured_image as FeaturedImageR1).height}`,
        width: `${(post.featured_image as FeaturedImageR1).width}`,
        description: `${(post.featured_image as FeaturedImageR1).altText}`,
      },
    ],
    thumbnailUrl: `${APP_URL}/opengraph${post.url}?twitter=true`,
    keywords: post.keywords ?? catTagArr,
    countryOfOrigin: 'United States',
  };

  const { default: PostMDX } = await import(`@content/posts/${post._meta.path}.mdx`)


  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className='-mb-0.5 flex min-h-full w-full flex-col pb-common'>
        <article id='content'>
          <PostHeader2 {...post} />
          <div className='w-full px-6'>
            <div className='prose-protocol-omega mx-auto max-w-4xl md:max-w-2xl'>
             <PostMDX />
            </div>
          </div>
        </article>
        <CommentsComponent />
      </main>
    </>
  );
}
