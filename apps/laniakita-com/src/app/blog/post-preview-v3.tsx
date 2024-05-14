'use client';
import Image from 'next/image';
import Link from 'next/link';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import { imageLoader } from '@/utils/image-loader';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

const accentTextColor = 'text-ctp-mauve';

interface DateGetterReturn {
  cal?: string;
  time?: string;
  fromNow?: string;
  timezone: string;
}

const dateGetter = (dateString: string): DateGetterReturn | undefined => {
  const now = dayjs(new Date());
  const publishedDate = dayjs(dateString);
  const difference = now.diff(publishedDate, 'day');
  if (difference < 7) {
    return {
      cal: undefined,
      time: undefined,
      fromNow: publishedDate.fromNow(),
      timezone: dayjs.tz.guess(),
    };
  }
  if (difference > 7) {
    return {
      cal: publishedDate.format('L'),
      time: publishedDate.format('LT'),
      fromNow: undefined,
      timezone: dayjs.tz.guess(),
    };
  }
};

export function PostPreviewV3({ dataObj }: { dataObj: PostTeaserObjectProps }) {
  let hasImage = false;
  if (dataObj.heroFile && dataObj.heroAltText) {
    hasImage = true;
  }

  const linkTo = `/blog/${dataObj.slug}`;
  const linkToCat = `/blog/categories/${dataObj['category-slug']}`;

  const postedDate = dateGetter(dataObj.date);

  return (
    <div className='size-full md:p-2'>
      <div className='motion-safe:simple-color-trans  flex size-full flex-col gap-6 overflow-hidden border-y border-ctp-surface0 bg-ctp-base p-10 dark:bg-ctp-midnight  md:gap-0 md:rounded-2xl md:border md:p-0'>
        {hasImage ? (
          <Link
            href={linkTo}
            className=' relative flex min-h-80 items-center justify-center overflow-hidden rounded-2xl  border-ctp-surface0  motion-safe:[transition:_border_0.3s] md:rounded-none md:border-b'
          >
            <Image
              loader={imageLoader}
              src={dataObj.heroFile!}
              placeholder='blur'
              blurDataURL={dataObj.blurUrl}
              alt={dataObj.heroAltText!}
              sizes='(max-width: 300px) 70vw, (max-width: 600px) 45vw, (max-width:1500px) 27vw'
              fill
              className='object-cover '
            />
          </Link>
        ) : (
          ''
        )}
        <div className={`flex flex-col gap-6 md:p-10 ${hasImage ? '' : 'size-full items-center justify-center'}`}>
          <div className='w-full space-y-2'>
            <h2>
              <Link
                id='post-title'
                href={linkTo}
                className=' max-w-max flex-none text-wrap text-3xl font-black leading-tight text-ctp-text supports-[text-wrap:balance]:text-balance md:text-4xl'
              >
                {dataObj.headline}
              </Link>
            </h2>
            <h3 className='text-xl leading-tight'>{dataObj.subheadline}</h3>
          </div>
          <div className='flex w-full flex-wrap gap-2 font-mono'>
            <p>{postedDate?.cal}</p>
            <span>|</span>
            <Link href={linkToCat} className={`font-mono font-semibold ${accentTextColor}`}>
              #{dataObj['category-slug']}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostPreviewV3({ dataObj, descr }: { dataObj: PostTeaserObjectProps; descr?: string }) {
  let hasImage = false;
  if (dataObj.heroFile && dataObj.heroAltText) {
    hasImage = true;
  }

  const linkTo = `/blog/${dataObj.slug}`;
  const linkToCat = `/blog/categories/${dataObj['category-slug']}`;

  const postedDate = dateGetter(dataObj.date);

  return (
    <div className='flex size-full items-center justify-center'>
      <div
        className={`${hasImage ? 'pb-10 md:p-0 lg:px-10 lg:py-24' : 'py-10 md:p-0 lg:p-0'} motion-safe:simple-color-trans flex size-full max-w-7xl flex-col gap-10  bg-ctp-base  dark:bg-ctp-midnight md:gap-0 lg:flex-row-reverse lg:items-center lg:justify-between`}
      >
        {dataObj.heroFile && dataObj.heroAltText ? (
          <Link
            href={linkTo}
            className='relative m-0 size-full min-h-96 overflow-hidden rounded-none border-ctp-surface0 p-0 motion-safe:[transition:_border_0.3s] md:h-[30rem] md:border-b lg:rounded-2xl'
          >
            <Image
              loader={imageLoader}
              src={dataObj.heroFile}
              placeholder='blur'
              blurDataURL={dataObj.blurUrl}
              alt={dataObj.heroAltText}
              sizes='100vw'
              fill
              className='object-cover'
            />
          </Link>
        ) : (
          ''
        )}
        <div
          className={`${hasImage ? 'md:p-10 md:py-20 lg:p-0 lg:pr-20' : 'md:p-10 lg:pt-20'} flex size-full flex-col items-center justify-center gap-6 px-10`}
        >
          <div className='size-full max-w-xl'>
            <div className='flex flex-col gap-10'>
              <div className='flex flex-col gap-2'>
                <h2>
                  <Link
                    id='post-title'
                    href={linkTo}
                    className='max-w-max flex-none text-wrap text-4xl font-black leading-tight text-ctp-text supports-[text-wrap:balance]:text-balance md:text-5xl'
                  >
                    {dataObj.headline}
                  </Link>
                </h2>
                <h3 className='text-2xl font-semibold leading-tight supports-[text-wrap:pretty]:text-pretty md:text-3xl'>
                  {dataObj.subheadline}
                </h3>
              </div>
              <p className='prose-protocol-omega'>{descr}</p>
              <div className='flex flex-wrap gap-2 font-mono text-lg'>
                <p>{postedDate?.cal}</p>
                <span>|</span>
                <Link href={linkToCat} className={`font-mono text-xl font-semibold ${accentTextColor} `}>
                  #{dataObj['category-slug']}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
