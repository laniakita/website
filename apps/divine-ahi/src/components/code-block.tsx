/* eslint-disable import/no-unresolved -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-call -- enabled external imports via next.config.mjs */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- enabled external imports via next.config.mjs */
import { rendererRich, transformerTwoslash, } from '@shikijs/twoslash'
import { codeToHtml } from 'shiki'
import { createTwoslashFromCDN } from 'twoslash-cdn'
import parse from 'html-react-parser';

// ============= Initialization =============

// An example using unstorage with IndexedDB to cache the virtual file system

export default async function CodeBlock() {
  const twoslash = createTwoslashFromCDN({
    compilerOptions: {
      lib: ['esnext', 'dom']
    }
  });
 
 const source = `
    import { ref } from 'vue'

    console.log("Hi! Shiki + Twoslash on CDN :)")

    const count = ref(0)
    //     ^?
  `.trim();

  await twoslash.prepareTypes(source)

  const htmlStr = await codeToHtml(source, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerTwoslash({
        twoslasher: twoslash.runSync,
      })
    ],
  });

  return <></>;
}
