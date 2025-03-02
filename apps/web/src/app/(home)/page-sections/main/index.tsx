'use client';
import { allPosts } from '@/lib/fumadocs/processed';
import MiniPostsRoller from '../../rollers/mini-postroller';
import MiniProjectsRoller from '../../rollers/mini-projects-roller';
import { MiniWorkRoller } from '../../rollers/mini-server-roller';
//import dynamic from 'next/dynamic';
import Section from '../section';
import ServicesTable from '../section/services-table';
import Summary from '../section/summary';

//const BgTestV = dynamic(() => import('../../canvas/decor/bg-test-v').then((mod) => mod.BgTestV), { ssr: false });

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
      services: {
        code: string;
      };
      servicesTable: {
        code: string;
      };
      blog: {
        code: string;
      };
    };
    source: {
      blog: string;
      projects: string;
      works: string;
    }
  };
};

export default function Main(props: MainProps) {
  
  return (
    <main className='@container/main relative flex h-full flex-col pb-20'>
      <Section title="Aloha, I'm Lani" markdown={props.data.markdown.summary.code}>
        <Summary code={props.data.markdown.profile.code} />
      </Section>
      <Section type={1} title='Passion Projects' page={1} markdown={props.data.markdown.projects.code}>
        <MiniProjectsRoller allProjects={JSON.parse(props.data.source.projects)} />
      </Section>
      <Section type={2} title='Client Works' page={2} markdown={props.data.markdown.works.code}>
        <div className='mx-auto max-w-5xl'>
          <div className='flex w-full flex-row gap-6'>
            <MiniWorkRoller allWorks={JSON.parse(props.data.source.works)} />
          </div>
        </div>
      </Section>
      <Section type='dev-for-hire' title='Dev for Hire' markdown={props.data.markdown.services.code}>
        <ServicesTable code={props.data.markdown.servicesTable.code} />
      </Section>
      <Section type={1} title='Latest from the Blog' page={3} markdown={props.data.markdown.blog.code}>
        <MiniPostsRoller allPosts={JSON.parse(props.data.source.blog)} />
      </Section>
    </main>
  );
}
