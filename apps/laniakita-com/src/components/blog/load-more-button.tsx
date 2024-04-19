'use client';

import { usePostNumStore } from '@/providers/postnum-store-provider';

function LoadMoreButton({ shouldLoad }: { shouldLoad: boolean }) {
  const loadMore = usePostNumStore((state) => state.loadMore);

  return (
    <button
      type='button'
      onClick={() => {
        loadMore();
      }}
      disabled={!shouldLoad}
      className='motion-safe:color-trans-2 z-[4] size-full min-h-60 border border-ctp-surface0 bg-ctp-mauve  p-4 font-mono text-lg font-semibold text-ctp-base hover:bg-ctp-pink hover:text-ctp-base disabled:border-transparent disabled:bg-ctp-base disabled:text-ctp-text disabled:hover:shadow-none md:min-h-96  md:hover:border-ctp-base md:disabled:border-ctp-surface0 md:disabled:hover:border-ctp-mauve'
    >
      {shouldLoad ? 'load more' : `that's all folks`}
    </button>
  );
}

export default LoadMoreButton;
