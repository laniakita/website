import { notFound } from 'next/navigation';
import { allPages } from '@/lib/fumadocs';
import { pages } from '$/.source';
import { mdxComponents } from '@/mdx-components';

export function PageCommon({ slug, prefix }: { slug: string; prefix?: string }) {
  if (!prefix) {
    const data = allPages.find((page) => page.url === `/pages/${slug}`);
    if (!data) return notFound();
    return <Inside {...data} />;
  } else if (prefix) {
    const data = allPages.find((page) => page.url === `/${prefix}/${slug}`);
    if (!data) return notFound();
    return <Inside {...data} />;
  }
}

function Inside(data: typeof pages[0]) {
  const MDXContent = data.body;

  return (
    <main className='py-common-info-page'>
      <article id='content' className='flex size-full flex-col items-center justify-center'>
        <div className='flex min-h-full items-center justify-center padding-post'>
          <div className='prose-protocol-omega max-w-3xl px-0'>
            {/* @ts-expect-error -- types issues */}
            <MDXContent components={mdxComponents} />
          </div>
        </div>
      </article>
    </main>
  );
}
