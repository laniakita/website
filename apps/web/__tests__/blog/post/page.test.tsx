/// <reference lib="dom" />
import { describe, it, expect, mock, jest } from 'bun:test';
import { render } from '@testing-library/react';
import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';

await mock.module('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt='' />;
  },
}));


