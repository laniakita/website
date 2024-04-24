'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function SceneOverlay() {
  const searchParams = useSearchParams();
  const handleJump = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('screen', 'home')
    window.history.pushState(null, '', `?${params.toString()}`)
  };


  return (
    <Suspense>
      {searchParams.get('screen') && searchParams.get('screen') !== 'home' && (
        <div className='ctp-mocha absolute inset-x-0 bottom-8 z-[1] flex w-full items-center justify-center px-8'>
            <button
              onClick={handleJump}
              type='button'
              className='motion-safe:color-trans-2 w-full max-w-lg rounded border border-ctp-text bg-ctp-crust p-4 font-mono text-ctp-text shadow-xl hover:bg-ctp-base'
            >
              Back
            </button>
        </div>
      )}
    </Suspense>
  );
}
