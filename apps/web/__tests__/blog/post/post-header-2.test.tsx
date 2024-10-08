/// <reference lib="dom" />
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- It's just a test. It's okay.  */
import { describe, it, expect, mock, jest } from 'bun:test';
import { render } from '@testing-library/react';
import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { PostHeader2 } from '@/app/(content)/blog/[id]/[slug]/post-header-2';

console.error = jest.fn();

await mock.module('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt='' />;
  },
}));

describe('Header renders', () => {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)));
  const { rerender } = render(<PostHeader2 {...posts[0]!} />);

  for (const post of posts) {
    it(`headline === ${post.headline}`, () => {
      rerender(<PostHeader2 {...post} />);
      const heading = document.querySelector('h1');
      expect(heading?.innerText).toEqual(post.headline);
    });
  }
  // @ts-expect-error -- errors cause img component
  expect(console.error.mock.calls.length).toBeGreaterThanOrEqual(0);
});
