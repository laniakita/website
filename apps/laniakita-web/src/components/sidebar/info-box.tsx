'use client'
import Markdown from 'markdown-to-jsx';
import { useState } from 'react';
import { type Category, type Tag } from 'contentlayer/generated';
import { type SocialNavIcon } from '../social-icon';
import { SocialIconNav2 } from './social-icon-nav-client';
import EzRoller from './ez-roller';



export default function InfoBox({ categories, tags, socialItems, blogInfo }: { categories: Category[]; tags: Tag[]; socialItems: SocialNavIcon[]; blogInfo: string;  }) {

  return (
    <>
      <div className='sidebar-box relative flex flex-col gap-6'>
        <div className='prose-protocol-omega px-6 pt-6 font-mono prose-p:my-0'>
          <Markdown options={{ forceBlock: true }}>{blogInfo}</Markdown>
        </div>
        <div className='px-6 pb-12'>
          <SocialIconNav2 boxItems={socialItems} />
        </div>
        <div className='absolute bottom-0 flex w-full flex-row bg-ctp-base'>
          <div className='flex w-full px-2 pb-2'>
            <button className='basis-full rounded-b-md bg-ctp-mauve text-center'>Info</button>
            <button className='basis-full text-center active:bg-ctp-mauve'>Meta</button>
          </div>
        </div>
      </div>

      <div className='sidebar-box flex flex-col gap-2 font-mono'>
        <div>
          <EzRoller title="Categories" array={categories} />
        </div>
        <div>
          <EzRoller title="Tags" array={tags} />
        </div>
      </div>
    </>
  );
}
