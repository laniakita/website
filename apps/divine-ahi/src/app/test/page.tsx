import { getHighlighter } from 'shiki'
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash"; 


export default async function page() {
  const highlighter = await getHighlighter({
    themes: ['catppuccin-latte', 'catppuccin-mocha'],
    langs: ['typescript']
  })
  const __html = highlighter.codeToHtml(`console.log()`, {
    lang: 'ts',
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
    transformers: [transformerTwoslash({
      renderer: rendererRich()
    })]
  })

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div dangerouslySetInnerHTML={{ __html }} />
    </div>
  );
}
