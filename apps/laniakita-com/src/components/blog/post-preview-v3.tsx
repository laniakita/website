'use client';
import Image from 'next/image';
import Link from 'next/link';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import { shimmer, toBase64 } from '@/utils/shimmer-utils';
import type { PostTeaserObjectProps } from '@/app/blog/page';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

const accentTextColor = 'text-ctp-mauve';
const imageLoader = ({ src, width, quality }: { src?: string; width?: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality ?? 50}`;
};

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

  const catSerializer = dataObj.category?.replaceAll(' ', '_');
  const postSlugSerializer = dataObj.headline.replaceAll(' ', '_');

  /* chopping up the ID to only be the first bit is risky, but A E S T H E T I C
   * granted in the event we do get a collission, I could just perform a second query for the whole thing
   * */
  const linkTo = `/blog/posts/${dataObj.id.split('-')[0]}/${postSlugSerializer}`;
  const linkToCat = `/blog/${catSerializer}`;

  const postedDate = dateGetter(dataObj.date);

  return (
    <div className='motion-safe:simple-color-trans pointer-events-none flex size-full flex-col gap-6 overflow-hidden  border-y border-ctp-surface0 bg-ctp-base p-10 hover:border-ctp-mauve  has-[:focus]:border-ctp-mauve dark:bg-ctp-midnight md:gap-0 md:border md:p-0'>
      {hasImage ? (
        <Link
          href={linkTo}
          className='pointer-events-auto relative flex min-h-96 items-center justify-center overflow-hidden rounded-2xl  border-ctp-surface0 motion-safe:[transition:_border_0.3s] md:rounded-none md:border-b lg:h-[40vh]'
        >
          <Image
            loader={imageLoader}
            src={dataObj.heroFile!}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            alt={dataObj.heroAltText!}
            fill
            className={`object-cover transition-all `}
            sizes='(max-width: 300px) 100vw, (max-width: 600px) 50vw, 33vw'
          />
        </Link>
      ) : (
        ''
      )}
      <div className={`flex flex-col gap-6 md:p-10 ${hasImage ? '' : 'size-full items-center justify-center'}`}>
        <div className='w-full space-y-2'>
          <p>
            <Link href={linkToCat} className={`font-mono font-semibold ${accentTextColor} pointer-events-auto`}>
              {dataObj.category}
            </Link>
          </p>
          <h2>
            <Link
              id='post-title'
              href={linkTo}
              className='pointer-events-auto max-w-max flex-none text-wrap text-3xl font-black uppercase text-ctp-text supports-[text-wrap:balance]:text-balance md:text-4xl'
            >
              {dataObj.headline}
            </Link>
          </h2>
          <h3 className='text-xl'>{dataObj.subheadline}</h3>
        </div>
        <div className='flex w-full flex-wrap gap-2 font-mono'>
          {postedDate?.cal ? (
            <p className='space-x-2'>
              <span>{postedDate.cal}</span>
              <span>{postedDate.time}</span>
              <span>{postedDate.timezone}</span>
            </p>
          ) : (
            <p className='space-x-2'>
              <span>{postedDate?.fromNow}</span>
              <span>{postedDate?.timezone}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostPreviewV3({ dataObj }: { dataObj: PostTeaserObjectProps }) {
  let hasImage = false;
  if (dataObj.heroFile && dataObj.heroAltText) {
    hasImage = true;
  }

  const catSerializer = dataObj.category?.replaceAll(' ', '_');
  const postSlugSerializer = dataObj.headline.replaceAll(' ', '_');

  const linkTo = `/blog/posts/${dataObj.id.split('-')[0]}/${postSlugSerializer}`;
  const linkToCat = `/blog/${catSerializer}`;

  const postedDate = dateGetter(dataObj.date);

  return (
    <div
      className={`${hasImage ? 'pb-10 md:p-0 lg:pb-0' : 'py-10 md:p-0 lg:p-0'} motion-safe:simple-color-trans pointer-events-none flex size-full flex-col gap-10 border-y border-ctp-surface0 bg-ctp-base   hover:border-ctp-mauve has-[:focus]:border-ctp-mauve dark:bg-ctp-midnight md:gap-0 md:border lg:flex-row-reverse lg:items-center lg:justify-between`}
    >
      {dataObj.heroFile && dataObj.heroAltText ? (
        <Link
          href={linkTo}
          className='pointer-events-auto relative size-full h-[70vh]  min-h-[30rem] border-ctp-surface0 motion-safe:[transition:_border_0.3s] md:rounded-none md:border-b'
        >
          <Image
            loader={imageLoader}
            src={dataObj.heroFile}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            alt={dataObj.heroAltText}
            fill
            className={`object-cover transition-all `}
            sizes='(max-width: 300px) 100vw, (max-width: 600px) 50vw, 33vw'
          />
        </Link>
      ) : (
        ''
      )}
      <div
        className={`${hasImage ? 'md:p-10 lg:min-w-[50%]  lg:max-w-[50%] 2xl:min-w-[33.33%]  2xl:max-w-[33.33%]  2xl:p-20' : 'md:p-10 lg:pt-20'} flex size-full flex-col justify-center gap-6 px-10`}
      >
        <div className='space-y-2'>
          <p>
            <Link href={linkToCat} className={`font-mono text-xl font-semibold ${accentTextColor} pointer-events-auto`}>
              {dataObj.category}
            </Link>
          </p>
          <h2>
            <Link
              id='post-title'
              href={linkTo}
              className='pointer-events-auto max-w-max flex-none text-wrap text-5xl font-black uppercase text-ctp-text supports-[text-wrap:balance]:text-balance md:text-6xl'
            >
              {dataObj.headline}
            </Link>
          </h2>
          <h3 className='text-2xl font-semibold supports-[text-wrap:pretty]:text-pretty md:text-3xl'>
            {dataObj.subheadline}
          </h3>
        </div>
        <div className='flex flex-wrap gap-2 font-mono text-lg'>
          {postedDate?.cal ? (
            <p className='space-x-2 break-keep'>
              <span>{postedDate.cal}</span>
              <span>{postedDate.time}</span>
              <span>{postedDate.timezone}</span>
            </p>
          ) : (
            <p className='space-x-2 break-keep'>
              <span>{postedDate?.fromNow}</span>
              <span>{postedDate?.timezone}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
