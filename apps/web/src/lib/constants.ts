export const BASE_URL = 'http://localhost:3000';
export const APP_URL =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEPLOYED_URL
    ? process.env.NEXT_PUBLIC_DEPLOYED_URL
    : BASE_URL;
export const APP_NAME = 'Lani Akita | Full Stack Developer';
export const APP_DEFAULT_TITLE = 'Lani Akita | Full Stack Developer';
export const APP_TITLE_TEMPLATE = '%s - Lani Akita';
export const APP_DESCRIPTION = "I'm a Full Stack Developer with a passion for creating next generation web applications. With a focus in frontend development, and a formal background in Art & Graphic Design, I'm a specialist in leveraging TypeScript, Next.js, React, Tailwind CSS, and Three.js to create digital experiences as vividly immersive as they are responsive, and accessible. Additionally, my obsession with backend technologies and distributed systems and deployment strategies, allows me to create applications that are highly available, scaleable, cost efficient, and blazing fast, running at the edge.";
export const APP_THEME_COLOR = '#11111b';
export const BLOG_DESCR = 'A blog about life, Linux, and web development. Written by, Lani Akita.';
export const RESUME_LINK = '/lani-akita_resume-november-2024.pdf';
export const SHOWCASE_URL =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEPLOYED_URL
    ? 'https://showcase.laniakita.com'
    : 'http://localhost:3100';
