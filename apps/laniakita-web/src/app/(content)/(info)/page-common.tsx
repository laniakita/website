import { notFound } from 'next/navigation';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { allPages, type Page } from 'contentlayer/generated';
import ReadingBar from '@/components/reading-bar';
import BlogImageBlurServer from '@/app/(content)/blog/img-blur-server';
import { Paragraph } from '@/app/(content)/blog/[id]/[slug]/page';

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
      <div className='fixed left-0 top-[3.8rem] z-50 w-full'>
        <ReadingBar />
      </div>

      <main className='simple-color-trans pt-common pb-common bg-ctp-base dark:bg-ctp-midnight'>
        <article id='content' className='flex size-full flex-col items-center justify-center'>
          <div className='flex min-h-full items-center justify-center px-10'>
            <div className='prose-protocol-omega max-w-3xl px-0'>
              <MDXPage {...data} />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

function MDXPage(data: Page) {
  const mdxComponents = { p: Paragraph, img: BlogImageBlurServer };
  const MDXContent = useMDXComponent(data.body.code);
  return <MDXContent code={data.body.code} components={mdxComponents} />;
}
