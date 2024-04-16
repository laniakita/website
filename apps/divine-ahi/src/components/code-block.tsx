import {
  codeToHtml,
  codeToTokens
} from 'shiki'
import {
  transformerTwoslash,
} from '@shikijs/twoslash'
import CodeBlockOut from './code-block-out'

const codeIn = async () => {
  return await codeToHtml(`console.log()`, {
    lang: 'ts',
    theme: 'vitesse-dark',
    transformers: [
      transformerTwoslash()
    ],
  })
}

export default async function CodeBlock() {
  const str = await codeIn()
  return(
    <CodeBlockOut props={str} />
  )
}
