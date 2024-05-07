import type { LinkProps } from 'next/link';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props) => <Link {...(props as LinkProps)} />,
    ...components,
  };
}
