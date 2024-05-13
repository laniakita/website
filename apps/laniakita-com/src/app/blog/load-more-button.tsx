'use client';

import { usePostNumStore } from '@/providers/postnum-store-provider';

function LoadMoreButton({ shouldLoad }: { shouldLoad: boolean }) {
  const loadMore = usePostNumStore((state) => state.loadMore);

  return (
    <div className='size-full md:p-2'>
      <button
        type='button'
        onClick={() => {
          loadMore();
        }}
        disabled={!shouldLoad}
        className='motion-safe:color-trans-2 z-[4] size-full min-h-60 border border-ctp-surface0 bg-ctp-mauve  p-4 font-mono text-lg font-semibold text-ctp-base hover:bg-ctp-pink hover:text-ctp-base disabled:border-transparent  disabled:bg-ctp-crust disabled:text-ctp-text disabled:hover:shadow-none disabled:dark:bg-ctp-base md:min-h-96 md:rounded-2xl md:hover:border-ctp-base md:disabled:border-ctp-surface0 md:disabled:hover:border-ctp-mauve'
      >
        {shouldLoad ? 'load more' : `end of posts`}
      </button>
    </div>
  );
}

export default LoadMoreButton;
