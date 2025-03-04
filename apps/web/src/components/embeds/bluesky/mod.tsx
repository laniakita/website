'use client';

import { BlobRef } from '@atproto/api';
import { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { OutputSchema } from '@atproto/api/dist/client/types/app/bsky/feed/getPostThread';
import { Url } from 'next/dist/shared/lib/router/router';
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
      return { postUri, actorHandle }
    }

    async function fetchAgent(url: string) {
      const atpAgent = await import('./agent').then(mod => mod.atpAgent)

      const { postUri, actorHandle } = urlUtil(url)
      const authorDID = await atpAgent.app.bsky.actor.getProfile({ actor: actorHandle }).then((res) => res.data.did)
      const postATUri = `at://${authorDID}/app.bsky.feed.post/${postUri}`
      const post = await atpAgent.app.bsky.feed.getPostThread({ uri: postATUri }).then((res) => res.data);
      setData(post)
      console.log(post)
    }
    fetchAgent(postUrl)

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
      }
      const img = postData.post.embed.images[0] as Image;

      return (
        <div className='no-prose w-full p-4 rounded-2xl bg-ctp-base border border-ctp-surface0 flex justify-center items-center -gap-2'>
          <div className='flex flex-col gap-2'>
          <div className='flex flex-row items-center gap-2'>
            <div className='relative'>
            <Image src={avatar!} alt={`${displayName}'s avatar`} width={50} height={50} className='rounded-full border border-ctp-surface0 -my-0 object-contain' /> 
            </div>
            <p className='flex flex-col -space-y-2'>
              <span className='font-bold text-xl'>{displayName}</span>
              <a href={`https://bsky.app/profile/${handle}`} className='text-ctp-subtext0 hover:text-ctp-subtext1 no-underline' >@{handle}</a>
            </p>
          </div>
          <p>{text}</p>
          <Image src={img.thumb} alt={img.alt} height={img.aspectRatio.height} width={img.aspectRatio.width} className='rounded-2xl border border-ctp-surface0 -my-0' />
          </div>
        </div>
      );



    }

    /*
    const _embed = embed as Record<string, any>;
    if ('$type' in _embed && _embed.$type === 'app.bsky.embed.images') {
      


    }
    
    const images = embed.images

    return (
      <div className='w-full p-10 rounded-2xl bg-ctp-base dark:bg-ctp-midnight'>
      </div>
    );
    */

  }

  return (
    <p>hi</p>
  )

};
