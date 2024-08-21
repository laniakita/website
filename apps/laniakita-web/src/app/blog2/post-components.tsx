import localLoader from '@/lib/local-loader';
import { imageLoader } from '@/utils/image-loader';
import { resMdxNoImgBundle } from '@/utils/mdxbundler-main';
import { type Post } from 'contentlayer/generated';
import { getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';
import { useMemo } from 'react';

export default function PostRollerV4({ posts }: { posts: Post[] }) {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col gap-6 md:gap-10'>
        {posts.map((post, idx) => (
          <PostPreviewV4 key={idx} {...post} />
        ))}
      </div>
    </div>
  );
}

function MiniMDX({ code, frontmatter }: Record<string, any>) {
  const MDXComponent = useMemo(() => getMDXComponent(code), [code]);
  return (
    <>
      <MDXComponent />
    </>
  );
}

async function PostPreviewV4(post: Post) {
  const descriptionStr = descriptionHelper(post.body.raw) as string;
  const MDXStr = await resMdxNoImgBundle(descriptionStr, './content2');
  return (
    <div className='flex basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 dark:border-ctp-base'>
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
      <div className='p-6 md:p-10 flex flex-col gap-6'>
        <div className=''>
          <h2 className='text-balance text-3xl font-black'>{post.headline}</h2>
          <h3 className='text-balance text-2xl font-light pt-2'>{post.subheadline}</h3>
        </div>
        <div className='w-full h-px bg-ctp-surface0 rounded' />
        <div className='prose-protocol-omega max-w-full prose-p:my-0 text-pretty prose-p:text-base'>
          <MiniMDX code={MDXStr.code} />
        </div>
      </div>
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
