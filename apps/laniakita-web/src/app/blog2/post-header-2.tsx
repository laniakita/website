import Link from 'next/link';
import ShareButton from '@/components/share-btn';
import { type Post } from 'contentlayer/generated';
import type { ImageR1 } from 'contentlayer.config';
//import type { PostQ } from '@/lib/node-db-funcs';
//import PostDate from './post-date';
import { HeroBlur2 } from './hero-blur-2';
import LocalDate from './local-date';
import { CatTagRoller } from './cat-tag-roller';
//import { TagsRoller } from './tags-roller';

export function PostHeader2(post: Post) {
  /*
  let showImageDescr = false;
  if (
    ((post.featured_image.credit as unknown) &&
      (post.featured_image.creditUrl as unknown) &&
      (post.featured_image.creditUrlText as unknown)) !== null &&
    ((post.featured_image.credit as unknown) &&
      (post.featured_image.creditUrl as unknown) &&
      (post.featured_image.creditUrlText as unknown)) !== undefined
  ) {
    showImageDescr = true;
  }
  */
  return (
    <>
      <div className='flex w-full flex-col items-center justify-center gap-2 px-10 pb-6 pt-[6.5rem] md:pb-10'>
        <div className='w-full max-w-3xl font-mono'>
          <CatTagRoller cats={post.categories} tags={post.tags} />
        </div>
        <h1 className='w-full max-w-3xl text-3xl font-black supports-[text-wrap:balance]:text-balance md:text-4xl'>
          {post.headline}
        </h1>
        <h2 className='w-full max-w-3xl text-2xl font-light supports-[text-wrap:balance]:text-balance md:text-3xl'>
          {post.subheadline}
        </h2>

        <div className='flex w-full max-w-3xl flex-wrap gap-2 font-mono'>
          <p>
            <Link href='/about' className='font-semibold capitalize'>
              {post.author}
            </Link>
          </p>
          <span>|</span>
          <p>
            <LocalDate date={new Date(post.date)} />
          </p>
        </div>

        <div className='flex w-full max-w-3xl items-center justify-start pt-3 md:pt-7'>
          <ShareButton />
        </div>
      </div>

      <div className='flex size-full flex-col items-center justify-center'>
        {/* bg image + title */}

        {(post.featured_image as ImageR1).src !== undefined ? (
          <figure className='relative flex size-full flex-col items-center justify-center gap-10'>
            <HeroBlur2 {...post} />
            <p className='-mb-2 -mt-6 flex w-full flex-col items-center justify-center px-10 font-mono text-sm font-thin [font-style:_normal]'>
              <span className='w-full max-w-3xl'>Image source: OC by me ^-^</span>
            </p>
            <figcaption className='flex w-full items-center justify-center px-10 text-xl font-bold italic leading-tight md:text-2xl'>
              <span className='max-w-3xl'>{(post.featured_image as ImageR1).caption}</span>
            </figcaption>
          </figure>
        ) : (
          ''
        )}

        <div className='flex size-full w-full items-center justify-center px-10'>
          <div className='mt-10 w-full max-w-3xl rounded bg-ctp-text py-px' />
        </div>
      </div>
    </>
  );
}
