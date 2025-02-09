import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

export default function Anchors(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    href?: string;
  } & LinkProps,
) {
  if (props.href) {
    const re = /(?:https:\/\/)/;
    const re2 = /(?:http:\/\/)/;

    if (re.test(props.href) || re2.test(props.href)) {
      return (
        // eslint-disable-next-line -- proper props are passed to the anchor tag
        <a {...props} target='_blank' rel='noopener noreferrer nofollow' />
      );
    }
  }

  return <Link {...props} />;
}
