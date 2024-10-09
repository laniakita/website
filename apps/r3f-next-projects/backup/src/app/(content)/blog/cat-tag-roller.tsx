import Link from 'next/link';
import { Suspense, useId } from 'react';
import { catTagData } from '@/lib/cat-tag-data';

export function CatTagRoller({ cats, tags }: { cats?: string[] | undefined; tags?: string[] | undefined }) {
  const uniqueKey = useId();
  const comboArr = catTagData({ cats, tags });

  return (
    <Suspense>
      <div className='flex w-fit flex-wrap'>
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
