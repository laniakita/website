'use client'
import { useFootnotesStore } from "@/providers/footnotes-store-provider";
import { setWith } from "lodash";
import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { off } from "node:process";
import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes, LiHTMLAttributes, MouseEvent, ReactElement, useCallback, useEffect, useRef, useState } from "react";

export default function Footnotes(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    if (!isClient) setIsClient(true);
    //if (window.location.hash) handleHash(window.location.hash);
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

function ExpandableFootNotesComponent(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  const h2 = (props.children as ReactElement[])[0] as ReactElement<HTMLHeadingElement>;

  const currList = ((props.children as ReactElement[])[2] as unknown as ReactElement<HTMLAttributes<HTMLOListElement>>)?.props?.children as ReactElement<HTMLLIElement>[];

  const newList = currList.slice(0, 30);
  const PT_SCROLL_MOBILE = 8; // rem
  const PT_SCROLL_TABLET = 6;

  /*
  interface Reload {
    hash: string | null;
  }*/

  const [sectionHeight, setSectionHeight] = useState(0);
  //const [isReload, setIsReload] = useState<Reload>({hash: null});
  const { expanded, expandFootnotes } = useFootnotesStore((state) => state);
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  const [isDone, setDone] = useState(false);

  const sectionRef = useRef<HTMLElement>(null!);
  const oListRef = useRef<HTMLOListElement>(null!);
  const liRef = useRef<HTMLLIElement>(null!);
  const [liOffset, setLiOffset] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [runCount, setRunCount] = useState(0);

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

  /*

  }*/

  /* interesting idea, but not great in practice.
  const handleReloadScroll = useCallback((currHash: string) => {
    setTimeout(() => {
      const noteQ = document.getElementById(currHash.substring(1))?.getBoundingClientRect();
      console.log(document.getElementById(currHash.substring(1)));
      if (noteQ) {
        const remOffset = window.innerWidth && (window.innerWidth < 768 ? 6 : 8)
        const offSetY = noteQ.y - remToPx(remOffset);
        console.log(window.screenY - offSetY);
        if (window.screenY - offSetY < -500) {
          window.scrollTo({left:noteQ.x, top:offSetY, behavior: 'smooth'});
        }
      }
    }, 2000)
  }, []) */

  const [fnHash, setFnHash] = useState<string | null>(null);
  const params = useParams();

  const handleHash = useCallback((currHash: string) => {
    const re = /(?:user-content-fn)/;
    const nullRe = /(?:user-content-fnref)/;
    // if the below is true we can assume the curr url is a link to a footnote
    if (currHash.match(re) && !currHash.match(nullRe)) {
      setFnHash(currHash)
    } else {
      setFnHash(null)
    }
  }, []);


  useEffect(() => {
    if (window.location.hash) handleHash(window.location.hash);

    if (fnHash !== null) {
      const offSets = window.innerWidth < 768 ? remToPx(PT_SCROLL_MOBILE) : remToPx(PT_SCROLL_TABLET);

      if (!expanded && !stopped) {
        console.log(fnHash);
        window.scrollTo(0, window.scrollY); // necessary to stop the scroll
        expandFootnotes();
        if ('scrollRestoration' in window.history) {
          console.log('found scroll restore point: setting manual')
          window.history.scrollRestoration = 'manual'
        }
        //window.scrollTo(0, window.scrollY);
        console.log('expanded from useEffect');
      }
      if (expanded && !stopped && liOffset !== document.getElementById(fnHash.substring(1))?.getClientRects()?.[0]?.top) {
        console.log('phase 2')
        const liQ = document.getElementById(fnHash.substring(1));
        const scrollY = liQ?.getClientRects()?.[0]?.top
        setLiOffset(scrollY ?? 0);
        console.log('scrollY', scrollY);
      };

      if (liOffset === document.getElementById(fnHash.substring(1))?.getClientRects()?.[0]?.top) {
        setStopped(true);
        console.log('phase 3: stopped', liOffset);
      }

      if (stopped) {
        console.log('phase 4: scroll to li', liOffset);
        setTimeout(() => { window.scrollTo(0, liOffset - offSets) }, 20);
        let secondScroll = 0;
        setTimeout(() => {
          console.log('scroll more', document.getElementById(fnHash.substring(1))?.getClientRects()?.[0]?.top)
          secondScroll = document.getElementById(fnHash.substring(1))?.getClientRects()?.[0]?.top ?? 0;
        }, 850);
        setTimeout(() => {
          console.log(secondScroll, offSets)
          if (secondScroll > offSets) {
            console.log('should scroll more');
            setTimeout(() => { window.scrollBy(0, secondScroll - offSets) }, 20);
          }
        }, 860);
      }

    } else {
      window.history.scrollRestoration = 'auto';
    }
  }, [
    expandFootnotes,
    expanded,
    fnHash,
    handleHash,
    liOffset,
    stopped
  ]);


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
      const scrollOffsets = window.innerWidth < 768 ? 8 : 6;
      if (scrollY) window.scrollBy(0, scrollY - remToPx(scrollOffsets));
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
