import LocalDate from '@/app/(content)/blog/local-date';
import GlobalMDXRenderer from '@/components/mdx/global-mdx-renderer';
import { APP_URL, SHOWCASE_URL } from '@/lib/constants';
import { allPosts } from '@/lib/fumadocs';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';
import { projects } from '$/.source';

export default function ProjectPreview(data: (typeof projects)[0]) {
  const res = data.featured_image;
  const uKey = useId();

  const getDescription = (dataX: (typeof projects)[0]) => {
    const getPost = allPosts.find((post) => post.url === dataX.blogPost);
    if (!getPost) return;
    return getPost.description ?? dataX.description;
  };

  const projDescription = data.description;
  const blogDescription = getDescription(data);

  function projectLink() {
    if (data.foreignUrl) {
      return data.foreignUrl;
    } else if (!data.embedded && !data.foreignUrl) {
      return `${SHOWCASE_URL}${data.url}`;
    }
    return `${APP_URL}${data.url}`;
  }

  return (
    <div className='flex size-full basis-full flex-col overflow-hidden rounded-md border border-ctp-surface0 bg-ctp-base motion-safe:simple-color-trans dark:border-ctp-base dark:bg-ctp-midnight'>
      {res.src ? (
        <Link href={projectLink()} target='_blank'>
          <Image
            src={res.src}
            placeholder='blur'
            blurDataURL={res.base64}
            alt={res.altText}
            height={res.height}
            width={res.width}
            sizes='(max-width: 300px) 70vw, (max-width: 600px) 45vw, (max-width:1500px) 27vw'
            className='object-contain'
          />
        </Link>
      ) : (
        ''
      )}
      <div className='flex flex-col gap-4 p-8 lg:p-10'>
        <div className='flex flex-col gap-2'>
          <h2 className='w-fit text-3xl font-black text-balance'>
            <Link href={projectLink()} target='_blank' className='text-ctp-text'>
              <span className='relative'>
                {data.title}
                <span className='absolute bottom-1 ml-px icon-[ph--arrow-up-right-bold] text-xl' />
              </span>
            </Link>
          </h2>

          <div className=''>
            {data.updated ? (
              <div className='flex flex-wrap gap-x-2 font-mono'>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>Released:</strong> <LocalDate date={data.date.toISOString()} />
                </p>
                <span className=''>|</span>
                <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                  <strong>Updated:</strong> <LocalDate date={data.updated.toISOString()} />
                </p>
              </div>
            ) : (
              <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
                <strong>Released:</strong> <LocalDate date={data.date.toISOString()} />
              </p>
            )}
          </div>
          <div className='prose-protocol-omega max-w-full prose-p:my-0 prose-a:no-underline'>
            <GlobalMDXRenderer>{projDescription}</GlobalMDXRenderer>
          </div>
        </div>

        {blogDescription ? <div className='h-px w-full bg-ctp-surface0 dark:bg-ctp-base' /> : ''}
        <div className='prose-protocol-omega max-w-full prose-p:my-0 prose-a:no-underline'>
          {blogDescription ? (
            <MDXRenderer>{`<p className="inline mr-[1ch] font-mono font-black">Technical Summary:</p> <p className="inline">${blogDescription}</p>`}</MDXRenderer>
          ) : (
            ''
          )}
        </div>

        <div className='h-px w-full bg-ctp-surface0 dark:bg-ctp-base' />
        <div className='flex flex-row gap-[1ch]'>
          <div className='flex flex-wrap gap-[1ch]'>
            {data.tech?.map((tag, idx) => (
              <p
                key={`project-preview-${uKey}-${Math.floor(Math.random() * 100 + idx)}-${idx * Math.random()}`}
                className='w-fit font-mono text-sm font-semibold'
              >
                {tag}
                {data.tech && idx < data.tech.length - 1 ? <span>,</span> : ''}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MDXRenderer({ children }: { children: unknown }) {
  return (
    <>
      {/* @ts-expect-error -- types not updated */}
      <Markdown>{children}</Markdown>
    </>
  );
}
