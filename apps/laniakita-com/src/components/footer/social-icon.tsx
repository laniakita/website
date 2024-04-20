import Link from 'next/link'

interface SocialIconNavProps {
  boxItems: SocialNavIcon[];
  hxw?: string;
}

interface SocialNavIcon {
  title: string;
  url: string;
  iconName: string;
  textSize: string;
}

export default function SocialIconNav({ boxItems, hxw }: SocialIconNavProps) {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {boxItems.map((item) => (
        <Link key={boxItems.indexOf(item)} href={item.url} className={`${hxw} social-button`} target='_blank'>
          <span className={`${item.iconName} ${item.textSize}`} />
        </Link>
      ))}
    </div>
  );
}
