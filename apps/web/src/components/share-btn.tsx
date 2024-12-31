'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { escape } from 'lodash';

export default function ShareButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const linkGen = useCallback(() => {
    const baseUrl = 'https://laniakita.com';
    const linkstr = `${baseUrl}${pathname}`;
    return linkstr;
  }, []);
  interface MinPageData {
    title: string;
    url: string;
  }
  const [minPageData, setMinPageData] = useState<MinPageData>();
  const shareBtnRef = useRef<HTMLDivElement>(null!);

  const handleShareOffClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if (shareBtnRef.current.contains(e.target as Node)) {
      // do nothing
    } else {
      setIsOpen(false);
    }
  }, []);

  const shareUnderChar = (minPageData: MinPageData | undefined, isBsky?: boolean, debug?: boolean) => {
    if (!minPageData) return;
    // bsky truncates URLs to 46 chars? (https://www.reddit.com/r/BlueskySocial/comments/1he9ljo/comment/m250brt/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
    // twitter truncates to 23 chars (https://developer.x.com/en/docs/counting-characters);
    // mastodon truncates to 23 chars too (https://docs.joinmastodon.org/api/guidelines/#links)
    const urlLen = isBsky ? 46 : 23;
    const titleLen = minPageData?.title.length;

    // the "+1" is the space between the title and url

    if (urlLen + titleLen + 1 > 300 || debug) {
      // concat title to fit url (-3 is to account for the "...")
      // todo verify math
      const titleSlice = minPageData?.title.slice(0, titleLen - urlLen - 3).split('');
      titleSlice?.push('...');
      const titleTrunc = titleSlice.join('');
      //console.log(titleTrunc)
      return escape(`${titleTrunc} ${minPageData?.url}`);
    }
    return `${encodeURIComponent(minPageData?.title)} ${encodeURIComponent(minPageData?.url)}`;
  };

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
        className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute -bottom-4 z-[1] size-0 border-[1rem] border-x-transparent border-b-ctp-surface0 border-t-transparent [transition:_opacity_0.3s]`}
      />
      <div
        className={`${isOpen ? 'pointer-events-auto translate-y-[108%] opacity-100' : 'pointer-events-none opacity-0 [transform:_translateY(70%)]'} absolute bottom-0 z-[2] min-w-fit whitespace-nowrap rounded-md border border-ctp-surface0 bg-ctp-base p-1 font-mono shadow-lg [transition:_opacity_0.3s,_transform_0.8s] dark:shadow-ctp-pink/30`}
      >
        <ul className='space-y-2'>
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
              className='color-trans-quick flex flex-row items-center gap-[1ch] rounded border border-ctp-surface0 px-4 py-2 hover:bg-ctp-pink hover:text-ctp-base'
            >
              <span className='icon-[ph--link] w-[2ch] text-xl' />
              <span>{isCopied ? 'copied!' : 'copy link'}</span>
            </button>
          </li>
          <li>
            <a
              className='color-trans-quick flex w-full flex-row items-center gap-[1ch] rounded border border-ctp-surface0 px-4 py-2 text-ctp-text hover:bg-[#1185FE] hover:text-ctp-base'
              href={`https://bsky.app/intent/compose?text=${shareUnderChar(minPageData, true)}`}
              target='_blank'
              rel='noreferrer'
            >
              <span className='icon-[fa6-brands--bluesky] w-[2ch] text-xl' />
              <span>Bluesky</span>
            </a>
          </li>
          <li>
            <a
              className='color-trans-quick flex w-full flex-row items-center gap-[1ch] rounded border border-ctp-surface0 px-4 py-2 text-ctp-text hover:bg-black hover:text-ctp-base dark:hover:text-ctp-text'
              href={`https://x.com/intent/tweet?text=${shareUnderChar(minPageData, false)}`}
              target='_blank'
              rel='noreferrer'
            >
              <span className='icon-[fa6-brands--x-twitter] w-[2ch] text-xl' />
              <span>X/Twitter</span>
            </a>
          </li>
          <li>
            <a
              className='color-trans-quick flex w-full flex-row items-center gap-[1ch] rounded border border-ctp-surface0 px-4 py-2 text-ctp-text hover:bg-black hover:text-ctp-base dark:hover:text-ctp-text'
              href={`https://www.threads.net/intent/post?text=${shareUnderChar(minPageData, false)}`}
              target='_blank'
              rel='noreferrer'
            >
              <span className='icon-[fa6-brands--threads] w-[2ch] text-xl' />
              <span>Threads</span>
            </a>
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
          } else setIsOpen(false);
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
