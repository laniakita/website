'use client';
import { useState } from 'react';
import GlobalMDXRenderer from '@/components/mdx/global-mdx-renderer';
import { type SocialNavIcon } from '../social-icon';
import EzRoller from './ez-roller';

export default function InfoBox({
  categoriesString,
  tagsString,
  blogInfo,
}: {
  categoriesString: string;
  tagsString: string;
  socialItems: SocialNavIcon[];
  blogInfo: string;
}) {
  const [isActiveTab, setIsActiveTab] = useState('info');
  
  return (
    <div className=''>
      <div className='relative flex sidebar-box min-w-full flex-col gap-6 bg-ctp-base simple-color-trans dark:bg-ctp-midnight'>
        {isActiveTab === 'info' && (
          <div className='prose-protocol-omega p-6 pt-[4.5rem] prose-p:my-0'>
            <GlobalMDXRenderer>{blogInfo}</GlobalMDXRenderer>
          </div>
        )}

        {isActiveTab === 'meta' && (
          <div className='flex flex-col gap-2 px-6 pt-[4.5rem] pb-6'>
            <div>
              <EzRoller title='Categories' arrayString={categoriesString} />
            </div>
            <div>
              <EzRoller title='Tags' arrayString={tagsString} />
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
                className={`relative tab-btn ${isActiveTab === 'info' ? 'tab-btn-active' : ''}`}
              >
                <TabInner title='info' icon='icon-[ph--info]' active={isActiveTab === 'info'} />
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsActiveTab('meta');
                }}
                className={`relative tab-btn ${isActiveTab === 'meta' ? 'tab-btn-active' : ''}`}
              >
                <TabInner title='meta' icon='icon-[ph--tag]' active={isActiveTab === 'meta'} />
              </button>
            </div>
          </div>

          <div className='h-3 w-full rounded-t bg-ctp-crust dark:bg-ctp-base' />
        </div>
      </div>
    </div>
  );
}

function TabInner({ active, title, icon }: { active: boolean; title: string; icon: string }) {
  return (
    <>
      <span className={active ? 'hidden' : 'tab-btn-hover'} />
      <SmoothTab active={active} />
      <p className='tab-btn-text'>
        <span className={`${icon} text-xl`} /> {title}
      </p>
    </>
  );
}

function SmoothTab({ active }: { active: boolean }) {
  return (
    <>
      <span
        className={`${active ? 'block' : 'hidden'} absolute bottom-0 -left-4 size-4 [background:radial-gradient(circle_at_25%_25%,_#acb0be,_#acb0be_72%,_#dce0e8_5%,_#dce0e8_100%)] simple-color-trans dark:[background:radial-gradient(circle_at_25%_25%,_#11111b,_#11111b_72%,_#1e1e2e_5%,_#1e1e2e_100%)]`}
      />
      <span
        className={`${active ? 'block' : 'hidden'} absolute -right-4 bottom-0 size-4 [background:radial-gradient(circle_at_75%_25%,_#acb0be,_#acb0be_72%,_#dce0e8_5%,_#dce0e8_100%)] simple-color-trans dark:[background:radial-gradient(circle_at_75%_25%,_#11111b,_#11111b_72%,_#1e1e2e_5%,_#1e1e2e_100%)]`}
      />
    </>
  );
}
