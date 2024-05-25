import Link from 'next/link';
import ShareButton from '@/components/share-btn';
import type { PostQ } from '@/lib/node-db-funcs';
import PostDate from './post-date';
import { HeroBlur } from './hero-blur';
import { TagsRoller } from './tags-roller';

export function PostHeader({ dataObject }: { dataObject: PostQ }) {
  const tagsArr = dataObject.tags;
  let showImageDescr = false;
  if (
    ((dataObject.featuredImage.credit as unknown) &&
      (dataObject.featuredImage.creditUrl as unknown) &&
      (dataObject.featuredImage.creditUrlText as unknown)) !== null &&
    ((dataObject.featuredImage.credit as unknown) &&
      (dataObject.featuredImage.creditUrl as unknown) &&
      (dataObject.featuredImage.creditUrlText as unknown)) !== undefined
  ) {
    showImageDescr = true;
  }
   return (
    <>
      <div className='flex w-full flex-col items-center justify-center gap-4 px-10 pb-6 pt-10 md:gap-6 md:pb-10 md:pt-20 lg:pt-36'>
        <h1 className='w-full max-w-xl text-4xl font-black leading-tight supports-[text-wrap:balance]:text-balance md:text-5xl'>
          {dataObject.headline}
        </h1>

        <h2 className='w-full max-w-xl text-2xl font-semibold leading-tight supports-[text-wrap:balance]:text-balance md:text-3xl'>
          {dataObject.subheadline}
        </h2>

        <p className='flex w-full max-w-xl flex-wrap gap-2 font-mono text-lg'>
          {/* 
               <span>
            By,{` `}
            <Link href='/about' className='font-semibold'>
              {dataObject.author.name}
            </Link>
          </span>
          
          <span>|</span>
          */}

          <PostDate dateStr={dataObject.date} />
          <span>|</span>
          <TagsRoller tagsArr={tagsArr} />
        </p>

        <div className='flex w-full max-w-xl items-center justify-start pt-1'>
          <ShareButton />
        </div>
      </div>

      <div className='flex size-full flex-col items-center justify-center'>
        {/* bg image + title */}
        {(dataObject.featuredImage.fileLocation as unknown) !== undefined && (
          <figure className='relative flex size-full flex-col items-center justify-center gap-10'>
            <HeroBlur dataObject={dataObject} />

            <p className='-mb-2 -mt-6 flex w-full flex-col items-center justify-center px-10 font-mono text-sm font-thin [font-style:_normal]'>
              {showImageDescr ? (
                <span className='w-full max-w-xl'>
                  Image source: {dataObject.featuredImage.credit} via{' '}
                  <Link
                    href={
                      dataObject.featuredImage.creditUrl ? dataObject.featuredImage.creditUrl : 'https://laniakita.com'
                    }
                  >
                    {dataObject.featuredImage.creditUrlText}
                  </Link>
                </span>
              ) : (
                <span className='w-full max-w-xl'>Image source: OC by me ^-^</span>
              )}
            </p>
            <figcaption className='flex w-full items-center justify-center px-10 text-xl font-bold italic leading-tight md:text-2xl'>
              <span className='max-w-xl'>
                {dataObject.altCaption ? dataObject.altCaption : dataObject.featuredImage.caption}
              </span>
            </figcaption>
          </figure>
        )}
        <div className='flex size-full w-full items-center justify-center px-10'>
          <div className='mt-10 w-full max-w-xl rounded bg-ctp-text py-px' />
        </div>
      </div>
    </>
  );
}
