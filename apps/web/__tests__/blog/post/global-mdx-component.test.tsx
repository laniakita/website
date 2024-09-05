/// <reference lib="dom" />
import { describe, it, expect, jest } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { GlobalTestMDXComponent } from '@/components/mdx/global-mdx-components';
import { descriptionHelper } from '@/lib/description-helper';

console.error = jest.fn();

describe('MDX renders', () => {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)));
  const {rerender} = render(<GlobalTestMDXComponent {...posts[0]!} />);
  
  for (const post of posts) {
    it(`GlobalTestMDXComponent renders first paragraph`, () => {
      rerender(<GlobalTestMDXComponent {...post} />)
      const descr = descriptionHelper(post.body.raw, '', true)
      const findDesc = screen.getByText(descr!)
      expect(findDesc.innerText).toEqual(descr!)
    });
  }
});
