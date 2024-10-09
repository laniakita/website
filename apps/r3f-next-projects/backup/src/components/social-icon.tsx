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
  const uKey = useId();
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {boxItems.map((item, idx) => (
        <Link
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
          key={`social-icon-one-${uKey}-${Math.floor(Math.random() * 1000 * idx)}`}
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
