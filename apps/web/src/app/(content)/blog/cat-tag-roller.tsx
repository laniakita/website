import Link from 'next/link';
import { Suspense } from 'react';
import { catTagData } from '@/lib/cat-tag-data';

export function CatTagRoller({ cats, tags }: { cats?: string[] | undefined; tags?: string[] | undefined }) {
  const uniqueKey = (idx: number) => {
    const num = Math.floor(Math.random() * 1000 + idx);

    return `category-tag-${crypto.randomUUID()}-${num}-${idx}`;
  };

  const comboArr = catTagData({ cats, tags });

  return (
    <Suspense>
      <div className='flex w-fit flex-wrap text-sm font-semibold'>
        {comboArr.map((combo, idx) => (
          <p key={uniqueKey(idx)} className=''>
            <Link href={`/${combo?._raw.flattenedPath}`}>
              <span className=''>{`${combo?.type === 'Tag' ? '#' : ''}${combo?.title}`}</span>
            </Link>
            {comboArr[idx]?.type === 'Category' && comboArr[idx + 1]?.type === 'Tag' ? (
              <span className='px-2 font-light'>|</span>
            ) : (
              idx < comboArr.length - 1 && <span className='pr-[0.5ch]'>,</span>
            )}
          </p>
        ))}
      </div>
    </Suspense>
  );
}
