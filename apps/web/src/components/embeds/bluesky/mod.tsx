'use client';

import { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { OutputSchema } from '@atproto/api/dist/client/types/app/bsky/feed/getPostThread';
import { format } from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const BlueskyEmbedCore = ({ postUrl }: { postUrl: string }) => {
  const [data, setData] = useState<OutputSchema>();

  useEffect(() => {
    function urlUtil(url: string) {
      // url example: https://bsky.app/profile/laniakita.com/post/3lio7a7quw227
      const urlArr = url?.split('/')?.slice(-3); // grab /actor_handle/post/post_uri
      const postUri = urlArr?.pop() ?? '';
      const actorHandle = urlArr?.shift() ?? '';
      return { postUri, actorHandle };
    }

    async function fetchAgent(url: string) {
      const atpAgent = await import('./agent').then((mod) => mod.atpAgent);

      const { postUri, actorHandle } = urlUtil(url);
      const authorDID = await atpAgent.app.bsky.actor.getProfile({ actor: actorHandle }).then((res) => res.data.did);
      const postATUri = `at://${authorDID}/app.bsky.feed.post/${postUri}`;
      const post = await atpAgent.app.bsky.feed.getPostThread({ uri: postATUri }).then((res) => res.data);
      setData(post);
      console.log(post);
    }
    fetchAgent(postUrl);
  }, [postUrl]);

  if (data?.thread.$type === 'app.bsky.feed.defs#threadViewPost') {
    const postData = data.thread as ThreadViewPost;
    const { avatar, displayName, handle } = postData.post.author;
    const { text } = postData.post.record;
    if (postData.post.embed?.$type === 'app.bsky.embed.images#view' && 'images' in postData.post.embed) {
      type Image = {
        alt: string;
        aspectRatio: {
          height: number;
          width: number;
        };
        thumb: string;
      };

      const img = postData.post.embed.images[0] as Image;
      const formattedDate = format(new Date(postData.post.indexedAt), "LLLL d, yyyy 'at' p");

      return (
        <div className='not-prose -gap-2 flex w-full items-center justify-center rounded-2xl border border-ctp-surface0 bg-ctp-base p-4'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-row items-center gap-2'>
              <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow'>
                <Image
                  priority={false}
                  placeholder='empty'
                  src={avatar!}
                  alt={`${displayName}'s avatar`}
                  width={50}
                  height={50}
                  className='-my-0 rounded-full border border-ctp-surface0 object-contain'
                />
              </a>
              <p className='flex flex-col -space-y-1'>
                <span className='text-xl font-bold'>{displayName}</span>
                <a
                  href={`https://bsky.app/profile/${handle}`}
                  className='text-sm text-ctp-subtext0 no-underline hover:text-ctp-subtext1'
                >
                  @{handle}
                </a>
              </p>
            </div>
            <p className='text-lg'>{text as string}</p>
            <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow'>
              <Image
                priority={false}
                placeholder='empty'
                src={img.thumb}
                alt={img.alt}
                height={img.aspectRatio.height}
                width={img.aspectRatio.width}
                className='-my-0 rounded-2xl border border-ctp-surface0 object-contain shadow-xl'
              />
            </a>
            <div className='flex flex-col gap-2'>
              <time className='text-sm'>{formattedDate}</time>
              <div className='h-px w-full bg-ctp-subtext0' />
              <div className='flex flex-row items-center gap-4'>
                <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
                  <p className='flex flex-row items-center gap-1'>
                    <span className='icon-[ph--chat-circle-bold] text-xl' />
                    {postData.replies?.length}
                  </p>
                </a>

                <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
                  <p className='flex flex-row items-center gap-1'>
                    <span className='icon-[ph--repeat-bold] text-xl' />
                  </p>
                </a>
                <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
                  <p className='flex flex-row items-center gap-1'>
                    <span className='icon-[ph--heart-bold] text-xl' />
                    {postData.post.likeCount}
                  </p>
                </a>
                <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
                  <p className='flex flex-row items-center gap-1'>
                    <span className='icon-[ph--upload-bold] text-xl' />
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className='not-prose -gap-2 flex w-full items-center justify-center rounded-2xl border border-ctp-surface0 bg-ctp-base p-4'>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex flex-row items-center gap-2'>
          <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow'>
            <div className='-my-0 h-[50px] w-[50px] rounded-full border border-ctp-surface0 bg-ctp-pink object-contain' />
          </a>
          <p className='flex flex-col -space-y-1'>
            <span className='text-xl font-bold'>User</span>
            <a
              href={`https://bsky.app/`}
              className='text-sm text-ctp-subtext0 no-underline hover:text-ctp-subtext1'
            >{`@Username`}</a>
          </p>
        </div>
        <p className='text-lg'>Hello world!</p>

        <div className='flex flex-col gap-2'>
          <time className='text-sm'>July 20, 1969 at 20:17</time>
          <div className='h-px w-full bg-ctp-subtext0' />
          <div className='flex flex-row items-center gap-4'>
            <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
              <p className='flex flex-row items-center gap-1'>
                <span className='icon-[ph--chat-circle-bold] text-xl' />
              </p>
            </a>

            <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
              <p className='flex flex-row items-center gap-1'>
                <span className='icon-[ph--repeat-bold] text-xl' />
              </p>
            </a>
            <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
              <p className='flex flex-row items-center gap-1'>
                <span className='icon-[ph--heart-bold] text-xl' />
              </p>
            </a>
            <a href={postUrl} target='_blank' rel='noreferrer noopener nofollow' className='hover:no-underline'>
              <p className='flex flex-row items-center gap-1'>
                <span className='icon-[ph--upload-bold] text-xl' />
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
