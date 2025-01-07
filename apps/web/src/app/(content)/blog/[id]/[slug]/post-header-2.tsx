import Link from 'next/link';
import { allAuthors, type Post } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import ShareButton from '@/components/share-btn';
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
        <div className='flex w-full flex-col items-center justify-center gap-1 px-6 pb-6 md:pb-10'>
          <div className='w-full max-w-4xl'>
            <CatTagRoller cats={post.categories} tags={post.tags} />
          </div>

          <h1
            id={post.url.split('/').pop()}
            className='w-full max-w-4xl text-2xl font-black leading-tight supports-[text-wrap:balance]:text-balance md:text-4xl lg:text-5xl'
          >
            {post.headline}
          </h1>

          <h2 className='w-full max-w-4xl text-xl font-light leading-tight supports-[text-wrap:balance]:text-balance md:text-3xl lg:text-4xl'>
            {post.subheadline}
          </h2>

          <div className='flex w-full max-w-4xl flex-wrap items-center gap-x-2 text-xs'>
            <p>
              By{' '}
              <Link href='/about' className='font-semibold capitalize'>
                {authorName ?? 'Lani'}
              </Link>
            </p>
            <span className=''>|</span>
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

          <div className='flex w-full max-w-4xl items-center justify-start pt-3 md:pt-7'>
            <ShareButton />
          </div>
        </div>

        <div className='flex size-full flex-col items-center justify-center'>
          {/* bg image + title */}

          {(post.featured_image as FeaturedImageR1).hasImage ? (
            <figure className='relative flex size-full flex-col items-center justify-center gap-6'>
              <HeroBlur2 {...post} />
              <p className='-mt-4 flex w-full flex-col items-center justify-center px-6 text-xs font-light'>
                <span className='w-full max-w-4xl'>{(post.featured_image as FeaturedImageR1).altText}</span>
              </p>
              <figcaption className='flex w-full items-center justify-center px-6 text-lg font-black italic leading-tight md:text-2-25xl'>
                <span className='max-w-4xl'>{(post.featured_image as FeaturedImageR1).caption}</span>
              </figcaption>
            </figure>
          ) : post.caption ? (
            <div>
              <p className='flex w-full items-center justify-center px-6 text-2xl font-bold italic md:text-2-25xl'>
                <span className='max-w-4xl'>{post.caption}</span>
              </p>
            </div>
          ) : (
            ''
          )}

          <div className='flex size-full w-full items-center justify-center px-6'>
            <div className='mt-6 w-full max-w-4xl rounded bg-ctp-text py-px lg:mt-10' />
          </div>
        </div>
      </header>
    </>
  );
}
