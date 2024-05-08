import Link from 'next/link';
import { HeroBg } from '@/components/blog/hero-bg';
import type { PostTeaserObjectProps } from '@/app/blog/page';
import PostDate from '@/components/blog/post-date';

export function PostHeader({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  //const linkTo = baseUrl + "/blog/" + dataObject.category + "/" + dataObject.slug;
  //const linkToCat = baseUrl + "/blog/" + dataObject.category;
  return (
    <header className='pt-10 md:pt-20 lg:pt-36'>
      <PostHeaderTitleBlock dataObject={dataObject} />
      {/* bg image + title */}
      {dataObject.heroFile !== undefined && (
        <div className='flex size-full items-center justify-center'>
          <figure className='relative flex size-full flex-col items-center justify-center gap-10 md:max-w-3xl lg:max-w-4xl xl:max-w-7xl'>
            <HeroBg dataObject={dataObject} />
            <figcaption className='max-w-xl px-10 text-2xl font-bold italic leading-tight'>
              {dataObject.heroCaption}
            </figcaption>
          </figure>
        </div>
      )}
    </header>
  );
}

/*
 *
 *
 * in case I want to try to make the title cover
 * the image again:
 * motion-safe:simple-color-trans bg-gradient-to-b from-ctp-crust/50 via-ctp-crust/80 to-ctp-crust backdrop-blur-md
 */
export function PostHeaderTitleBlock({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  return (
    <div className='flex w-full items-center justify-center px-10 pb-8 md:pb-10'>
      <div className='flex max-w-xl flex-col gap-4 md:gap-6'>
        <h1 className='text-4xl font-black leading-tight supports-[text-wrap:balance]:text-balance md:text-5xl'>
          {dataObject.headline}
        </h1>
        <h2 className='text-2xl font-semibold leading-tight supports-[text-wrap:balance]:text-balance md:text-3xl'>
          {dataObject.subheadline}
        </h2>
        <div className='flex w-full flex-wrap gap-2 font-mono text-lg'>
          <p>
            <span>
              <Link href='/about' className='font-semibold'>
                {dataObject.authorName}
              </Link>
            </span>
          </p>
          <PostDate dateStr={dataObject.date} />
          <p className='flex flex-row gap-2'>
            <span>|</span>
            <Link href={`/blog/${dataObject.category?.replaceAll(' ', '_')}`} className='w-fit font-mono font-semibold'>
              #{dataObject.category}
            </Link>
          </p>
        </div>
        <div className='flex flex-wrap gap-4 pt-2 md:pt-4'>
          <button
            type='button'
            className='flex flex-row items-center justify-center gap-2 rounded-full border border-ctp-mauve bg-ctp-mauve/10 px-8 py-2 font-mono font-black hover:bg-ctp-mauve hover:text-ctp-base'
          >
            <span className='icon-[ph--upload-bold] text-2xl' />
            <span>share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
