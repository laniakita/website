import type { LinkProps } from 'next/link';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import type { ImgProps } from 'next/dist/shared/lib/get-img-props';
import BlogImageShimmer from './app/blog/blog-image-shimmer';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props) => <Link {...(props as LinkProps)} />,
    img: (props) => <BlogImageShimmer alt={props.alt!} {...(props as ImgProps)} />,
    ...components,
  };
}
