import Link from "next/link";


const tagLinker = (idStr: string, slugStr: string) => {
  const newStr = idStr.split('-').shift();
  const tagLink = `/blog/tags/${newStr}/${slugStr}`;
  return tagLink;
};

export function TagsRoller({ tagsArr }: { tagsArr: { slug: string; title: string; id: string }[] }) {
    const singleTag = tagLinker(tagsArr[0]!.id, tagsArr[0]!.slug)
    return (
      <span className='flex flex-wrap gap-2'>
        {/*{tagsArr.length > 1 ? 'tags:' : 'tagged:'}*/}
        {tagsArr.length === 1 ? (
          <Link href={singleTag} id='post-title'>
            {tagsArr[0]?.title}
          </Link>
        ) : (
          <>
            {tagsArr.map((tag) => (
              <Link key={`${tagsArr.indexOf(tag)}-${Math.floor(Math.random()*1000)}`} href={tagLinker(tag.id, tag.slug)} id='post-title'>
                {tag.title}
                {tagsArr.indexOf(tag) < tagsArr.length - 1 ? ',' : ''}
              </Link>
            ))}
          </>
        )}
      </span>
    );
  }