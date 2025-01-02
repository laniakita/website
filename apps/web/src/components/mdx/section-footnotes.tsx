'use client'
import { useFootnotesStore } from "@/providers/footnotes-store-provider";
import { useParams } from "next/navigation";
import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes, MouseEvent, ReactElement, useCallback, useEffect, useRef, useState } from "react";

export default function Footnotes(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  const [isClient, setIsClient] = useState(false);
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
    if (!isClient) setIsClient(true);
    if (window.location.hash) handleHash(window.location.hash);
  }, [params, isClient, handleHash]);

  // get the footnotes ordered list
  if (props.className === 'footnotes') {
    if ((props.children as HTMLElement[]).length >= 2) {
      const tryList = (props.children as ReactElement[])[2];
      if (tryList?.type === 'ol') {
        const orderedList = (props.children as ReactElement[])[2] as unknown as ReactElement<HTMLAttributes<HTMLOListElement>>;
        if ((orderedList?.props?.children as ReactElement[]).length > 30) {
          if (fnHash === null) {
            return isClient ? <ExpandableFootNotesComponent {...props} /> : <CollapsedFootNotesComponent {...props} />
          }
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

function ExpandableFootNotesComponent(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  const h2 = (props.children as ReactElement[])[0] as ReactElement<HTMLHeadingElement>;

  const currList = ((props.children as ReactElement[])[2] as unknown as ReactElement<HTMLAttributes<HTMLOListElement>>)?.props?.children as ReactElement<HTMLLIElement>[];

  const newList = currList.slice(0, 30);

  /*
  interface Reload {
    hash: string | null;
  }*/

  const [sectionHeight, setSectionHeight] = useState(0);
  //const [isReload, setIsReload] = useState<Reload>({hash: null});
  const { expanded, expandFootnotes } = useFootnotesStore((state) => state);

  const sectionRef = useRef<HTMLElement>(null!);
  const oListRef = useRef<HTMLOListElement>(null!);

  const handleExpand = useCallback(() => {
    // get expanded height;
    // timeout necessary, otherwise it uses the collapsed height
    setTimeout(() => {
      //console.log('await getting height');
      setSectionHeight(oListRef.current.offsetHeight);
    }, 5);
  }, []);

  /*
  const remToPx = (input: number) => {
    const baseFontSize = Number(window.getComputedStyle(document.body)?.getPropertyValue('font-size')?.match(/\d+/)?.[0]);
    return baseFontSize ? (input * baseFontSize) : 0
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

  useEffect(() => {
    if (sectionHeight <= 0 && sectionRef.current.offsetHeight > sectionHeight) {
      setSectionHeight(sectionRef.current.offsetHeight);
    }
    if (sectionHeight > 0) sectionRef.current.style.height = `${sectionHeight}px`;

    /*
    if (!expanded) {
      // check if this is a page reload
      const currHash = window.location.hash
      const re = /(?:user-content-fn)/;
      const nullRe = /(?:user-content-fnref)/;
      // if the below is true we can assume the curr url is a link to a footnote
      if (currHash.match(re) && !currHash.match(nullRe)) {
        // just expand the footnotes, by the time the browser catches up, it'll scroll automatically.
        expandFootnotes();
      }
    }*/

    if (expanded) {
      handleExpand();
    }


    /*
    if (expanded && isReload.hash === null) {
      handleExpand();
    }*/

    /*

    /*
    if (expanded && isReload?.hash !== null) {
      handleReloadScroll(isReload.hash);
      setIsReload({hash: null})
    }*/

  }, [sectionHeight, handleExpand, expanded, expandFootnotes]);

  return (
    <section ref={sectionRef} {...props} className={`${props.className} relative [transition:_height_0.8s]`} >
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
      <ol ref={oListRef}>
        {expanded
          ?
          currList.map((item) => (
            item.props ? <li {...item.props} key={crypto.randomUUID()} /> : ''
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
  }


  //console.log(props);
  if (typeof props.children !== 'string') {
    const anchor = props.children as ReactElement<HTMLAnchorElement>;
    if ('data-footnote-ref' in anchor.props && anchor.props['data-footnote-ref']) {
      return (
        <sup {...props}>
          {/* eslint-disable-next-line -- included as props */}
          <a onClick={(e) => handleClick(e)}  {...anchor.props as unknown as DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>} />
        </sup>
      )
    }
  }
  return <sup {...props} />
} 
