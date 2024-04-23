'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function SceneOverlay() {
  const searchParams = useSearchParams();
  return (
    <Suspense>
      {searchParams.get('screen') && (
        <div className='ctp-mocha absolute inset-x-0 bottom-8 z-[1] flex w-full items-center justify-center px-8'>
          <Link href='/' className='w-full max-w-lg'>
            <button
              type='button'
              className='motion-safe:color-trans-2 w-full rounded border border-ctp-text bg-ctp-crust p-4 font-mono text-ctp-text shadow-xl hover:bg-ctp-base'
            >
              Back
            </button>
          </Link>
        </div>
      )}
    </Suspense>
  );
}
