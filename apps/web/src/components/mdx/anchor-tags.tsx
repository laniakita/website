'use client';
import React, { MouseEvent } from 'react';
import { offSets } from './section-footnotes';

export default function Anchors(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
    href?: string;
  },
) {
  //console.log(props);
  if ('data-footnote-backref' in props) {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      const target = e.target as HTMLAnchorElement;
      setTimeout(() => {
        //console.log(target.hash)
        const tQ = document.getElementById(target?.hash?.substring(1));
        const scrollY = tQ?.getClientRects()[0]?.top;
        if (scrollY) window.scrollBy({ left: 0, top: scrollY - offSets(), behavior: 'instant' });
      }, 20);
    };
    // eslint-disable-next-line -- proper props are passed to the anchor tag
    return <a {...props} onClick={(e) => handleClick(e)} />;
  }

  if (props.href) {
    const re = /(?:https:\/\/)/;
    const re2 = /(?:http:\/\/)/;

    if (re.test(props.href) || re2.test(props.href)) {
      return (
        // eslint-disable-next-line -- proper props are passed to the anchor tag
        <a {...props} target='_blank' rel='noopener noreferrer' />
      );
    }
  }

  // eslint-disable-next-line -- proper props are passed to the anchor tag
  return <a {...props} />;
}
