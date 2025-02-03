import type { Metadata } from 'next';
import NoiseShader01 from '@/app/projects/(three)/shaders/noise/01/noise';
import Navbar from '@/components/navbar/variants/v2/core';
import Footer from '@/components/footer/footer';
import { resMdxMinimal } from '@/lib/mdx-utils';
import { getMDXComponent } from '@/components/mdx/mdx-bundler-components';
import { MiniMDXComponent } from '@/components/mdx/global-mdx-components';
import { SocialIconNavProps } from '@/components/social-icon';
import { socialItemsV } from '@/lib/socials-data';
import MiniPostRoller from './rollers/mini-postroller';
import MiniProjectsRoller from './rollers/mini-projects-roller';
import { MiniWorkRoller } from './rollers/mini-server-roller';

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/home`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1600,
        height: 900,
        url: `/opengraph/home?twitter=true`,
      },
    ],
  },
};


function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  return (
    <div className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 xl:flex xl:gap-2'>
      {boxItems.map((item) => (
        // eslint-disable-next-line react/jsx-no-target-blank -- noreferrer is used...
        <a
          key={crypto.randomUUID()}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : 'noreferrer'}
          href={item.url}
          className='items-center justify-center text-ctp-text color-trans-quick hover:text-ctp-pink md:text-ctp-subtext0'
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <span className={`${item.iconName} ${item.textSize} pointer-events-none`} />
        </a>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <div className='relative -mt-16 flex h-[80dvh] w-full items-end justify-start overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <NoiseShader01 />
      </div>
      <div className='relative w-full inset-x-0 z-10 flex animate-fade-in border-t border-ctp-base bg-ctp-base/80 opacity-0 backdrop-blur-xl color-trans-quick dark:border-ctp-text dark:bg-ctp-base/50 px-6'>
        <div className='@container/main w-full flex flex-row max-w-5xl m-auto gap-x-10 py-10'>

          <div className=''>
            <h1 className='uppercase font-black text-5xl text-ctp-text'>
              Lani Akita
            </h1>
            <h2 className='text-2xl uppercase font-medium'>Full Stack Developer</h2>
          </div>

          <div className='h-auto min-h-full overflow-visible bg-ctp-text w-0.5' />


          <div className='my-auto hidden md:flex md:flex-col xl:flex-row xl:gap-2'>
            <SocialIconNav3 boxItems={socialItemsV.slice(0, 3)} />
            <SocialIconNav3 boxItems={socialItemsV.slice(3, 6)} />
          </div>

        </div>
      </div>
    </div>
  );
}

function MDXComponent({ code }: { code: string }) {
  const MDXContent = getMDXComponent(code, {});
  return <MDXContent code={code} />;
}

async function Summary() {
  const summaryMd = `
  ## Hello, I'm Lani

  Hi! My name is Lani Akita, and I'm a Full Stack Developer from Honolulu, Hawai'i. I'm someone whose dedicated herself to building (and [writing about](/blog)) stuff for the Internet. 
  
  In practice, that means I'm sometimes creating, deploying, and or maintaining websites for Clients. Other times, I'm creating, publishing, and or maintaining open-source libraries/software for myself and others to use. Either way, I typically work (& think) across the entire stack to accomplish such things.

  As well, I'm someone whose deeply passionate about the future of the Web. I'm obsessed with bleeding-edge tools and technologies that enables web developers like me to redefine _what_ a website can be. Technologies that push beyond the limits of what ought to be possible to run from a web browser, such as <a href="https://www.w3.org/TR/webgpu/" target="_blank" rel="noopener">WebGPU</a>, and <a href="https://webassembly.github.io/spec/core/intro/introduction.html" target="_blank" rel="noopener">WebAssembly</a>.
  `;

  const profileObj =
    '```typescript\nconst laniAkitaSummary = {\n  id: 0o7734,\n  role: "Full Stack Developer",\n  main_programming_langs: ["TypeScript", "Rust", "Python"],\n  main_frameworks: ["Next.js", "SvelteKit"],\n  main_ui_libraries: ["React", "Svelte"],\n  main_frontend_tools: ["tailwindcss", "Three.js"],\n  main_backend_tools: ["Bun", "Node.js", "Drizzle ORM", "Postgres", "SQLite"],\n  professional_interests: ["Accessibility", "Scalability", "Reproducibility", "IaC", "WebAssembly", "WebGL", "WebGPU", "NixOS"],\n  main_devops_tools: ["SST", "Pulumi", "Podman", "Docker", "K8s"],\n  education: [{\n    degree: "BSc in Biological Sciences",\n    school: "University of California, Santa Barbara",\n    timeframe: { from: 2016, to: 2020 }\n  }]\n};\n```';

  const summaryRes = await resMdxMinimal(summaryMd);
  const profileRes = await resMdxMinimal(profileObj);

  return (
    <section className='w-full px-6'>
      <div className='mx-auto md:flex md:max-w-5xl md:flex-row md:items-center md:justify-center md:gap-10'>
        <div className='prose-protocol-omega mx-auto md:w-1/2'>
          <MDXComponent code={summaryRes.code} />
        </div>
        <div className='prose-protocol-omega mx-auto md:w-1/2'>
          <figure>
            <MDXComponent code={profileRes.code} />
            <figcaption>
              <strong>Fig. 01</strong>: Myself summarized as a JS object. The <em>snake_case</em> implies compatibility
              with a database, perhaps suggesting this object might be inserted into some database&apos;s table.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

async function LatestPostsSection() {
  const blogSec = `
  ## Latest From the Blog
  
  When I get the chance, I like to indulge in writing words, instead of code. Though, I'll admit most of my published endeavors into the _written word_ often contain quite a bit of \`code\` snippets anyways (it is a dev blog after all). You can find more articles like the below on my [blog](/blog).
  `;

  const blogRes = await resMdxMinimal(blogSec);

  return (
    <section className='flex flex-col'>
      <div className='px-6 shadow-xl'>
        <div className='mx-auto w-full max-w-5xl pb-6'>
          <div className='prose-protocol-omega -mt-6 w-1/2'>
            <MiniMDXComponent code={blogRes.code} />
          </div>
        </div>
      </div>
      <div className='flex w-full flex-row gap-6 overflow-x-auto bg-ctp-crust/70 px-6 py-10'>
        <MiniPostRoller />
      </div>
    </section>
  );
}

async function ProjectsSection() {
  const blogSec = `
  ## Projects
  
  When I get the chance, I like to indulge in writing words, instead of code. Though, I'll admit most of my published endeavors into the _written word_ often contain quite a bit of \`code\` snippets anyways (it is a dev blog after all). You can find more articles like the below on my [blog](/blog).
  `;

  const blogRes = await resMdxMinimal(blogSec);

  return (
    <section className='flex flex-col'>
      <div className='px-6'>
        <div className='mx-auto w-full max-w-5xl pb-6'>
          <div className='prose-protocol-omega -mt-6 w-1/2'>
            <MiniMDXComponent code={blogRes.code} />
          </div>
        </div>
      </div>
      <div className='flex w-full flex-row gap-6 overflow-x-auto bg-ctp-crust/70 px-6 py-10'>
        <MiniProjectsRoller />
      </div>
    </section>
  );
}

async function ClientWorksSection() {
  const blogSec = `
  ## Client Works
  
  When I get the chance, I like to indulge in writing words, instead of code. Though, I'll admit most of my published endeavors into the _written word_ often contain quite a bit of \`code\` snippets anyways (it is a dev blog after all). You can find more articles like the below on my [blog](/blog).
  `;

  const blogRes = await resMdxMinimal(blogSec);

  return (
    <section className='flex flex-col'>
      <div className='px-6'>
        <div className='mx-auto w-full max-w-5xl pb-6'>
          <div className='prose-protocol-omega -mt-6 w-1/2'>
            <MiniMDXComponent code={blogRes.code} />
          </div>
        </div>
      </div>
      <div className='mx-auto max-w-5xl'>
        <div className='flex w-full flex-row gap-6'>
          <MiniWorkRoller />
        </div>
      </div>
    </section>
  );
}

export default function HomeV2() {
  return (
    <>
      <Navbar />
      <Hero />
      <main className='m-auto overflow-hidden'>
        <article>
          <Summary />
          <ProjectsSection />
          <ClientWorksSection />
          <LatestPostsSection />
        </article>
      </main>
      <Footer />
    </>
  );
}

