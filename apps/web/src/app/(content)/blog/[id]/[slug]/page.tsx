import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { BlogPosting, WithContext } from 'schema-dts';
import { compareDesc } from 'date-fns';
import { allAuthors, allPosts } from 'contentlayer/generated';
import ReadingBar from '@/components/reading-bar';
import { descriptionHelper } from '@/lib/description-helper';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { APP_URL } from '@/lib/constants';
import GlobalMDXComponent from '@/components/mdx/global-mdx-components';
import { catTagData } from '@/lib/cat-tag-data';
import CommentsComponent from './comments';
import { PostHeader2 } from './post-header-2';
import ToCMenu from '@/components/toc-nav';

export function generateStaticParams() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  return posts.map((meta) => ({
    id: meta.id.split('-').shift(),
    slug: meta.url.split('/').pop(),
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ id: string; slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;

  const postData = allPosts.find(
    (postX) =>
      (postX.id.split('-').shift() === params.id && postX.url.split('/').pop() === params.slug) ||
      postX.id.split('-').shift() === params.id ||
      postX.url.split('/').pop() === params.slug,
  );

  const description = descriptionHelper(postData?.body.raw, postData?.url, true);
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
          url: `/opengraph/blog/${params.id}/${params.slug}`,
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
          url: `/opengraph/blog/${params.id}/${params.slug}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ id: string; slug: string }> }) {
  const params = await props.params;

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

  if (!post) {
    return notFound();
  }

  const catTagArr = catTagData({ cats: post.categories, tags: post.tags }).map((catTag) => catTag?.title);

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    name: post.headline,
    url: `${process.env.NEXT_PUBLIC_DEPLOYED_URL ? process.env.NEXT_PUBLIC_DEPLOYED_URL : APP_URL}${post.url}`,
    description: descriptionHelper(post.body.raw, post.url, true),
    author: 'Lani Akita',
    editor: 'Lani Akita',
    dateCreated: post.date,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    thumbnailUrl: `${APP_URL}/opengraph/blog/${params.id}/${params.slug}?twitter=true`,
    keywords: post.keywords ?? (catTagArr as string[]),
    countryOfOrigin: 'United States',
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div>
        <div className='fixed left-0 top-[6.8rem] md:top-[3.8rem] z-30 w-full'>
          <ReadingBar />
        </div>
      </div>

      <main className='motion-safe:simple-color-trans pb-common -mb-0.5 flex min-h-full w-full flex-col bg-ctp-base dark:bg-ctp-midnight'>
        {/* flex box break prose */}
        <article id='content' className=''>
          <PostHeader2 {...post} />
          <div className='w-full px-10'>
            <div className='prose-protocol-omega mx-auto'>
              <GlobalMDXComponent {...post} />
            </div>
          </div>
        </article>
        <CommentsComponent />
      </main>
    </>
  );
}
