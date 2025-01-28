'use client';

import Link from 'next/link';
import { type SocialIconNavProps } from '../social-icon';

export function SocialIconNav2({ boxItems }: SocialIconNavProps) {
  const uniqueKey = (idx: number) => {
    const num = Math.floor(Math.random() * 1000 + idx);

    return `social-icon-two-${crypto.randomUUID()}-${num}-${idx}`;
  };

  return (
    <div className='grid grid-cols-3 gap-2'>
      {boxItems.map((item, idx) => (
        <Link
          key={uniqueKey(idx)}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
          href={item.url}
          className='flex basis-full items-center justify-center rounded border border-ctp-surface0 p-2 text-ctp-text transition-none color-trans-quick hover:bg-ctp-pink hover:text-ctp-base dark:border-ctp-base'
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
