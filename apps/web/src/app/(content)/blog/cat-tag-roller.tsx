import Link from 'next/link';
import { Suspense } from 'react';

export interface CatTag {
  title: string | undefined;
  url: string | undefined;
  type: string | undefined;
}

export function CatTagRoller({ cats, tags }: { cats?: CatTag[] | undefined; tags?: CatTag[] | undefined }) {
  const uniqueKey = (idx: number) => {
    const num = Math.floor(Math.random() * 1000 + idx);

    return `category-tag-${crypto.randomUUID()}-${num}-${idx}`;
  };

  const comboArr = [...(cats ?? ''), ...(tags ?? '')] as CatTag[];

  return (
    <Suspense>
      <div className='flex w-fit flex-wrap font-mono text-sm font-semibold'>
        {comboArr.map((combo, idx) => (
          <p key={uniqueKey(idx)} className=''>
            <Link href={combo?.url ?? ''}>
              <span className=''>{`${combo?.type === 'Tag' ? '#' : ''}${combo?.title}`}</span>
            </Link>
            {comboArr[idx]?.type === 'Category' && comboArr[idx + 1]?.type === 'Tag' ? (
              <span className='px-[0.5ch] font-light'>|</span>
            ) : (
              idx < comboArr.length - 1 && <span className='pr-[0.5ch]'>,</span>
            )}
          </p>
        ))}
      </div>
    </Suspense>
  );
}
