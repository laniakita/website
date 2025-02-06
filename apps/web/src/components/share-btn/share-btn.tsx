'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MinPageData, shareUnderChar } from './utils';
import { DEFAULT_INSTANCE, MastodonBtn, MastodonPrompt } from './mastodon';
import { NAV_MAIN_ID, TOC_NAV_ID } from '../nav-constants';

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareDivRef = useRef<HTMLDivElement>(null!);
  const shareListRef = useRef<HTMLMenuElement>(null!);

  // mastodon sharebtn
  const [showMastodonForm, setShowMastodonForm] = useState(false);
  const [instanceInput, setInstanceInput] = useState(DEFAULT_INSTANCE);
  const mastodonPromptRef = useRef<HTMLDivElement>(null!);

  const [minPageData, setMinPageData] = useState<MinPageData>();
  const shareBtnRef = useRef<HTMLDivElement>(null!);

  const handleShareOffClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();

    const navbar = document.getElementById(NAV_MAIN_ID);
    const toc = document.getElementById(TOC_NAV_ID);

    if (shareBtnRef?.current?.contains(e.target as Node)) {
      // do nothing
    } else if (mastodonPromptRef?.current?.contains(e.target as Node)) {
      // do nothing
    } else if (navbar?.contains(e.target as Node)) {
      // do nothing
    } else if (toc?.contains(e.target as Node)) {
      // do nothing
    } else {
      setIsOpen(false);
      shareDivRef.current.style.height = '0px';
      setShowMastodonForm(false);
    }
  }, []);

  // init instance val
  useEffect(() => {
    const cachedInstance = localStorage.getItem('mastodon-instance');
    if (cachedInstance && cachedInstance.length > 0) {
      setInstanceInput(cachedInstance);
    }
  }, []);

  useEffect(() => {
    setMinPageData({
      title: document.title,
      url: location.href,
    });

    document.addEventListener('click', handleShareOffClick);
    return () => {
      document.removeEventListener('click', handleShareOffClick);
    };
  }, [handleShareOffClick]);

  return (
    <>
      {showMastodonForm && (
        <MastodonPrompt
          setShowMastodonForm={setShowMastodonForm}
          instanceInput={instanceInput}
          setInstanceInput={setInstanceInput}
          promptRef={mastodonPromptRef}
        />
      )}
      <div ref={shareBtnRef} className='relative flex flex-col items-center justify-center'>
        <span
          className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute -bottom-4 z-[1] size-0 border-[1rem] border-x-transparent border-t-transparent border-b-ctp-surface0 motion-safe:[transition:_opacity_0.3s]`}
        />
        <div
          ref={shareDivRef}
          className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none h-0 opacity-0'} absolute bottom-0 z-[2] min-w-fit translate-y-[104%] overflow-hidden rounded-md border border-ctp-overlay0 bg-ctp-base/90 font-mono whitespace-nowrap shadow-lg backdrop-blur-md motion-safe:[transition:_opacity_0.5s,_transform_0.5s,_height_0.5s] dark:bg-ctp-base/50 dark:shadow-ctp-pink/30`}
        >
          <menu
            id='social-media-share-menu'
            aria-expanded={isOpen}
            ref={shareListRef}
            className='space-y-1.5 p-1.5 pb-2'
          >
            <li>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(location.href);
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                }}
                type='button'
                className='share-button hover:bg-ctp-pink hover:text-ctp-base'
              >
                <span className='icon-[ph--link] w-[2ch] text-xl' />
                <span>{isCopied ? 'copied!' : 'copy link'}</span>
              </button>
            </li>
            <li>
              <a
                className='share-button hover:bg-[#1185FE]'
                href={`https://bsky.app/intent/compose?text=${shareUnderChar(minPageData, true)}`}
                target='_blank'
                rel='noreferrer'
              >
                <span className='icon-[fa6-brands--bluesky] w-[2ch] text-xl' />
                <span>Bluesky</span>
              </a>
            </li>
            <li>
              <MastodonBtn setShowMastodonForm={setShowMastodonForm} />
            </li>
            <li>
              <a
                className='share-button hover:bg-[#0a66c2]'
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(minPageData?.url ?? '')}`}
                target='_blank'
                rel='noreferrer'
              >
                <span className='icon-[fa6-brands--linkedin] w-[2ch] text-xl' />
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                className='share-button hover:bg-[#ff6719]'
                href={`https://substack.com/notes?action=compose&message=${encodeURIComponent(minPageData?.title ?? '')} ${encodeURIComponent(minPageData?.url ?? '')}`}
                target='_blank'
                rel='noreferrer'
              >
                <span className='icon-[simple-icons--substack] w-[2ch] text-xl' />
                <span>Substack</span>
              </a>
            </li>
          </menu>
        </div>

        <button
          aria-expanded={!isOpen}
          aria-controls='social-media-share-menu'
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              shareDivRef.current.style.height = shareListRef.current.offsetHeight + 'px';
            } else {
              setIsOpen(false);
              shareDivRef.current.style.height = '0px';
            }
          }}
          type='button'
          className='z-10 flex flex-row items-center justify-center gap-2 rounded-full border border-ctp-mauve bg-ctp-mauve/10 px-8 py-2 font-mono font-black color-trans-quick hover:border-ctp-flamingo hover:bg-ctp-pink hover:text-ctp-base'
        >
          <span className='icon-[ph--upload-bold] text-2xl' />
          <span>share</span>
        </button>
      </div>
    </>
  );
}
