'use client';
import dynamic from 'next/dynamic';
import Section from '../section';
import Summary from '../section/summary';

const BgTestV = dynamic(() => import('../../canvas/decor/bg-test-v').then((mod) => mod.BgTestV), { ssr: false });

export type MainProps = {
  data: {
    markdown: {
      summary: {
        code: string;
      };
      profile: {
        code: string;
      };
      projects: {
        code: string;
      };
      works: {
        code: string;
      };
      blog: {
        code: string;
      };
    };
  };
};

export default function Main(props: MainProps) {
  return (
    <main className='@container/main relative flex h-full flex-col px-6 py-20'>
      <BgTestV />
      <Section title="Aloha, I'm Lani" markdown={props.data.markdown.summary.code}>
        <Summary code={props.data.markdown.profile.code} />
      </Section>
      <Section title='Passion Projects' page={1} markdown={props.data.markdown.projects.code} />
      <Section title='Client Works' page={2} markdown={props.data.markdown.works.code} />
      <Section title='Latest from the Blog' page={3} markdown={props.data.markdown.blog.code} />
    </main>
  );
}
