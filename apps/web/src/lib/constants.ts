export const BASE_URL = 'http://localhost:3000';
export const APP_URL = process.env.DEPLOYED_URL && process.env.NODE_ENV === 'production' ? process.env.DEPLOYED_URL : BASE_URL;
//export const APP_URL = 'https://laniakita.com';
export const APP_NAME = 'Lani Akita';
export const APP_DEFAULT_TITLE = 'Lani Akita';
export const APP_TITLE_TEMPLATE = '%s - Lani Akita';
export const APP_DESCRIPTION = "Lani Akita's personal website";
export const APP_THEME_COLOR = '#11111b';
export const BLOG_DESCR = 'A blog about life, Linux, and web development. Written by, Lani Akita.';
