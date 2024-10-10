export const BASE_URL = 'http://localhost:3100';
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
export const MAIN_SITE_URL =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEPLOYED_URL
    ? 'https://laniakita.com'
    : 'http://localhost:3000';
