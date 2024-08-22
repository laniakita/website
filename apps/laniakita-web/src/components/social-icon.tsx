import Link from 'next/link';
import { useId } from 'react';

export interface SocialIconNavProps {
  boxItems: SocialNavIcon[];
  hxw?: string;
}

export interface SocialNavIcon {
  title: string;
  url: string;
  iconName: string;
  textSize: string;
  linkName: string;
}

export default function SocialIconNav({ boxItems, hxw }: SocialIconNavProps) {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {boxItems.map((item) => (
        <Link
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
          key={boxItems.indexOf(item)}
          href={item.url}
          className={`${hxw} social-button`}
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <span className={`${item.iconName} ${item.textSize}`} />
        </Link>
      ))}
    </div>
  );
}


