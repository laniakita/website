/* eslint-disable import/no-unresolved -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-call -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- enabled external imports via next.config.mjs */
import { Component, DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { codeToHtml } from 'shiki';
import { transformerTwoslash } from '@shikijs/twoslash';
import { createTwoslashFromCDN } from 'twoslash-cdn';

export async function TestLight(props: any) {
  //const highlighter = await createHighlighter({});
  const twoslash = createTwoslashFromCDN();
  const code = `
    import { ref } from 'vue'
    const foo = ref(1)
    //    ^?
  `;
  await twoslash.prepareTypes(code)

  const Highlighted = codeToHtml(code, {
    lang: 'ts',
    theme: 'dark-plus',
    transformers: [
      transformerTwoslash({
        // Use `twoslash.runSync` to replace the non-CDN `twoslasher` function.
        twoslasher: twoslash.runSync
      })
    ],
  })
  return (
    <>{Highlighted}</>
  )
}

interface CodeHighlighterProps {
  className?: string;
  children?: string;
}

/*
async function ReturnHighlight (className: string, code: string) {
  const html = await codeToHtml(code, {
    lang: className.split('-')[1]!,
    themes: { 
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha'
    },
    transformers: [transformerTwoslash({
      renderer: rendererRich()
    })],
  });
  return (
    <>
      {html}
    </>
  )
};
*/

function CodeHighlighter(props: unknown) {
  //const match = /language-(\w+)/.exec((props as CodeHighlighterProps).className ?? '');
  //let Highlighted;
  //if (match) {
  //  Highlighted = await ReturnHighlight((props as CodeHighlighterProps).className!, (props as CodeHighlighterProps).children!)
  //}  <code {...(props as CodeHighlighterProps)} />;
  return <>{SetUp}</>
  //return match ? <>{ Highlighted }</> :;
} /* Component<HTMLElement<DetailedHTMLProps>> | undefined) */

export default CodeHighlighter;
