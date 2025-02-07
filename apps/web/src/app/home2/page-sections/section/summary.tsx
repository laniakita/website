'use client'

import { useRef } from "react";
import { useIntersectionObserver } from "../../utils";

export default function Summary({code}:{code: string}) {
  const figureRef = useRef<HTMLElement>(null!);
  const visible = useIntersectionObserver(figureRef);
 
  return (
    <figure ref={figureRef} className={visible ? 'opacity-0 motion-safe:animate-big-fade-in-up' : 'motion-safe:animate-big-fade-down'}>
      <div
        className='prose-protocol-omega -mt-6 mx-0 max-w-full'
        dangerouslySetInnerHTML={{ __html: code }}
      />
      <figcaption className='mx-0 px-0'>
        <strong>Fig. 01</strong>: Myself summarized as a JS object. The <em>snake_case</em> implies
        compatibility with a database, perhaps suggesting this object might be inserted into some
        database&apos;s table.
      </figcaption>
    </figure>
  );

}
