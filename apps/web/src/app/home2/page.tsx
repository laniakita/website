import type { Metadata } from 'next';
import NoiseShader01 from '@/app/projects/(three)/shaders/noise/01/noise';
import Navbar from '@/components/navbar/variants/v2/core';
import Footer from '@/components/footer/footer';
import { resMdxMinimal } from '@/lib/mdx-utils';
import { getMDXComponent } from '@/components/mdx/mdx-bundler-components';
import { allPosts } from 'contentlayer/generated';
import PostPreviewV4 from '../(content)/blog/post-components';
import MiniPostRoller from './mini-postroller';
import { MiniMDXComponent } from '@/components/mdx/global-mdx-components';
import { MiniWorkRoller } from './mini-server-roller';

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

function Hero() {
  return (
    <div className='relative -mt-16 flex h-[40rem] w-full items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <NoiseShader01 />
      </div>
      <div className='p-2'>
        <div className='z-10 flex max-w-[25rem] animate-fade-in flex-col rounded-lg border border-ctp-base bg-ctp-base/80 p-10 opacity-0 backdrop-blur-xl color-trans-quick dark:border-ctp-text dark:bg-ctp-base/50'>
          <h1 className='font-mono text-3xl text-ctp-text md:text-4xl'>
            {`<`}
            <strong className='font-black text-ctp-sky dark:text-ctp-blue'>LaniAkita</strong>
            {` />`}
          </h1>
          <span className='my-6 h-[2px] w-full rounded bg-ctp-text dark:bg-ctp-text' />
          <h2 className='mb-2 text-2xl font-bold md:text-3xl'>Full Stack Developer</h2>
          <h3 className='font-mono font-semibold text-pretty text-ctp-green md:text-lg'>
            <em>&quot;Specialist in Bleeding-edge Web Technologies&quot;</em>
          </h3>
        </div>
      </div>
    </div>
  );
}

// because I've been _building, breaking, learning, fixing, deploying, optimizing, refactoring, testing, integrating, re-deploying,_ web applications since I was about 12, I've become quite familar with the entire _stack_. Back-end, Front-end, Infra, you name it, I've probably thought a lot about it.
// From architecting the backend infra, to creating Back-end APIs designed to deploy at the Edge, to using frontend libraries like React (or Svelte) to deliver polished, _stateful_, blazing fast frontends for a full-stack Next.js (or SvelteKit) application, to deploying on said infra, I'm there.`;
//which makes an upcoming graphics engine like <a href="https://discourse.threejs.org/t/shade-webgpu-graphics/66969" target="_blank" rel="noopener">Shade</a> even possible, bringing the graphical fidelity of Unreal to the browser.
//The latter is a sucessor to <a href="https://registry.khronos.org/webgl/specs/latest/2.0/" target="_blank" rel="noopener">WebGL</a>, having been designed from the ground up to expose the full capabilities of available physical GPU hardware (see: <a href="" target="_blank" rel="noopener">W3C's draft on WebGPU</a>) from the get-go.
//If you're someone looking to build a high-performance, next-generation web application, I'd love to talk. Consider sending an email to: me@laniakita.com, or messaging me on Bluesky: [@laniakita.com](https://bsky.app/profile/laniakita.com).

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
    '```typescript\nconst laniAkitaSummary = {\n  id: 0o7734,\n  role: "Full Stack Developer",\n  main_programming_langs: ["TypeScript", "Rust", "Python"],\n  main_frameworks: ["Next.js", "SvelteKit"],\n  main_ui_libraries: ["React", "Svelte"],\n  main_frontend_tools: ["tailwindcss", "Three.js"],\n  main_backend_tools: ["Bun", "Node.js", "Drizzle ORM", "Postgres", "SQLite"],\n  professional_interests: ["Accessibility", "Scalability", "Reproducibility", "IaC", "WebAssembly", "WebGL", "WebGPU", "NixOS"],\n  main_devops_tools: ["SST", "Pulumi", "Podman", "Docker", "K8s"],\n  hobbies: ["Reading", "Writing", "Philosophizing", "Painting", "Drawing", "Gaming", "Gardening"],\n  education: [{\n    degree: "BSc in Biological Sciences",\n    school: "University of California, Santa Barbara",\n    timeframe: { from: 2016, to: 2020 }\n  }]\n};\n```';

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
          <ClientWorksSection />
          <LatestPostsSection />
        </article>
      </main>
      <Footer />
    </>
  );
}

/*            <p className='landing-hero-prop'>role: <strong className='landing-hero-string'>&quot;Full Stack Developer&quot;<span className='landing-hero-prop'>,</span></strong></p>

            <p className='landing-hero-prop'>specialty: <strong className='landing-hero-string'>&quot;Bleeding-edge Web Technologies&quot;</strong></p>
  *
  *            <p className='landing-hero-prop'>main_langs: <PsuedoArrayMarkup {...{ arr: main_langs, horizontal: true }} /> </p>
            <p className='landing-hero-prop'>main_toolset: <PsuedoArrayMarkup {...{ arr: main_toolset, horizontal: true}} /></p>
            <p className='landing-hero-prop'>interests: <PsuedoArrayMarkup {...{ arr: interests }} /></p>
  *
  *function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  return (
    <div className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 xl:flex xl:gap-2'>
      {boxItems.map((item) => (
        <Link
          key={crypto.randomUUID()}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
          href={item.url}
          className='color-trans-quick items-center justify-center text-ctp-text hover:text-ctp-pink md:text-ctp-subtext0'
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <span className={`${item.iconName} ${item.textSize}`} />
        </Link>
      ))}
    </div>
  );
}

<div className='z-10 flex size-full flex-col items-center justify-end'>
          <div className='simple-color-trans flex w-full flex-col items-center justify-center gap-6 border-t border-ctp-surface0 bg-ctp-base/80 p-10 backdrop-blur-md md:items-start dark:bg-ctp-midnight/80'>
            <div className='simple-color-trans flex flex-col items-center justify-center whitespace-nowrap rounded-md md:w-fit md:justify-start'>
              <div className='w-fit'>
                <h1 className='text-4xl font-black uppercase md:text-6xl'>Lani Akita</h1>
                <h2 className='text-[1.09rem] font-semibold uppercase leading-none md:text-[1.82rem]'>
                  Full Stack Developer
                </h2>
              </div>
            </div>

            <div className='simple-color-trans flex w-full items-center justify-between gap-4 rounded-md border border-ctp-pink bg-ctp-base/70 p-4 shadow-2xl backdrop-blur-md md:flex-row md:bg-ctp-base/60 md:p-2 lg:pr-4 dark:border-ctp-sapphire/40 dark:bg-ctp-midnight/70'>
              <div className='flex w-full flex-col md:flex-row md:justify-between'>
                <div className='flex w-full flex-col flex-wrap items-center gap-2 md:w-fit md:max-w-[30rem] md:flex-row xl:max-w-full'>
                  <Link href='/about' className='home-btn-2'>
                    <p className=''>About Me</p>
                  </Link>
                  <Link href='/work' className='home-btn-2'>
                    <p>My Work</p>
                  </Link>
                  <Link href='/projects' className='home-btn-2'>
                    <p>My Projects</p>
                  </Link>
                  <Link href={RESUME_LINK} className='home-btn-2'>
                    <p>My Résumé</p>
                  </Link>
                  <Link href='/blog' className='home-btn-2'>
                    <p>Read the Blog</p>
                  </Link>
                  <Link href='/contact' className='home-btn-2-extra'>
                    <p>Contact Me</p>
                  </Link>
                </div>
                <div className='mt-1.5 hidden md:flex md:flex-col xl:flex-row xl:gap-2'>
                  <SocialIconNav3 boxItems={socialItems2.slice(0, 3)} />
                  <SocialIconNav3 boxItems={socialItems2.slice(3, 6)} />
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center md:hidden'>
              <SocialIconNav3 boxItems={socialItems2} />
            </div>
          </div>
        </div>


*/
