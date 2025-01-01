'use client';
import Link from 'next/link';
import type { Category, Tag } from 'contentlayer/generated';

export default function EzRoller({ array, title }: { array: Category[] | Tag[]; title: string }) {
  const uniqueKey = crypto.randomUUID();
  return (
    <>
      <h4 className='font-black'>{title}</h4>
      <div className='flex flex-wrap'>
        {array.map((arr, idx) => (
          <p key={`category-tag-${uniqueKey}-${Math.floor(Math.random() * 1000 * idx)}`}>
            <Link href={arr.url} className='font-mono underline'>
              {arr.title}
            </Link>
            <span>{idx < array.length - 1 ? <span className='pr-[1ch]'>,</span> : ''}</span>
          </p>
        ))}
      </div>
    </>
  );
}
