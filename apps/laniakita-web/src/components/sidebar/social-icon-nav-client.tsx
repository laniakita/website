'use client'

import { useId } from "react";
import { SocialIconNavProps } from "../social-icon";
import Link from "next/link";


export function SocialIconNav2({ boxItems }: SocialIconNavProps) {
  const uniqueKey = useId();

  return (
    <div className='grid grid-cols-3 gap-2'>
      {boxItems.map((item, idx) => (
        <Link
          key={`social-icon-two-${uniqueKey}-${Math.floor(Math.random() * 1000 + idx)}`}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
          href={item.url}
          className={`flex basis-full items-center justify-center rounded border border-ctp-surface0 dark:border-ctp-base p-2 text-ctp-text hover:text-ctp-base hover:bg-ctp-mauve color-trans-2`}
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <p className={`${item.iconName} ${item.textSize}`} />
        </Link>
      ))}
    </div>
  );
}
