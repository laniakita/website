import Link from 'next/link';
import { allAuthors } from '@/lib/fumadocs';
import { blog } from '$/.source';
import type { FeaturedImageR1 } from '@/lib/image-process';
import ShareButton from '@/components/share-btn/share-btn';
import { CatTag, CatTagRoller } from '../cat-tag-roller';
import { HeroBlur2 } from './hero-blur-2';
import LocalDate from '../local-date';

export function PostHeader2(post: typeof blog[0]) {
  const authorName = allAuthors.find((author) => author.url === `/authors/${post.author}`)?.name;
  return (
    <>
      <header className='z-0 pt-post-page'>
        <div className='flex w-full flex-col items-center justify-center gap-2 px-6 pb-6 lg:pb-10'>
          <div className='w-full max-w-3xl font-mono md:max-w-2xl'>
            <CatTagRoller cats={post.categories as CatTag[]} tags={post.tags as CatTag[]} />
          </div>

          <h1 id={post.url.split('/').pop()} className='post-headline'>
            {post.headline}
          </h1>

          <h2 className='post-subheadline'>{post.subheadline}</h2>

          <div className='flex w-full max-w-4xl flex-wrap items-center gap-x-[0.5ch] font-mono text-xs md:max-w-2xl lg:text-sm'>
            <p>
              By{' '}
              <Link href='/about' className='font-semibold capitalize'>
                {authorName ?? 'Lani'}
              </Link>
            </p>
            <span className='font-light'>|</span>
            {post.updated ? (
              <p itemProp='dateModified' itemScope itemType='http://schema.org/Date' className='flex flex-wrap gap-x-2'>
                <span>Updated:</span>
                <LocalDate date={post.updated} />
              </p>
            ) : (
              <p itemProp='datePublished' itemScope itemType='http://schema.org/Date'>
                <LocalDate date={post.date} />
              </p>
            )}
          </div>

          <div className='flex w-full max-w-4xl items-center justify-start pt-3 md:max-w-2xl lg:pt-7'>
            <ShareButton />
          </div>
        </div>

        <div className='flex size-full flex-col items-center justify-center'>
          {/* bg image + title */}

          {(post.featured_image as FeaturedImageR1).hasImage ? (
            <figure className='relative flex size-full flex-col items-center justify-center gap-6'>
              <HeroBlur2 {...post} />
              <p className='header-alt-text'>
                <span className='w-full max-w-4xl md:max-w-2xl'>
                  {(post.featured_image as FeaturedImageR1).altText}
                </span>
              </p>
              <figcaption className='header-caption'>
                <span className='max-w-4xl md:max-w-2xl'>{(post.featured_image as FeaturedImageR1).caption}</span>
              </figcaption>
            </figure>
          ) : post.caption ? (
            <div>
              <p className='header-caption'>
                <span className='max-w-4xl md:max-w-2xl'>{post.caption}</span>
              </p>
            </div>
          ) : (
            ''
          )}

          <div className='flex size-full w-full items-center justify-center px-6'>
            <div className='mt-6 w-full max-w-4xl rounded bg-ctp-text py-px md:max-w-2xl lg:mt-10' />
          </div>
        </div>
      </header>
    </>
  );
}
