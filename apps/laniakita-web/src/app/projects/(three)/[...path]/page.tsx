import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { compareDesc } from 'date-fns';
import { allProjects } from 'contentlayer/generated';

export function generateStaticParams() {
  const projects = allProjects.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  return projects.map((projX) => ({
    path: projX.url.split('/').slice(2, projX.url.split('/').length),
  }));
}

export async function generateMetadata(
  { params }: { params: { path: string | string[] } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const projData = allProjects.find(
    (projX) =>
      projX.url === `/projects/${params.path as string}` ||
      projX.url === `/projects/${(params.path as unknown as string[]).join('/')}`,
  );

  const previousImages = (await parent).openGraph?.images ?? [];

  const previousImagesTwitter = (await parent).twitter?.images ?? [];

  return {
    title: projData?.title,
    authors: [{ name: 'Lani Akita' }],
    description: projData?.description,
    openGraph: {
      title: projData?.title,
      description: projData?.description,
      images: [
        {
          alt: `${projData?.title}`,
          type: 'image/jpeg',
          width: 1200,
          height: 630,
          url: `/opengraph/projects/${(params.path as unknown as string[]).join('/')}`,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary',
      title: projData?.title,
      description: projData?.description,
      images: [
        {
          alt: projData?.title,
          type: 'image/jpeg',
          width: 1600,
          height: 900,
          url: `/opengraph/projects/${(params.path as unknown as string[]).join('/')}?twitter=true`,
        },
        ...previousImagesTwitter,
      ],
    },
  };
}

export default async function ProjectPage({ params }: { params: { path: string } }) {
  const data = allProjects.find(
    (project) =>
      project.url === `/projects/${params.path}` ||
      project.url === `/projects/${(params.path as unknown as string[]).join('/')}`,
  );
  if (!data) return notFound();
  const importUrl = data.url.split('/').slice(2, data.url.split('/').length).join('/');

  // eslint-disable-next-line -- dangerous importer
  const { default: Project } = await import(`../${importUrl}/main.tsx`);

  return <Project />;
}
