import Link from 'next/link';

interface SocialIconNavProps {
  boxItems: SocialNavIcon[];
  hxw?: string;
}

interface SocialNavIcon {
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

export function SocialIconNav2({ boxItems }: SocialIconNavProps) {
  return (
    <div className='flex flex-row md:grid md:grid-cols-3 gap-2'>
      {boxItems.map((item, idx) => (
        <Link
          key={idx}
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
