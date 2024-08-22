import { allCategories, allTags } from 'contentlayer/generated';
import Link from 'next/link';
import { useId } from 'react';

interface CatTag {
  slug: string;
}

export function CatTagRoller({ cats, tags }: { cats?: string[] | undefined; tags?: string[] | undefined }) {
  const uniqueKey = useId();


  const categories = cats
    ? cats.map((cat) => {
        const category = allCategories.find(
          (category) => category._raw.flattenedPath === `categories/${(cat as unknown as CatTag).slug}`,
        );

        return category;
      })
    : [];
  const tagsArr = tags
    ? tags.map((tagIdx) => {
        const tag = allTags.find((tag) => tag._raw.flattenedPath === `tags/${(tagIdx as unknown as CatTag).slug}`);

        return tag;
      })
    : [];

  const comboArr = [...categories.sort((a,b) => a!.title!.localeCompare(b!.title!)), ...tagsArr.sort((a,b) => a!.title!.localeCompare(b!.title!))];

  return (
    <div className='flex flex-wrap'>
      {comboArr
        ? comboArr.map((combo, idx) => (
            <p 
              key={`category-tag-${uniqueKey}-${Math.floor(Math.random() * 1000)}`}
              className='font-mono'>
              <Link href={`/${combo?._raw.flattenedPath}`}>
                <span className='font-bold'>{`${combo?.type === 'Tag' ? '#' : ''}${combo?.title}`}</span>
              </Link>
              {comboArr[idx]?.type === 'Category' && comboArr[idx + 1]?.type === 'Tag' ? (
                <span className='px-[1ch]'>{`|`}</span>
              ) : (
                idx < comboArr.length - 1 && <span className='pr-[1ch]'>{`,`}</span>
              )}
            </p>
          ))
        : ''}
    </div>
  );
}


