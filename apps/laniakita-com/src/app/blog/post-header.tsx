import Link from 'next/link';
import ShareButton from '@/components/share-btn';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';
import PostDate from './post-date';
import { HeroShimmer } from './hero-shimmer';

export function PostHeader({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  //const linkTo = baseUrl + "/blog/" + dataObject.category + "/" + dataObject.slug;
  //const linkToCat = baseUrl + "/blog/" + dataObject.category;
  return (
    <>
      <div className='flex w-full flex-col items-center justify-center gap-4 px-10 pb-8 pt-10 md:gap-6 md:pb-10 md:pt-20 lg:pt-36'>
        <h1 className='w-full max-w-xl text-4xl font-black leading-tight supports-[text-wrap:balance]:text-balance md:text-5xl'>
          {dataObject.headline}
        </h1>

        <h2 className='w-full max-w-xl text-2xl font-semibold leading-tight supports-[text-wrap:balance]:text-balance md:text-3xl'>
          {dataObject.subheadline}
        </h2>

        <div className='flex w-full max-w-xl flex-wrap gap-2'>
          <p className='space-x-2'>
            <span>By</span>
            <span>
              <Link href='/about' className='font-semibold'>
                {dataObject.author}
              </Link>
            </span>
          </p>
          <PostDate dateStr={dataObject.date} />
        </div>

        <div className='flex w-full max-w-xl items-center justify-start'>
          <ShareButton />
        </div>
      </div>

      <div className='flex size-full flex-col items-center justify-center'>
        {/* bg image + title */}
        {(dataObject.heroFile as unknown) !== undefined && (
          <figure className='relative flex size-full flex-col items-center justify-center gap-10'>
            <HeroShimmer dataObject={dataObject} />

            <p className='-mb-2 -mt-6 flex w-full flex-col items-center justify-center px-10 font-mono text-sm font-thin [font-style:_normal]'>
              {dataObject.heroCredit !== undefined && (
                <span className='w-full max-w-xl'>
                  Image source: {dataObject.heroCredit} via{' '}
                  <Link href={dataObject.heroCreditUrl!}>{dataObject.heroCreditUrlText}</Link>
                </span>
              )}
            </p>

            <caption className='max-w-xl text-xl font-bold italic leading-tight'>{dataObject.heroCaption}</caption>
          </figure>
        )}
        <div className='w-full max-w-xl rounded bg-ctp-text py-px' />
      </div>
    </>
  );
}

/*
 *
 *
 * in case I want to try to make the title cover
 * the image again:
 * motion-safe:simple-color-trans bg-gradient-to-b from-ctp-crust/50 via-ctp-crust/80 to-ctp-crust backdrop-blur-md
 */
export function PostHeaderInfoBlock({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  return (
    <>
      <div className='flex w-full max-w-xl flex-wrap gap-2 font-mono text-lg'></div>
      <p className='flex w-full max-w-xl items-center justify-start'>
        <ShareButton />
      </p>
    </>
  );
}
