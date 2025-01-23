import { SocialNavIcon } from "@/components/social-icon";
import Link from "next/link";

export interface SimpleIcon extends SocialNavIcon {
  textSizeAlt: string;
}

export default function SimpleSocials({ arr }: { arr: SimpleIcon[] }) {
  return (
    <ul className="flex flex-row items-center justify-center gap-2">
      {arr.map((icon) => (
        <li key={crypto.randomUUID()}>
          <Link
            target='_blank'
            aria-label={`Follow Lani on ${icon.linkName}`}
            href={icon.url}
            className={`flex items-center justify-center text-ctp-subtext1/80 dark:hover:text-ctp-pink ${icon.iconName} ${icon.textSize}`}
          />
        </li>
      ))}
    </ul>
  );
}
