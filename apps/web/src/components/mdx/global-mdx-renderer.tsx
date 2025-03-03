'use client'
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';

export default function GlobalMDXRenderer({ children }: { children: string }) {
  return (
    <>
      {/* @ts-expect-error -- needs update with latest TS */}
      <Markdown
        options={{
          forceBlock: true,
          overrides: {
            // @ts-expect-error -- needs update with latest TS
            a: Link,
          },
        }}
      >
        {children}
      </Markdown>
    </>
  );
}
