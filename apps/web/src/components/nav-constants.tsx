export const THEME_SWITCH_REGEX = /darkmode-button/
export const NAV_MAIN_MOBILE_CONTAINER_ID = "nav-main-mobile-container"
export const NAV_MAIN_MOBILE_MENU_IO_ID = "nav-main-mobile-menu-button"

const MAIN_PAGES_ARR = new Map([
  ['home', '/'],
  ['blog', '/blog'],
  ['about', '/about'],
  ['work', '/work'],
  ['projects', '/projects'],
  ['Atom/RSS', '/feed.xml'],
  ['résumé', '/resume'],
  ['contact', '/contact'],
]);

export const MAIN_PAGES = Object.fromEntries(MAIN_PAGES_ARR);

export const SOCIALS_NAVBAR = [
  /*
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-4xl',
    textSizeAlt: 'text-3xl',
  },
  */
  {
    title: 'Bluesky',
    url: 'https://bsky.app/profile/laniakita.com',
    iconName: 'icon-[fa6-brands--bluesky]',
    linkName: 'Bluesky!',
    textSize: 'text-2xl',
    textSizeAlt: 'text-2xl',
  },
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl',
    textSizeAlt: 'text-3xl',
  },
];

export const SOCIALS_FULL = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl min-h-[2rem] min-w-[2rem]',
  },
  {
    title: 'Bluesky',
    url: 'https://bsky.app/profile/laniakita.com',
    iconName: 'icon-[fa6-brands--bluesky]',
    linkName: 'Bluesky!',
    textSize: 'text-2xl md:text-3xl min-h-[2rem] min-w-[2rem]',
  },
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-3xl md:text-4xl min-h-[2rem] min-w-[2rem]',
  },
  {
    title: 'Linkedin',
    url: 'https://linkedin.com/in/laniakita',
    iconName: 'icon-[fa6-brands--linkedin]',
    linkName: 'Linkedin!',
    textSize: 'text-3xl md:text-4xl min-h-[2rem] min-w-[2rem]',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-2xl md:text-3xl min-h-[2rem] min-w-[2rem]',
  },
  {
    title: 'Atom/RSS',
    url: '/atom.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'you feed reader!',
    textSize: 'text-2xl md:text-3xl min-h-[2rem] min-w-[2rem]',
  },
];
