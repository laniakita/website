import { projects } from '$/.source';
import LocalDate from '@/app/(content)/blog/local-date';
import GlobalMDXRenderer from '@/components/mdx/global-mdx-renderer';
import { APP_URL, SHOWCASE_URL } from '@/lib/constants';
import type { FeaturedImageR1 } from '@/lib/image-process';
import Image from 'next/image';
import Link from 'next/link';

type ProjectProps = (typeof projects)[0];

export default function MiniProjectPreview({ data }: { data: ProjectProps }) {
  const res = data.featured_image as FeaturedImageR1;
  const projDescription = data.description;

  function projectLink() {
    if (data.foreignUrl) {
      return data.foreignUrl;
    } else if (!data.embedded && !data.foreignUrl) {
      return `${SHOWCASE_URL}${data.url}`;
    }
    return `${APP_URL}${data.url}`;
  }

  return (
    <div className='flex flex-col'>
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
            className='h-64 object-cover @3xl:h-96'
          />
        </Link>
      ) : (
        ''
      )}
      <div className='flex flex-col gap-4 p-8 lg:p-10'>
        <div className='flex flex-col gap-2'>
          <div className=''>
            <p className='flex w-fit flex-wrap gap-x-2 rounded-full font-mono'>
              <LocalDate date={data.date} />
            </p>
          </div>
          <h2 className='w-fit text-3xl font-black text-balance'>
            <Link href={projectLink()} target='_blank' className='text-ctp-text'>
              <span className='relative'>
                {data.title}
                <span className='absolute bottom-1 ml-px icon-[ph--arrow-up-right-bold] text-xl' />
              </span>
            </Link>
          </h2>
        </div>

        <div className=''>
          <div className='prose-protocol-omega max-w-full prose-p:my-0 prose-a:no-underline'>
            <GlobalMDXRenderer>{projDescription}</GlobalMDXRenderer>
          </div>
        </div>
      </div>
    </div>
  );
}
