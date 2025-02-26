import { notFound } from 'next/navigation';
import { allPages, type Page } from 'content-collections';
import GlobalMDXComponent from '@/components/mdx/global-mdx-components';

export function PageCommon({ slug, prefix }: { slug: string; prefix?: string }) {
  if (!prefix) {
    const data = allPages.find((page) => page.url === `/${slug}`);
    if (!data) return notFound();
    return <Inside {...data} />;
  } else if (prefix) {
    const data = allPages.find((page) => page.url === `/${prefix}/${slug}`);
    if (!data) return notFound();
    return <Inside {...data} />;
  }
}

function Inside(data: Page) {
  return (
    <main className='py-common-info-page'>
      <article id='content' className='flex size-full flex-col items-center justify-center'>
        <div className='flex min-h-full items-center justify-center padding-post'>
          <div className='prose-protocol-omega max-w-3xl px-0'>
            <GlobalMDXComponent {...data} />
          </div>
        </div>
      </article>
    </main>
  );
}
