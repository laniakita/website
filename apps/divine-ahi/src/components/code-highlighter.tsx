import { getHighlighter } from 'shiki';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';

interface CodeProps {
  className: string;
  children: string;
}

export default async function CodeHighlighter(props: unknown) {
  console.log(props);
  const match = /language-(\w+)/.exec((props as CodeProps).className || '');

  if (!match) {
    return;
  }

  const highlighter = await getHighlighter({
    themes: ['catppuccin-latte', 'catppuccin-mocha'],
    langs: ['typescript', 'javascript', 'nix', 'yaml', 'json', 'lua', 'html', 'css'],
  });
  const __html = highlighter.codeToHtml((props as CodeProps).children, {
    lang: 'ts',
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
    transformers: [
      transformerTwoslash({
        renderer: rendererRich(),
      }),
    ],
  });

  return <div dangerouslySetInnerHTML={{ __html }} className='' />;
}
