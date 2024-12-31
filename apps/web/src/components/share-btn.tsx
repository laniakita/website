'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ShareButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const linkGen = () => {
    const baseUrl = 'https://laniakita.com';
    const linkstr = `${baseUrl}${pathname}`;
    return linkstr;
  };

  const shareBtnRef = useRef<HTMLDivElement>(null!);

  const handleShareOffClick = useCallback((e: MouseEvent) => {
    if (shareBtnRef.current.contains(e.target as Node)) {
      // do nothing
    } else {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleShareOffClick);
    return () => {
      document.removeEventListener('click', handleShareOffClick);
    };
  }, [handleShareOffClick]);

  return (
    <div ref={shareBtnRef} className='relative flex flex-col items-center justify-center'>
      <span
        className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute -bottom-4 z-[1] size-0 border-[1rem] border-x-transparent border-b-ctp-surface0 border-t-transparent`}
      />
      <div
        className={`${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute -bottom-16 z-[2] min-w-fit whitespace-nowrap rounded-md border border-ctp-surface0 bg-ctp-base p-1 font-mono shadow-lg dark:shadow-ctp-pink/30`}
      >
        <ul>
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
              className='color-trans-quick flex flex-row items-center gap-2 rounded border border-ctp-surface0 px-4 py-2 hover:bg-ctp-pink hover:text-ctp-base'
            >
              <span className='icon-[ph--link] text-xl' />
              <span>{isCopied ? 'copied!' : 'copy link'}</span>
            </button>
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          !isOpen ? setIsOpen(true) : setIsOpen(false);
        }}
        type='button'
        className='color-trans-quick flex flex-row items-center justify-center gap-2 rounded-full border border-ctp-mauve bg-ctp-mauve/10 px-8 py-2 font-mono font-black hover:border-ctp-flamingo hover:bg-ctp-pink hover:text-ctp-base'
      >
        <span className='icon-[ph--upload-bold] text-2xl' />
        <span>share</span>
      </button>
    </div>
  );
}
