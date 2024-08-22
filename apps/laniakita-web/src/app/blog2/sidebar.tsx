import { SocialIconNav2 } from '@/components/social-icon';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';

const blogInfo = `A blog about life, Linux, and web development. Written by, [Lani Akita](/about).`;

const socialItems = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-4xl',
  },
  {
    title: 'Linkedin',
    url: 'https://linkedin.com',
    iconName: 'icon-[fa6-brands--linkedin-in]',
    linkName: 'Linkedin!',
    textSize: 'text-4xl',
  },
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-4xl',
  },
  {
    title: 'Instagram',
    url: 'https://instagram.com',
    iconName: 'icon-[fa6-brands--instagram]',
    linkName: 'Instagram!',
    textSize: 'text-4xl'
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-3xl',
  },
  {
    title: 'RSS/Atom',
    url: '/feed.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'your RSS/Atom feed reader!',
    textSize: 'text-4xl',
  },
];

export default function Sidebar() {
  return (
    <>
      {/* wrapper */}
      <div className=''>
        <div className='sidebar-box flex flex-col gap-6 lg:gap-10'>
          <div className='prose-protocol-omega font-mono prose-p:my-0'>
            <Markdown options={{ forceBlock: true }}>{blogInfo}</Markdown>
          </div>
          <div className=''>
            <SocialIconNav2 boxItems={socialItems} />
          </div>
        </div>
      </div>
    </>
  );
}
