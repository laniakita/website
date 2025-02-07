'use client'
import { useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";

export default function HeroScrollBtn({ mobile, delay }: { mobile?: boolean; delay?: string }) {
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={`${mobile ? '@3xl:hidden' : ''} w-full overflow-hidden mt-6 @3xl:my-auto`} >
      <button
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById("Aloha-I'm-Lani");
          if (el) {
            lenis?.scrollTo(el, { offset: window.innerWidth < 768 ? -100 : -200 });
          }
          router.push(`${pathname}/#Aloha-I'm-Lani`);
        }}
        className={`${mobile ? 'opacity-0 @3xl:hidden' : 'hidden @3xl:block'} w-full rounded-md border border-ctp-sapphire bg-ctp-sapphire/20 px-4 py-4 text-center font-mono text-sm font-bold text-ctp-sapphire no-underline hover:border-ctp-sky hover:bg-ctp-sky/40 hover:text-ctp-sky motion-safe:animate-fade-in-down-slow  @3xl:py-4 @4xl:text-base text-balance`}
        style={{
          animationDelay: delay ?? '0s',
        }}
      >
        scroll to explore <span className='-mb-1.5 icon-[ph--caret-double-down-bold] animate-bounce text-xl' />
      </button>
    </div>
  );
}
