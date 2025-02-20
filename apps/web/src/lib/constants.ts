export const BASE_URL = 'http://localhost:3000';
export const APP_URL =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEPLOYED_URL
    ? process.env.NEXT_PUBLIC_DEPLOYED_URL
    : BASE_URL;
export const APP_NAME = 'Lani Akita | Full Stack Developer';
export const APP_DEFAULT_TITLE = 'Lani Akita | Full Stack Developer';
export const APP_TITLE_TEMPLATE = '%s - Lani Akita';
export const APP_DESCRIPTION = `Aloha! My name is Lani Akita. I'm a Full Stack Developer from Honolulu, Hawai'i (see: résumé), and I'm pretty passionate about what I do, being dedicated to building (and writing about) stuff for the Internet.`;
export const APP_THEME_COLOR = '#11111b';
export const BLOG_DESCR = 'A blog about life, Linux, and web development. Written by, Lani Akita.';
export const RESUME_LINK = '/lani-akita_resume-feb-2025.pdf';
export const SHOWCASE_URL =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEPLOYED_URL
    ? 'https://showcase.laniakita.com'
    : 'http://localhost:3100';
// Spacing in rem. see: https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css
export const TW_SPACING = 0.25;
