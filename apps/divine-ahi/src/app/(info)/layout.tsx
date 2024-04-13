import type { ReactNode } from 'react';

export default function MarkdownLayout({ children }: { children: ReactNode }) {
  return <div className='prose prose-catppuccin p-4'>{children}</div>;
}
