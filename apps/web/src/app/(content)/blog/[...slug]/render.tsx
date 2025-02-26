'use client'
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

export default async function render(slug: string) {
  if (!document) return;
  const div = document.createElement('div');
  const root = createRoot(div);
  const { default: PostMDX } = await import(`@content/posts/${slug}.mdx`);
  flushSync(() => {
    root.render(<PostMDX />);
  });
  const data = div.innerHTML;
  return data;
}
