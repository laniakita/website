import type { ReactNode } from 'react';

export default function MarkdownLayout({ children }: { children: ReactNode }) {
  return (
    <div className='simple-color-trans relative z-[5] -mb-1 min-h-full  bg-ctp-base dark:bg-ctp-midnight'>
      <div className='flex items-center justify-center gap-6 p-10 lg:pb-20 lg:pt-36'>
        <div className='prose-protocol-omega'>{children}</div>
      </div>
    </div>
  );
}
