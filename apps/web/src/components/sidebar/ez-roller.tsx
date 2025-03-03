import { categories, tags } from '$/.source';
import Link from 'next/link';

export default function EzRoller({ arrayString, title }: { arrayString: string; title: string }) {
  const uniqueKey = crypto.randomUUID();
  const array = JSON.parse(arrayString) as typeof categories | typeof tags;

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
