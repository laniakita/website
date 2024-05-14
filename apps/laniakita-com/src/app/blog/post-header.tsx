import Link from 'next/link';
import ShareButton from '@/components/share-btn';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';
import { BeegStoreProvider } from '@/providers/beeg-store-provider';
import {HeroWrapper} from './hero-wrapper-v2';
import PostDate from './post-date';

export function PostHeader({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  //const linkTo = baseUrl + "/blog/" + dataObject.category + "/" + dataObject.slug;
  //const linkToCat = baseUrl + "/blog/" + dataObject.category;
  return (
    <header className='pt-10 md:pt-20 lg:pt-36'>
      <PostHeaderTitleBlock dataObject={dataObject} />
      {/* bg image + title */}
      {dataObject.heroFile !== undefined && (
        <div className='flex size-full flex-col items-center justify-center'>
          <figure className='relative flex size-full flex-col items-center justify-center gap-10'>
            <BeegStoreProvider>
            <HeroWrapper dataObject={dataObject} />
            </BeegStoreProvider>
            <figcaption className='flex w-full items-center justify-center px-10 text-2xl font-bold italic leading-tight'>
              <h2 className='max-w-xl'>{dataObject.heroCaption}</h2>
            </figcaption>
          </figure>
          <div className='mt-10 flex w-full flex-col items-center justify-center gap-10 px-10'>
            <div className='w-full max-w-xl rounded bg-ctp-text py-px' />
            {dataObject.heroCredit !== undefined && (
              <p className='w-full max-w-xl'>
                image credit: {dataObject.heroCredit} via{' '}
                <a href={dataObject.heroCreditUrl}>{dataObject.heroCreditUrlText}</a>
              </p>
            )}
          </div>
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
            <Link href={`/blog/categories/${dataObject['category-slug']}`} className='w-fit font-mono font-semibold'>
              #{dataObject['category-slug']}
            </Link>
          </p>
        </div>
        <div className='flex flex-wrap gap-4 pt-2 md:pt-4'>
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
