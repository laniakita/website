import type { SocialIconNavProps } from '@/components/social-icon';

export default function HeroSocials({ boxItems }: SocialIconNavProps) {
  return boxItems.map((item) => (
    <li key={crypto.randomUUID()}>
      {/* eslint-disable react/jsx-no-target-blank -- rel is defined... */}
      <a
        href={item.url}
        className='items-center justify-center text-ctp-text color-trans-quick hover:text-ctp-pink md:text-ctp-subtext0'
        target='_blank'
        rel={item.title.toLowerCase() === 'mastodon' ? 'me' : 'noreferrer'}
        aria-label={`Follow Lani on ${item.linkName}`}
      >
        <span className={`${item.iconName} ${item.textSize} pointer-events-none`} />
      </a>
    </li>
  ));
}
