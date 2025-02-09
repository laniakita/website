const summarySec = `
Hi! My name is Lani Akita, and I'm a Full Stack Developer from Honolulu, Hawai'i. I'm also pretty passionate about the Web, as a person who enjoys building (and [writing about](/blog)) stuff for the Internet. You can see my <a href="/resume" target="_blank" rel="noreferrer">résumé</a> to learn more.  

Naturally, I'm obsessed with bleeding-edge tools and technologies that enables us to redefine _what_ a website can be. Technologies that push beyond the limits of what ought to be possible to run from a web browser, like <a href="https://www.w3.org/TR/webgpu/" target="_blank" rel="nofollow noreferrer noopener">WebGPU</a>, or <a href="https://webassembly.github.io/spec/core/intro/introduction.html" target="_blank" rel="nofollow noreferrer noopener">WebAssembly</a>
`;

// In practice, that means I'm sometimes creating, deploying, and or maintaining websites for Clients. Other times, I'm creating, publishing, and or maintaining open-source libraries/software for myself and others to use. Either way, I typically work (& think) across the entire stack to accomplish such things.

const profileObj =
  '```typescript\nconst laniAkitaSummary = {\n  id: 0o7734,\n  role: "Full Stack Developer",\n  main_programming_langs: ["TypeScript", "Rust", "Python"],\n  main_frameworks: ["Next.js", "SvelteKit"],\n  main_ui_libraries: ["React", "Svelte"],\n  main_frontend_tools: ["tailwindcss", "Three.js"],\n  main_backend_tools: ["Bun", "Node.js", "Drizzle ORM", "Postgres", "SQLite"],\n  professional_interests: ["Accessibility", "Scalability", "Reproducibility", "IaC", "WebAssembly", "WebGL", "WebGPU", "NixOS"],\n  main_devops_tools: ["SST", "Pulumi", "Podman", "Docker", "K8s"],\n  education: [{\n    degree: "BSc in Biological Sciences",\n    school: "University of California, Santa Barbara",\n    timeframe: { from: 2016, to: 2020 }\n  }]\n};\n```';

const projectSec = `
When I'm not working for someone else, I'm working for myself and the open-source community, sharpening my skillset on a healthy dose of ambitious side-projects. I love exploring the latest tools, learning their secrets, and discovering how (and where) these new technologies fit into my software engineering toolbelt.
`;

const workSec = `
I used to be a freelance WordPress developer, now I'm a freelance Full Stack Developer. Below are some of the sites I've created for my Clients, that utilize my Full Stack skillset.
`;

const blogSec = `
When I get the chance, I like to indulge in writing words, instead of code. Though, I'll admit most of my published endeavors into the _written word_ often contain quite a bit of \`code\` snippets anyways (it is a dev blog after all). You can find more articles like the below on my [blog](/blog).
`;

export const pageData = { summarySec, profileObj, projectSec, workSec, blogSec };
