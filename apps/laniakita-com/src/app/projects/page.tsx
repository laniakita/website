import { batchMatterFetch } from "@/utils/mdx-utils";

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

export default async function Projects() {
  const data = await batchMatterFetch('./src/app/projects/works')
  console.log(data)
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <h1 className='text-6xl'>Coming Soon</h1>
    </div>
  );
}


