import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';
import { type WorkMetaProps, batchMatterFetch } from '@/utils/mdx-utils';
import { getAllTags, queryPostMetas } from '@/lib/node-db-funcs';
import linker from '@/utils/linker';

const baseSite = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/projects`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/credits`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
];

// funfact/improbable todo: google only supports 50,000 urls per sitemap, so filter
// old content if needed.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const PROJECTS_FOLDER = './src/app/projects/posts/published';

  const blogMetas = await queryPostMetas();
  const blogCategoriesMetas = await getAllTags();
  const projectMetas = (await batchMatterFetch(PROJECTS_FOLDER)) as WorkMetaProps[];

  const blogPosts = blogMetas.map(({ id, slug, date }) => ({
    url: `${BASE_URL}/${linker(id, slug, 'blog/posts')}`,
    lastModified: date,
  }));

  const blogPostCategories = blogCategoriesMetas.map(({ id, slug, date }) => ({
    url: `${BASE_URL}/${linker(id, slug!, 'blog/tags')}`,
    lastModified: date ? date : new Date,
  }));

  const projects = projectMetas.map(({ slug, date }: WorkMetaProps) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: date,
  }));

  return [...baseSite, ...projects, ...blogPosts, ...blogPostCategories];
}
