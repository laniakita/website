import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';
import { batchMatterFetch } from '@/utils/mdx-utils';
import type { PostTeaserObjectProps, WorkMetaProps } from '@/utils/mdx-utils';
import type { CategoryProps } from './blog/tags/[id]/[slug]/page';

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
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.1,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.1,
  },
];

// funfact/improbable todo: google only supports 50,000 urls per sitemap, so filter
// old content if needed.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const POSTS_FOLDER = './src/app/blog/posts/published';
  const POST_CATEGORIES_FOLDER = './src/app/blog/categories/posts/published';
  const PROJECTS_FOLDER = './src/app/projects/posts/published';

  const blogMetas = (await batchMatterFetch(POSTS_FOLDER)) as PostTeaserObjectProps[];
  const blogCategoriesMetas = (await batchMatterFetch(POST_CATEGORIES_FOLDER)) as CategoryProps[];
  const projectMetas = (await batchMatterFetch(PROJECTS_FOLDER)) as WorkMetaProps[];

  const blogPosts = blogMetas.map(({ slug, date }: PostTeaserObjectProps) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: date,
  }));

  const blogPostCategories = blogCategoriesMetas.map(({ slug }: CategoryProps) => ({
    url: `${BASE_URL}/blog/categories/${slug}`,
    lastModified: new Date(),
  }));

  const projects = projectMetas.map(({ slug, date }: WorkMetaProps) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: date,
  }));

  return [...baseSite, ...projects, ...blogPosts, ...blogPostCategories];
}
