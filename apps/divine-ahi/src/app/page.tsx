import Link from "next/link";

export default function Home() {
  return (
    <main className='ctp-mocha'>
      <div className='flex h-screen w-full items-center justify-center bg-ctp-sky text-ctp-text'>
        testing <span className='icon-[ph--alien-fill]' />
        <div className="flex flex-row gap-4">
          <Link href="/about">about</Link>
          <Link href="/credits">credits</Link>
          <Link href="/terms">terms</Link>
          <Link href="/privacy">privacy</Link>
        </div>
      </div>
      <article className='prose prose-catppuccin'>
        <p>this is some text</p>
      </article>
    </main>
  );
}
