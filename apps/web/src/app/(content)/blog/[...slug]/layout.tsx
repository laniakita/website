import type { ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar';
import ToCMenuCore, { ToCMenuMobileCore } from '@/components/table-of-contents/core';
import { allPosts, allAuthors } from '@/lib/fumadocs';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { FeaturedImageR1 } from '@/lib/image-process';
import type { BlogPosting, WithContext } from 'schema-dts';
import { APP_URL } from '@/lib/constants';
import type { CatTag } from '../cat-tag-roller';

export async function generateMetadata(
  props: { params: Promise<{ slug: string[] }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;

  const postData = allPosts.find((postX) => slug.some((sl) => postX.url.split('/').pop() === sl));

  const description = postData?.description;
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

  const altTextTrunc = descriptionTruncator(postData?.featured_image.altText);

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
          alt: altTextTrunc ?? postData?.headline,
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
          alt: altTextTrunc ?? postData?.headline,
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

export default async function PostPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const post = allPosts.find((postX) => slug.some((sl) => postX.url.split('/').pop() === sl));

  if (!post) return notFound();

  const flatHeadingsAlt: { id: string; content: string }[] = [];

  const ReactDomServer = await import('react-dom/server');

  const toc = post.toc.map((item) => {
    const { depth, url, title } = item;

    const titleHtml = ReactDomServer.renderToStaticMarkup(title as ReactNode);

    flatHeadingsAlt.push({ id: url.substring(1), content: titleHtml });

    return {
      depth,
      url,
      title: titleHtml,
    };
  });

  const catTagArr = ([...post.categories, ...post.tags] as CatTag[]).map((catTag) => {
    return catTag.title;
  }) as string[];

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.headline,
    alternativeHeadline: post.subheadline ?? undefined,
    url: `${process.env.NEXT_PUBLIC_DEPLOYED_URL ? process.env.NEXT_PUBLIC_DEPLOYED_URL : APP_URL}${post.url}`,
    description: post.description,
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

  //console.log(toc)

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className='flex size-full flex-col md:relative md:flex-row'>
        <ToCMenuCore flatHeadings={flatHeadingsAlt} nestedHeadings={toc} />

        <div className='size-full min-w-0'>
          <Navbar />
          <ToCMenuMobileCore flatHeadings={flatHeadingsAlt} nestedHeadings={toc} />
          <div className='flex max-w-7xl flex-col md:m-auto md:min-w-0'>
            {children}
            <Footer
              override
              outsidePadding='px-0 md:px-6 pb-10 lg:pb-common'
              insidePadding='p-6 md:p-0 lg:p-10'
              iconContainerPadding='px-4 md:px-0'
              linksContainerPadding='p-4 md:px-0'
            />
          </div>
        </div>
      </div>
    </>
  );
}
