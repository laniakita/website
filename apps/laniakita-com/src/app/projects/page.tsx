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
  date: Date;
  descr: string;
  tech: string[];
}

export default async function Projects() {
  const data = await batchMatterFetch('./src/app/projects/works');
  const copyArr = data;
  const oldestYear = (copyArr?.slice(-1)[0] as unknown as WorkMetaProps).date.getFullYear();
  const latestYear = (copyArr?.slice(0)[0] as unknown as WorkMetaProps).date.getFullYear();
  const projectYears = `${latestYear} - ${oldestYear}`;

  return (
    <main className='flex size-full flex-col items-center justify-center px-6'>
      <div className='px-4'>
        <header className='w-full max-w-xl py-10 md:py-20 lg:pb-[6.5rem] lg:pt-36'>
          <p className='text-xl font-semibold'>{projectYears}</p>
          <h1 className='text-5xl font-black uppercase leading-tight'>Projects / Works</h1>
          <div className='prose-protocol-omega prose prose-catppuccin'>
            <p>{`This is a collection of some of the things I've made, sorted by latest.`}</p>
          </div>
        </header>
      </div>
      <div className='flex w-full max-w-5xl flex-wrap'>
        {data?.map((metaObj) => <WorkPreview key={data.indexOf(metaObj)} workMetaObj={metaObj as WorkMetaProps} />)}
      </div>
    </main>
  );
}
