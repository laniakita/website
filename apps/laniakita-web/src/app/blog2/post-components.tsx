import localLoader from '@/lib/local-loader';
import { imageLoader } from '@/utils/image-loader';
import { type Post } from 'contentlayer/generated';
import Image from 'next/image';

export default function PostRollerV4({ posts }: { posts: Post[] }) {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col gap-4 md:gap-6'>
        {posts.map((post, idx) => (
          <PostPreviewV4 key={idx} {...post} />
        ))}
      </div>
    </div>
  );
}

function PostPreviewV4(post: Post) {
  return (
    <div className='flex basis-full flex-col gap-4 border border-ctp-surface0 dark:border-ctp-base md:gap-6'>
      <Image
        loader={
          localLoader
          //imageLoader
        }
        src={post.featured_image.src}
        placeholder='blur'
        blurDataURL={post.featured_image.base64}
        alt={post.altText!}
        height={post.featured_image.height}
        width={post.featured_image.width}
        sizes='(max-width: 300px) 70vw, (max-width: 600px) 45vw, (max-width:1500px) 27vw'
        className='object-contain'
      />
      <div className='px-4 md:px-6'>
        <h2 className='text-3xl font-black leading-tight'>{post.headline}</h2>
        <h3 className='text-2xl font-semibold leading-tight pt-2'>{post.subheadline}</h3>
      </div>
      <p className='px-4 pb-4 md:px-6 md:pb-6 -pt-2'>{descriptionHelper(post.body.raw)}</p>
    </div>
  );
}

const descriptionHelper = (rawStr: string) => {
  if (!rawStr) return;

  const findDescr = rawStr.split('\n').map((strPara) => {
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && strPara.split(' ')[0] !== '##') {
      return strPara;
    }
    return undefined;
  });

  return findDescr.filter((el) => el)[0];
};
