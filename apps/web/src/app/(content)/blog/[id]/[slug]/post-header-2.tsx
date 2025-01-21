import Link from 'next/link';
import { allAuthors, type Post } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import ShareButton from '@/components/share-btn/share-btn';
import { CatTagRoller } from '../../cat-tag-roller';
import { HeroBlur2 } from './hero-blur-2';
import LocalDate from '../../local-date';

export function PostHeader2(post: Post) {
  const authorName = allAuthors.find((author) => author.url === `/authors/${post.author}`)?.name;
  return (
    <>
      {/*
      <div className='pt-post-page flex w-full items-center justify-center px-6'>
        <div className='w-full max-w-4xl'>
          <Link
            href={'/blog'}
            className='link-color-trans group -ml-1.5 mb-4 flex w-fit flex-row items-center gap-x-[1ch] self-start font-mono text-ctp-subtext0 hover:font-bold hover:text-ctp-text lg:mb-6 dark:text-ctp-overlay0'
          >
            <span className='icon-[ph--arrow-fat-lines-left] pointer-events-none w-[2ch] text-2xl' />{' '}
            <span className='pointer-events-none'>
              <span>return to:</span>{' '}
              <span className='link-color-trans text-ctp-mauve/80 group-hover:text-ctp-pink group-hover:underline'>{`/blog`}</span>
            </span>
          </Link>
        </div>
      </div>
      */}
      <header className='pt-post-page z-0'>
        <div className='flex w-full flex-col items-center justify-center gap-2 px-6 pb-6 lg:pb-10'>
          <div className='w-full max-w-4xl font-mono lg:max-w-3xl'>
            <CatTagRoller cats={post.categories} tags={post.tags} />
          </div>

          <h1 id={post.url.split('/').pop()} className='post-headline'>
            {post.headline}
          </h1>

          <h2 className='post-subheadline'>{post.subheadline}</h2>

          <div className='flex w-full max-w-4xl flex-wrap items-center gap-x-[0.5ch] font-mono text-xs lg:max-w-3xl lg:text-sm'>
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

          <div className='flex w-full max-w-4xl items-center justify-start pt-3 lg:max-w-3xl lg:pt-7'>
            <ShareButton />
          </div>
        </div>

        <div className='flex size-full flex-col items-center justify-center'>
          {/* bg image + title */}

          {(post.featured_image as FeaturedImageR1).hasImage ? (
            <figure className='relative flex size-full flex-col items-center justify-center gap-6'>
              <HeroBlur2 {...post} />
              <p className='header-alt-text'>
                <span className='w-full max-w-4xl lg:max-w-3xl'>
                  {(post.featured_image as FeaturedImageR1).altText}
                </span>
              </p>
              <figcaption className='header-caption'>
                <span className='max-w-4xl lg:max-w-3xl'>{(post.featured_image as FeaturedImageR1).caption}</span>
              </figcaption>
            </figure>
          ) : post.caption ? (
            <div>
              <p className='header-caption'>
                <span className='max-w-4xl'>{post.caption}</span>
              </p>
            </div>
          ) : (
            ''
          )}

          <div className='flex size-full w-full items-center justify-center px-6'>
            <div className='mt-6 w-full max-w-4xl rounded bg-ctp-text py-px lg:mt-10 lg:max-w-3xl' />
          </div>
        </div>
      </header>
    </>
  );
}
