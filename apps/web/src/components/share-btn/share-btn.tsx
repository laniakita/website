'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MinPageData, shareToMastodon, shareUnderChar } from './utils';

export default function ShareButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareDivRef = useRef<HTMLDivElement>(null!);
  const shareListRef = useRef<HTMLUListElement>(null!);

  const linkGen = useCallback(() => {
    const baseUrl = 'https://laniakita.com';
    const linkstr = `${baseUrl}${pathname}`;
    return linkstr;
  }, [pathname]);


  const [minPageData, setMinPageData] = useState<MinPageData>();
  const shareBtnRef = useRef<HTMLDivElement>(null!);

  const handleShareOffClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if (shareBtnRef.current.contains(e.target as Node)) {
      // do nothing
    } else {
      setIsOpen(false);
      shareDivRef.current.style.height = '0px';
    }
  }, []);

  useEffect(() => {
    const titleQ = document.querySelector('h1');
    if (pathname.split('/').pop() === titleQ?.id) {
      setMinPageData({
        title: titleQ!.innerText,
        url: linkGen(),
      });
    }

    document.addEventListener('click', handleShareOffClick);
    return () => {
      document.removeEventListener('click', handleShareOffClick);
    };
  }, [handleShareOffClick, pathname, linkGen]);

  return (
    <div ref={shareBtnRef} className='relative flex flex-col items-center justify-center'>
      <span
        className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute -bottom-4 z-[1] size-0 border-[1rem] border-x-transparent border-b-ctp-surface0 border-t-transparent motion-safe:[transition:_opacity_0.3s]`}
      />
      <div
        ref={shareDivRef}
        className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none h-0 opacity-0'} absolute bottom-0 z-[2] min-w-fit translate-y-[104%] overflow-hidden whitespace-nowrap rounded-md border border-ctp-overlay0 bg-ctp-base/90 font-mono shadow-lg backdrop-blur-md motion-safe:[transition:_opacity_0.5s,_transform_0.5s,_height_0.5s] dark:bg-ctp-base/50 dark:shadow-ctp-pink/30`}
      >
        <ul ref={shareListRef} className='space-y-1.5 p-1.5 pb-2'>
          <li>
            <button
              onClick={() => {
                navigator.clipboard.writeText(linkGen());
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
            <button
              className='share-button hover:bg-[#ff6719]'
              onClick={(e) => shareToMastodon(e)}
              rel='noreferrer'
            >
              <span className='icon-[fa6-brands--mastodon] w-[2ch] text-xl' />
              <span>Mastodon</span>
            </button>
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
        </ul>
      </div>

      <button
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
        className='color-trans-quick z-10 flex flex-row items-center justify-center gap-2 rounded-full border border-ctp-mauve bg-ctp-mauve/10 px-8 py-2 font-mono font-black hover:border-ctp-flamingo hover:bg-ctp-pink hover:text-ctp-base'
      >
        <span className='icon-[ph--upload-bold] text-2xl' />
        <span>share</span>
      </button>
    </div>
  );
}
