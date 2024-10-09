import { notFound } from 'next/navigation';
import { allPages, type Page } from 'contentlayer/generated';
import ReadingBar from '@/components/reading-bar';
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
    <>
      <div>
        <div className='fixed left-0 top-[3.8rem] z-50 w-full'>
          <ReadingBar />
        </div>
      </div>

      <main className='simple-color-trans py-common-info-page bg-ctp-base dark:bg-ctp-midnight'>
        <article id='content' className='flex size-full flex-col items-center justify-center'>
          <div className='padding-post flex min-h-full items-center justify-center'>
            <div className='prose-protocol-omega max-w-3xl px-0'>
              <GlobalMDXComponent {...data} />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
