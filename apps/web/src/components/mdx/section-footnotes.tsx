'use client'
import { useFootnotesStore } from "@/providers/footnotes-store-provider";
import Link, { LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import { HTMLAttributes, LiHTMLAttributes, MouseEvent, ReactElement, useCallback, useEffect, useRef, useState } from "react";

const PT_SCROLL_MOBILE = 8; // rem
const PT_SCROLL_TABLET = 6;

export default function Footnotes(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    if (!isClient) setIsClient(true);
  }, [isClient]);

  // get the footnotes ordered list
  if (props.className === 'footnotes') {
    if ((props.children as HTMLElement[]).length >= 2) {
      const tryList = (props.children as ReactElement[])[2];
      if (tryList?.type === 'ol') {
        const orderedList = (props.children as ReactElement[])[2] as unknown as ReactElement<HTMLAttributes<HTMLOListElement>>;
        if ((orderedList?.props?.children as ReactElement[]).length > 30) {
          return isClient ? <ExpandableFootNotesComponent {...props} /> : <CollapsedFootNotesComponent {...props} />
        }
      }
    }
  }

  return <section {...props} />
}

function CollapsedFootNotesComponent(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  const h2 = (props.children as ReactElement[])[0] as ReactElement<HTMLHeadingElement>;

  const currList = ((props.children as ReactElement[])[2] as unknown as ReactElement<HTMLAttributes<HTMLOListElement>>)?.props?.children as ReactElement<HTMLLIElement>[];

  const newList = currList.slice(0, 30);

  return (
    <section {...props}>
      {h2}
      <ol>
        {newList}
      </ol>
    </section>
  )

}

const remToPx = (input: number) => {
  const baseFontSize = Number(window.getComputedStyle(document.body)?.getPropertyValue('font-size')?.match(/\d+/)?.[0]);
  return baseFontSize ? (input * baseFontSize) : 0
}

const offSets = window.innerWidth < 768 ? remToPx(PT_SCROLL_MOBILE) : remToPx(PT_SCROLL_TABLET);

function ExpandableFootNotesComponent(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  const h2 = (props.children as ReactElement[])[0] as ReactElement<HTMLHeadingElement>;
  const currList = ((props.children as ReactElement[])[2] as unknown as ReactElement<HTMLAttributes<HTMLOListElement>>)?.props?.children as ReactElement<HTMLLIElement>[];
  const newList = currList.slice(0, 30);
  
  const [sectionHeight, setSectionHeight] = useState(0);
  const { expanded, expandFootnotes } = useFootnotesStore((state) => state);
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  const sectionRef = useRef<HTMLElement>(null!);
  const oListRef = useRef<HTMLOListElement>(null!);
  const liRef = useRef<HTMLLIElement>(null!);
  const params = useSearchParams();

  const handleExpand = useCallback(() => {
    // get expanded height;
    // timeout necessary, otherwise it uses the collapsed height
    setTimeout(() => {
      //console.log('await getting height');
      setSectionHeight(oListRef.current.offsetHeight);
    }, 5);
    setTimeout(() => {
      setInternalExpanded(true);
    }, 2000);
  }, []);


  const handleHash = useCallback((currHash: string) => {
    const re = /(?:user-content-fn)/;
    const nullRe = /(?:user-content-fnref)/;
    // if the below is true we can assume the curr url is a link to a footnote
    if (currHash.match(re) && !currHash.match(nullRe)) {
      //setFnHash(currHash)
      console.log('hash is fnHash')

      if ('scrollRestoration' in window.history) {
        console.log('found scroll restore point:', window.history.scrollRestoration)
        if (window.history.scrollRestoration !== 'manual') {
          window.history.scrollRestoration = 'manual'
          console.log('set to manual');
        }
      }

      if (!expanded) {
        expandFootnotes();

        setTimeout(() => {
          //console.log('liref', liRef?.current?.getClientRects()[0]?.y);
          const altLiTop = document.getElementById(currHash.substring(1))?.getClientRects()[0]?.top;
          console.log(altLiTop);

          if (altLiTop && altLiTop > 0) {
            window.scrollTo(0, altLiTop - offSets)
          }
        }, 801)

      }

    } else {
      console.log(window.location.hash, 'is not fnhash');
      if ('scrollRestoration' in window.history) {
        console.log('found scroll restore point:', window.history.scrollRestoration)
        if (window.history.scrollRestoration !== 'auto') {
          window.history.scrollRestoration = 'auto';
          console.log('restored to auto');
        }
      }
    }
  }, [expandFootnotes, expanded]);


  useEffect(() => {
    console.log('running...');
    if (window.location.hash) handleHash(window.location.hash);
    console.log(params);
  }, [params, handleHash]);


  useEffect(() => {
    if (sectionHeight <= 0 && sectionRef.current.offsetHeight > sectionHeight) {
      setSectionHeight(sectionRef.current.offsetHeight);
    }

    if (sectionHeight > 0) sectionRef.current.style.height = `${sectionHeight}px`;


    if (expanded && !internalExpanded) {
      handleExpand();
    }

    if (internalExpanded) {
      sectionRef.current.style.height = "100%";
    }

  }, [sectionHeight, handleExpand, expanded, expandFootnotes, internalExpanded]);


  return (
    <section ref={sectionRef} {...props} className={`${props.className} relative [transition:_height_0.8s_ease-out]`} >
      {h2}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute ${expanded ? 'hidden' : ''} inset-x-0 bottom-0 flex size-full max-h-[50%] items-center justify-center overflow-x-auto rounded-b-lg bg-ctp-base/20 bg-gradient-to-b from-transparent to-ctp-midnight text-center text-ctp-overlay0 dark:bg-ctp-midnight/20`}
        >
          <button
            onClick={() => {
              expandFootnotes();
            }}
            className='pointer-events-auto flex w-fit flex-row items-center gap-[1ch] rounded-lg border border-ctp-mauve bg-ctp-mauve/10 p-4 font-mono text-sm text-ctp-mauve shadow-lg backdrop-blur-sm [transition:_color_0.3s,_border_0.3s,_box-shadow_0.3s,_backdrop-filter_0.3s,_background_0.3s] hover:border-ctp-pink hover:bg-ctp-pink/10 hover:text-ctp-pink hover:shadow-xl hover:backdrop-blur'
          >
            <span className="icon-[ph--note-fill] pointer-events-none w-[2ch] text-2xl" /><span className="pointer-events-none">show references</span>
          </button>
        </div>
      </div>
      <ol ref={oListRef} className=''>
        {expanded
          ?
          currList.map((item) => (
            item.props ? <li ref={liRef} {...item.props as unknown as LiHTMLAttributes<HTMLLIElement>} key={crypto.randomUUID()} /> : ''
          ))
          : newList}
      </ol>
    </section>
  )

}

export function SupAnchors(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {

  const { expanded, expandFootnotes } = useFootnotesStore((state) => state);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e && !expanded) expandFootnotes();
    const target = e.target as HTMLAnchorElement
    setTimeout(() => {
      console.log(target.hash)
      const tQ = document.getElementById(target.hash.substring(1));
      const scrollY = tQ?.getClientRects()[0]?.top;
      if (scrollY) window.scrollBy(0, scrollY - offSets);
    }, 50)
  }

  if (typeof props.children !== 'string') {
    const anchor = props.children as ReactElement<HTMLAnchorElement>;
    if ('data-footnote-ref' in anchor.props && anchor.props['data-footnote-ref']) {
      return (
        <sup {...props}>
          {}
          <Link onClick={(e) => handleClick(e)}  {...anchor.props as unknown as LinkProps} scroll={false} />
        </sup>
      )
    }
  }
  return <sup {...props} />
} 
