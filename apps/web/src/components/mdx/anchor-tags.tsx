'use client'
import React, { MouseEvent } from 'react';
import { offSets } from './section-footnotes';

export default function Anchors(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
  },
) {
  //console.log(props);
  if (props.className === 'data-footnote-backref') {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      const target = e.target as HTMLAnchorElement;
      setTimeout(() => {
        //console.log(target.hash)
        const tQ = document.getElementById(target.hash.substring(1));
        const scrollY = tQ?.getClientRects()[0]?.top;
        if (scrollY) window.scrollBy({ left: 0, top: scrollY - offSets(), behavior: 'instant' });
      }, 50);
    };
    // eslint-disable-next-line -- proper props are passed to the anchor tag
    return <a {...props} onClick={(e) => handleClick(e)} />;
  }
  // eslint-disable-next-line -- proper props are passed to the anchor tag
  return <a {...props} />;
}
