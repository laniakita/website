'use client';

import { useId } from 'react';
import Link from 'next/link';
import { type SocialIconNavProps } from '../social-icon';

export function SocialIconNav2({ boxItems }: SocialIconNavProps) {
  const uniqueKey = useId();

  return (
    <div className='grid grid-cols-3 gap-2'>
      {boxItems.map((item, idx) => (
        <Link
          key={`social-icon-two-${uniqueKey}-${Math.floor(Math.random() * 1000 + idx)}`}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
          href={item.url}
          className='color-trans-quick flex basis-full items-center justify-center rounded border border-ctp-surface0 p-2 text-ctp-text transition-none hover:bg-ctp-pink hover:text-ctp-base dark:border-ctp-base dark:hover:bg-ctp-sky'
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
          type={item.url === '/atom.xml' ? 'application/atom+xml' : undefined}
        >
          <p className={`${item.iconName} ${item.textSize}`} />
        </Link>
      ))}
    </div>
  );
}
