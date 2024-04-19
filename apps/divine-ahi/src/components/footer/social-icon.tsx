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
        <a key={boxItems.indexOf(item)} href={item.url} className={`${hxw} social-button`}>
          <span className={`${item.iconName} ${item.textSize}`} />
        </a>
      ))}
    </div>
  );
}
