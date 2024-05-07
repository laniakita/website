import Link from 'next/link';
import { HeroBg } from '@/components/blog/hero-bg';
import type { PostTeaserObjectProps } from '@/app/(main)/blog/page';
import PostDate from '@/components/blog/post-date';

export function PostHeader({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  //const linkTo = baseUrl + "/blog/" + dataObject.category + "/" + dataObject.slug;
  //const linkToCat = baseUrl + "/blog/" + dataObject.category;
  return (
    <header>
      <PostHeaderTitleBlock dataObject={dataObject} />
      {/* bg image + title */}
      <div className='relative'>
        <HeroBg dataObject={dataObject} />
        <div className='simple-color-trans absolute -bottom-0.5 flex w-full items-center justify-center bg-ctp-base/60 px-4 py-1 backdrop-blur-md md:px-10'>
          <div className='w-full max-w-3xl'>
            <p className='font-mono text-xs'>
              credit: {dataObject.heroCredit} via <a href={dataObject.heroCreditUrl}>{dataObject.heroCreditUrlText}</a>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

/*
 * in case I want to try to make the title cover
 * the image again:
 * motion-safe:simple-color-trans bg-gradient-to-b from-ctp-crust/50 via-ctp-crust/80 to-ctp-crust backdrop-blur-md
 */
export function PostHeaderTitleBlock({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  return (
    <div className='flex w-full items-center justify-center p-10 lg:py-20'>
      <div className='flex max-w-xl flex-col gap-6'>
        <div className='space-y-2'>
          <Link
            href={`/blog/${dataObject.category?.replaceAll(' ', '_')}`}
            className='w-fit font-mono text-xl font-semibold'
          >
            {dataObject.category}
          </Link>
          <h1 className='text-5xl font-black uppercase supports-[text-wrap:balance]:text-balance md:text-6xl'>
            {dataObject.headline}
          </h1>
          <h3 className='text-2xl font-semibold supports-[text-wrap:balance]:text-balance md:text-3xl'>
            {dataObject.subheadline}
          </h3>
        </div>
        <div className='flex w-full flex-wrap gap-2 font-mono text-lg'>
          <p>
            {`By, `}
            <span>
              <Link href='/about' className='font-semibold'>
                {dataObject.authorName}
              </Link>
            </span>
          </p>
          <PostDate dateStr={dataObject.date} />
        </div>
      </div>
    </div>
  );
}
