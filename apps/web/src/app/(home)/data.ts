const summarySec = `
Aloha! My name is Lani Akita. I'm a Full Stack Developer, writer and ex-Biologist from Kailua, Hawaii. My specialty is in overcoming challenges, setbacks, and unsupported use cases. I'm also pretty passionate about modern web development.

Naturally, I'm obsessed with the never ending cascade of new shiny tools and technologies that enables us to redefine _what_ a website can be. Technologies that push beyond the limits of what ought to be possible to run from a web browser, like <a href="https://www.w3.org/TR/webgpu/" target="_blank" rel="nofollow noreferrer noopener">WebGPU</a> (a huge leap forward from WebGL), or <a href="https://webassembly.github.io/spec/core/intro/introduction.html" target="_blank" rel="nofollow noreferrer noopener">WebAssembly</a> (a technology that brings high-performance, low-level languages to the browser). 

_Hint: You can subscribe to my [blog](/blog)'s [web feed](/atom.xml) to follow along as I dive into my current technological obsession._`;

const profileObj =
  '```typescript\nconst laniAkitaSummary = {\n  id: 0o7734,\n  role: "Full Stack Developer",\n  main_programming_langs: ["TypeScript", "Rust", "Python"],\n  main_frameworks: ["Next.js", "SvelteKit"],\n  main_ui_libraries: ["React", "Svelte"],\n  main_frontend_tools: ["tailwindcss", "Three.js"],\n  main_backend_tools: ["Bun", "Node.js", "Drizzle ORM", "Postgres", "SQLite"],\n  professional_interests: ["Accessibility", "Scalability", "Reproducibility", "IaC", "WebAssembly", "WebGL", "WebGPU", "NixOS"],\n  main_devops_tools: ["SST", "Pulumi", "Podman", "Docker", "K8s"],\n  education: [{\n    degree: "BSc in Biological Sciences",\n    school: "University of California, Santa Barbara",\n    timeframe: { from: 2016, to: 2020 }\n  }]\n};\n```';

const projectSec = `
When I'm not working for someone else, I'm working for myself and the open-source community, sharpening my skillset on a healthy dose of ambitious side-projects. I love exploring the latest tools, learning their secrets, and discovering how (and where) these new technologies fit into my software engineering toolbelt.
`;

const workSec = `
I used to be a freelance WordPress developer, now I'm a freelance Full Stack Developer. Below are some of the sites I've created for my Clients, that utilize my Full Stack skillset.
`;

const servicesSec = `
I wield an expansive (and ever expanding) knowledge base and skillset, as I wear the _many_ hats required to work within the whole enchilada of modern Web Development. From Front-end to Back-end to even Systems Design, I can do it all. 

My specialty is in Front-end Development (I am an Artist, after all), however I'm no stranger to writing back-end applications and using cutting-edge systems programing languages like Rust to do it.
`;

const servicesTable = `
|   Service   |    Description    |
|-------------|-------------------|
|Developer Consulting| I offer my analytical-skills as a trained Biologist, and my years spent behind the command line and text-editor, to help your business grow.|
|Front-end Development| My Front-end skillset can be used to build elegant, accesible, responsive, user interfaces, immersive digital experiences powered by WebGL (and now WebGPU) via Three.js, brochure sites, and more.|
|Back-end Development| My back-end skills can be used to create APIs, internal web applications, content management systems, and anything else that CRUD's the rows and tables of a database (or several).|
|Full-Stack Development| For projects that require me to work on both ends of the stack (like creating a Next.js/SvelteKit based application), my entire breadth of knowledge is available as a single service.| 
|AI-generated Software Application Rescue (AGAR)| LLMs and AI assistants are tools, but when wielded improperly, can result in deeply flawed, highly fragile, software applications. I offer my sympathetic ear, along with my software engineering skillset, to help make things right when AI-generated applications go awry.|

`;

const blogSec = `
When I get the chance, I like to indulge in writing words, instead of code. Though, I'll admit most of my published endeavors into the _written word_ often contain quite a bit of \`code\` snippets anyways (it is a dev blog after all). You can find more articles like the below on my [blog](/blog).
`;

export const pageData = { summarySec, profileObj, projectSec, workSec, servicesSec, servicesTable, blogSec };
