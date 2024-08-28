import type { Metadata } from 'next';
import { allProjects } from 'contentlayer/generated';
import NoiseShader01 from './noise';

const projectData = allProjects.find((proj) => proj.url === '/projects/shaders/noise/01');

export const metadata: Metadata = {
  title: projectData?.title,
  authors: [{ name: 'Lani Akita' }],
  description: projectData?.description,
  openGraph: {
    title: projectData?.title,
    description: projectData?.description,
  },
  twitter: {
    card: 'summary',
    title: projectData?.title,
    description: projectData?.description,
  },
};

export default function NoiseShader1Page() {
  return (
    <main className='h-screen w-full'>
      <NoiseShader01 />
    </main>
  );
}
