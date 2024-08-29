import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='simple-color-trans size-full h-screen min-h-96 bg-ctp-base dark:bg-ctp-midnight'>
      <div className='flex flex-col items-center justify-center rounded-md border border-ctp-surface0 p-8 dark:border-ctp-base'>
        <h1 className='text-4xl font-black'>404</h1>
        <h2 className='text-2xl'>Not Found.</h2>
        <div className='w-full bg-ctp-surface0 dark:bg-ctp-base' />
        <Link href='/'>back to home.</Link>
      </div>
    </main>
  );
}
