export const BASE_URL = 'http://localhost:3000';
export const APP_URL =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEPLOYED_URL
    ? process.env.NEXT_PUBLIC_DEPLOYED_URL
    : BASE_URL;
export const APP_NAME = 'Lani Akita';
export const APP_DEFAULT_TITLE = 'Lani Akita';
export const APP_TITLE_TEMPLATE = '%s - Lani Akita';
export const APP_DESCRIPTION = "Lani Akita's personal website";
export const APP_THEME_COLOR = '#11111b';
export const BLOG_DESCR = 'A blog about life, Linux, and web development. Written by, Lani Akita.';
export const RESUME_LINK = '/lani-akita_resume-october-2024.pdf';
export const socialItems3 = [
  {
    title: 'X/Twitter',
    url: 'https://x.com/laniakita',
    iconName: 'icon-[fa6-brands--x-twitter]',
    linkName: 'X/Twitter!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl',
  },
];

export const socialItems2 = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'X/Twitter',
    url: 'https://x.com/laniakita',
    iconName: 'icon-[fa6-brands--x-twitter]',
    linkName: 'X/Twitter!',
    textSize: 'text-3xl md:text-4xl',
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
    url: 'https://instagram.com/laniakita',
    iconName: 'icon-[fa6-brands--instagram]',
    linkName: 'Instagram!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Linkedin',
    url: 'https://linkedin.com/in/laniakita',
    iconName: 'icon-[fa6-brands--linkedin]',
    linkName: 'Linkedin!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-2xl md:text-3xl',
  },

];

