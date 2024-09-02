import Markdown from 'markdown-to-jsx';
import Link from 'next/link';

export default function GlobalMDXRenderer({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        forceBlock: true,
        overrides: {
          a: Link,
        },
      }}
    >
      {children}
    </Markdown>
  );
}
