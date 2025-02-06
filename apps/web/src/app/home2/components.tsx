import { SocialIconNavProps } from "@/components/social-icon";

export function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  return (
    <div className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 xl:flex xl:gap-2'>
      {boxItems.map((item) => (
        // eslint-disable-next-line react/jsx-no-target-blank -- noreferrer is used...
        <a
          key={crypto.randomUUID()}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : 'noreferrer'}
          href={item.url}
          className='items-center justify-center text-ctp-text color-trans-quick hover:text-ctp-pink md:text-ctp-subtext0'
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <span className={`${item.iconName} ${item.textSize} pointer-events-none`} />
        </a>
      ))}
    </div>
  );
}


