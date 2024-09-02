'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useId } from 'react';
import { catTagData } from '@/lib/cat-tag-data';

const LocalDate = dynamic(() => import('./local-date').then((mod) => mod.default), {
  ssr: false,
  loading: () => <span>Month, Xst, 2KZZ</span>,
});

export function CatTagRoller({
  cats,
  tags,
  postDate,
  showDate,
}: {
  cats?: string[] | undefined;
  tags?: string[] | undefined;
  postDate: string | Date;
  showDate?: boolean;
}) {
  const uniqueKey = useId();
  const comboArr = catTagData({ cats, tags });

  return (
    <Suspense>
      <div className='flex flex-wrap'>
        {showDate ? (
          <>
            <p className='w-fit rounded-full font-mono'>
              <LocalDate date={postDate} />
            </p>
            <span className='px-[1ch] font-mono'>|</span>
          </>
        ) : (
          ''
        )}
        {comboArr.map((combo, idx) => (
          <p key={`category-tag-${uniqueKey}-${Math.floor(Math.random() * 1000)}`} className='font-mono'>
            <Link href={`/${combo?._raw.flattenedPath}`}>
              <span className='font-bold'>{`${combo?.type === 'Tag' ? '#' : ''}${combo?.title}`}</span>
            </Link>
            {comboArr[idx]?.type === 'Category' && comboArr[idx + 1]?.type === 'Tag' ? (
              <span className='px-[1ch]'>|</span>
            ) : (
              idx < comboArr.length - 1 && <span className='pr-[1ch]'>,</span>
            )}
          </p>
        ))}
      </div>
    </Suspense>
  );
}
