import { batchMatterFetch } from '@/utils/mdx-utils';
import WorkPreview from './work-preview';

export const metadata = {
  title: 'Projects',
  description: "This is a catalogue of all the (officially released) cool stuff I'm working on.",
  openGraph: {
    title: 'Projects',
    description: "This is a catalogue of all the (officially released) cool stuff I'm working on.",
  },
  twitter: {
    card: 'summary',
    title: 'Projects',
    description: "This is a catalogue of all the (officially released) cool stuff I'm working on.",
  },
};

export interface WorkMetaProps {
  title: string;
  slug: string;
  published?: Date;
  updated?: Date;
  type?: string;
  teaserImg?: string;
  teaserAlt?: string;
  descr: string;
  tech: string[];
  status: string;
}

export default async function Projects() {
  const data = await batchMatterFetch('./src/app/projects/works');
  return (
    <main className='flex size-full flex-col items-center justify-center md:px-2'>
      <div className='px-4'>
        <header className='flex w-full max-w-xl flex-col gap-10 py-10 md:py-20 lg:pb-[6.5rem] lg:pt-36'>
          <h1 className='text-4xl font-black leading-tight md:text-5xl'>Projects / Works</h1>
          <div className='prose-protocol-omega prose prose-catppuccin'>
            <p>{`This is a collection of some of the things I've made, sorted by latest.`}</p>
          </div>
        </header>
      </div>
      <div className='flex w-full max-w-7xl flex-wrap justify-center'>
        {data?.map(
          (metaObj) =>
            (metaObj as WorkMetaProps).status === 'published' && (
              <WorkPreview key={data.indexOf(metaObj)} workMetaObj={metaObj as WorkMetaProps} />
            ),
        )}
      </div>
    </main>
  );
}
