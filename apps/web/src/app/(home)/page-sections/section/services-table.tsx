import { useRef } from 'react';
import { useIntersectionObserver } from '../../utils';


export default function ServicesTable({ code }: { code: string }) {
  const figureRef = useRef<HTMLElement>(null!);
  const visible = useIntersectionObserver(figureRef);

  return (
    <figure
      ref={figureRef}
      className={`${visible ? 'opacity-0 motion-safe:animate-big-fade-in-up' : 'motion-safe:animate-big-fade-down'} relative z-10`}
    >
      <div className='prose-protocol-omega' dangerouslySetInnerHTML={{ __html: code }} />
    </figure>
  );
}
