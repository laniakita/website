'use client';
import { useMemo, useState } from 'react';
import { usePostNumStore } from '@/providers/postnum-store-provider';
import LoadMoreButton from '@/components/blog/load-more-button';
import { FeaturedPostPreviewV3, PostPreviewV3 } from '@/components/blog/post-preview-v3';
import type { PostTeaserObjectProps } from '@/app/(main)/blog/page';

interface PreviewRollerV3Props {
  dataArr: PostTeaserObjectProps[];
  baseUrl?: string;
  isCat?: boolean;
}

export default function PreviewRollerV3({ dataArr, isCat }: PreviewRollerV3Props) {
  const { postNum } = usePostNumStore((state) => state);
  const [canLoad, setCanLoad] = useState(true);

  useMemo(() => {
    if (postNum > dataArr.length) {
      setCanLoad(false);
    }
  }, [dataArr, postNum, setCanLoad]);

  return (
    <>
      {!isCat && <FeaturedPostPreviewV3 dataObj={dataArr[0]!} />}
      <div className='flex flex-col-reverse items-center justify-center md:flex-row md:items-start '>
        <div className='size-full'>
          <div className='flex flex-wrap'>
            {dataArr.slice(isCat ? 0 : 1, postNum).map((post: PostTeaserObjectProps) => (
              <div key={dataArr.indexOf(post)} className='basis-full md:basis-1/2 2xl:basis-1/3'>
                <PostPreviewV3 dataObj={post} />
              </div>
            ))}
            <div className='grow'>
              <LoadMoreButton shouldLoad={canLoad} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/*
function BlogInfoBox() {
  const infoString =
    "Hey! Welcome to my web dev blog. This is where I keep technical notes on some of the tools I'm working with, as well as form some long winded opinions on them. If you like what ya see, consider subscribing to the RSS feed! And if you think I've helped in someway, consider subscribing to the Patreon.";
  return (
    <div className='flex size-full items-center justify-center border-ctp-surface0 bg-ctp-mauve p-10 text-ctp-base md:size-1/3 md:max-w-md md:rounded-2xl md:border'>
      <p>{infoString}</p>
    </div>
  );
}
*/
