'use client';
import Image from 'next/image';
import Link from 'next/link';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import { imageLoader } from '@/utils/image-loader';
import type { QueryPostMetaItem } from '@/lib/node-db-funcs';
import { TagsRoller } from './tags-roller';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

interface DateGetterReturn {
  cal?: string;
  time?: string;
  fromNow?: string;
  timezone: string;
}

const linker = (idStr: string, slugStr: string) => {
  const newStr = idStr.split('-').shift();
  const blogLink = `/blog/posts/${newStr}/${slugStr}`;
  return blogLink;
};

const dateGetter = (dateString: Date): DateGetterReturn | undefined => {
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
  if (difference >= 7) {
    return {
      cal: publishedDate.format('L'),
      time: publishedDate.format('LT'),
      fromNow: undefined,
      timezone: dayjs.tz.guess(),
    };
  }
};

export function PostPreviewV3({ dataObj }: { dataObj: QueryPostMetaItem }) {
  let hasImage = false;
  if (dataObj.featuredImage?.fileLocation && dataObj.featuredImage.altText) {
    hasImage = true;
  }

  const linkTo = linker(dataObj.id, dataObj.slug);

  const postedDate = dateGetter(dataObj.date);
  const tagsArr = dataObj.tags;

  return (
    <div className='size-full md:p-2'>
      <div className='motion-safe:simple-color-trans  flex size-full flex-col gap-6 overflow-hidden border-y border-ctp-surface0 bg-ctp-base p-10 dark:bg-ctp-midnight  md:gap-0 md:rounded-2xl md:border md:p-0'>
        {hasImage ? (
          <Link
            href={linkTo}
            className='relative flex size-full items-center justify-center overflow-hidden rounded-2xl border-ctp-surface0  motion-safe:[transition:_border_0.3s]  md:size-fit md:rounded-none md:border-b'
          >
            <Image
              loader={imageLoader}
              src={dataObj.featuredImage!.fileLocation}
              placeholder='blur'
              blurDataURL={dataObj.featuredImage?.blur}
              alt={dataObj.featuredImage!.altText}
              height={dataObj.featuredImage?.height}
              width={dataObj.featuredImage?.width}
              sizes='(max-width: 300px) 70vw, (max-width: 600px) 45vw, (max-width:1500px) 27vw'
              className='object-contain md:h-96 md:object-cover'
            />
          </Link>
        ) : (
          ''
        )}
        <div className={`flex flex-col gap-6 md:p-10 ${hasImage ? '' : 'size-full items-center justify-center'}`}>
          <div className='w-full space-y-2'>
            <Link
              id='post-title'
              href={linkTo}
              className=''
            >
              <h2 className='max-w-md flex-none text-wrap text-3xl font-black leading-tight text-ctp-text supports-[text-wrap:balance]:text-balance md:text-4xl'>
                {dataObj.headline}
              </h2>
            </Link>
            <h3 className='text-xl leading-tight'>{dataObj.subheadline}</h3>
          </div>
          <div className='flex w-full flex-wrap gap-2 font-mono'>
            <p>{postedDate?.cal ?? postedDate?.fromNow}</p>
            <span>|</span>
            <TagsRoller tagsArr={tagsArr} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostPreviewV3({ dataObj, descr }: { dataObj: QueryPostMetaItem; descr?: string }) {
  let hasImage = false;
  if (dataObj.featuredImage?.fileLocation && dataObj.featuredImage.altText) {
    hasImage = true;
  }

  const postedDate = dateGetter(dataObj.date);
  const tagsArr = dataObj.tags;

  const linkTo = linker(dataObj.id, dataObj.slug);

  return (
    <div className='flex size-full items-center justify-center'>
      <div
        className={`${hasImage ? 'pb-10 md:p-0 lg:px-10 lg:pb-24 lg:pt-36' : 'py-10 md:p-0 lg:p-0'} motion-safe:simple-color-trans flex size-full max-w-7xl flex-col gap-10  bg-ctp-base  dark:bg-ctp-midnight md:gap-0 lg:flex-row-reverse lg:items-center lg:justify-between`}
      >
        {hasImage ? (
          <Link
            href={linkTo}
            className='relative m-0 size-full overflow-hidden rounded-none border-ctp-surface0 p-0 motion-safe:[transition:_border_0.3s] md:border-b lg:rounded-2xl'
          >
            <Image
              loader={imageLoader}
              src={dataObj.featuredImage!.fileLocation}
              alt={dataObj.featuredImage!.altText}
              height={dataObj.featuredImage?.height}
              width={dataObj.featuredImage?.width}
              placeholder='blur'
              blurDataURL={dataObj.featuredImage?.blur}
              sizes='(max-width: 600px) 100vw, (max-width:1024px) 50vw'
              className='object-contain lg:h-[30rem] lg:object-cover'
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
              <div className='flex flex-wrap items-center gap-2 font-mono text-lg'>
                <p>{postedDate?.cal ?? postedDate?.fromNow}</p>
                <span>|</span>
                <TagsRoller tagsArr={tagsArr} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
