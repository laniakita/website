'use client';
import Markdown from 'markdown-to-jsx';
import { useState } from 'react';
import { type Category, type Tag } from 'contentlayer/generated';
import { type SocialNavIcon } from '../social-icon';
import { SocialIconNav2 } from './social-icon-nav-client';
import EzRoller from './ez-roller';

export default function InfoBox({
  categories,
  tags,
  socialItems,
  blogInfo,
}: {
  categories: Category[];
  tags: Tag[];
  socialItems: SocialNavIcon[];
  blogInfo: string;
}) {
  const [isActiveTab, setIsActiveTab] = useState('info');

  return (
    <div className=''>
      <div className='sidebar-box relative flex flex-col gap-6'>
        {isActiveTab === 'info' && (
          <div className='prose-protocol-omega p-6 pt-[4.15rem] prose-p:my-0'>
            <Markdown options={{ forceBlock: true }}>{blogInfo}</Markdown>
          </div>
        )}

        {isActiveTab === 'meta' && (
          <div className='flex flex-col gap-2 px-6 pb-6 pt-[4.15rem]'>
            <div>
              <EzRoller title='Categories' array={categories} />
            </div>
            <div>
              <EzRoller title='Tags' array={tags} />
            </div>
          </div>
        )}

        <div className='absolute top-0 flex w-full flex-col gap-0 rounded-t-md bg-ctp-surface2 dark:bg-ctp-crust'>
          <div className='flex w-full flex-row'>
            <div className='flex w-full px-6 pt-2'>
              <button
                type='button'
                onClick={() => {
                  setIsActiveTab('info');
                }}
                className={`tab-btn relative ${isActiveTab === 'info' ? 'bg-ctp-crust dark:bg-ctp-base' : ''}`}
              >
                <SmoothTab active={isActiveTab === 'info'} />
                <span className='icon-[ph--info] text-xl' /> info
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsActiveTab('meta');
                }}
                className={`tab-btn relative ${isActiveTab === 'meta' ? 'bg-ctp-crust dark:bg-ctp-base' : ''}`}
              >
                <SmoothTab active={isActiveTab === 'meta'} />
                <span className='icon-[ph--tag-light] text-xl' /> meta
              </button>
            </div>
          </div>

          <div className='h-3 w-full rounded-t bg-ctp-crust dark:bg-ctp-base' />
        </div>
      </div>
    </div>
  );
}

function SmoothTab({ active }: { active: boolean }) {
  return (
    <>
      <span
        className={`${active ? 'block' : 'hidden'} absolute -left-4 bottom-0 size-4 [background:radial-gradient(circle_at_25%_25%,_#acb0be,_#acb0be_72%,_#dce0e8_5%,_#dce0e8_100%)] dark:[background:radial-gradient(circle_at_25%_25%,_#11111b,_#11111b_72%,_#1e1e2e_5%,_#1e1e2e_100%)]`}
      />
      <span
        className={`${active ? 'block' : 'hidden'} absolute -right-4 bottom-0 size-4 [background:radial-gradient(circle_at_75%_25%,_#acb0be,_#acb0be_72%,_#dce0e8_5%,_#dce0e8_100%)]  dark:[background:radial-gradient(circle_at_75%_25%,_#11111b,_#11111b_72%,_#1e1e2e_5%,_#1e1e2e_100%)]`}
      />
    </>
  );
}
