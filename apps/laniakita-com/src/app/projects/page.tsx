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
    <main className='flex size-full flex-col items-center justify-center px-3 md:px-7'>
      {/* since we're padding the WorkPreview component with 3, we'll need to account for that. */}
      <header className='w-full max-w-5xl px-3 pb-6 pt-10 lg:pt-24'>
        <h1 className='flex flex-col gap-x-4 gap-y-2 text-4xl font-black uppercase md:flex-row md:gap-y-0'>
          <span>Projects / Works</span>
          <span>({projectYears})</span>
        </h1>
      </header>
      <div className='flex w-full max-w-5xl flex-wrap'>
        {data?.map((metaObj) => <WorkPreview key={data.indexOf(metaObj)} workMetaObj={metaObj as WorkMetaProps} />)}
      </div>
    </main>
  );
}
