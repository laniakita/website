import { notFound } from 'next/navigation';
import { compareDesc } from 'date-fns';
import { allPages, allProjects, type Project } from '.contentlayer/generated';
import { MDXComponent } from '@/components/cat-tag-common';

export default function Projects() {
  const data = allPages.find((page) => page.url.split('/').pop() === 'projects');
  if (!data) return notFound();
  const projectData = allProjects.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <main className='simple-color-trans pt-common pb-common flex flex-col gap-4 bg-ctp-base px-10 dark:bg-ctp-midnight md:gap-6'>
      <div className='flex min-h-full items-center justify-center'>
        <div className='prose-protocol-omega max-w-3xl '>
          <MDXComponent content={data.body.code} />
        </div>
      </div>
      <div>
        
      </div>
    </main>
  );
}

const ProjectPreview = (data: Projct) => {
  return (
    <div className='p-10'>
      {data.title}
    </div>
  )
}
