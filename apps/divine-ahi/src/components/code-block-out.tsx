'use client';
/* eslint-disable import/no-unresolved -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-call -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- enabled external imports via next.config.mjs */
//import { rendererRich, transformerTwoslash, } from '@shikijs/twoslash'
/*
import { codeToHtml } from 'shiki'
import { createTransformerFactory, rendererRich } from 'https://esm.sh/@shikijs/twoslash@latest/core';
import { createTwoslashFromCDN } from 'twoslash-cdn';
import parse from 'html-react-parser';

// ============= Initialization =============

// An example using unstorage with IndexedDB to cache the virtual file system

export default async function CodeBlock() {
  const twoslash = createTwoslashFromCDN({
    compilerOptions: {
      lib: ['esnext', 'dom'],
    },
  });

  const transformerTwoslash = createTransformerFactory(twoslash.runSync)({
    renderer: rendererRich(),
  });

  const source = `
    import { ref } from 'vue'

    console.log("Hi! Shiki + Twoslash on CDN :)")

    const count = ref(0)
    //     ^?
  `.trim();

  await twoslash.prepareTypes(source);

  const htmlEl = codeToHtml(source, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [transformerTwoslash],
  });

  const str = await htmlEl


  return <>{parse(str)}</>;
}
*/
import parse from 'html-react-parser';

export default function CodeBlockOut({ props }: { props: string }) {
  return <div className='[&>pre]:whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: props }} />;
}
