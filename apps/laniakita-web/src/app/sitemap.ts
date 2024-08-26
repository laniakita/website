import type { MetadataRoute } from 'next';
import { compareDesc } from 'date-fns';
import { allCategories, allPosts, allTags, allProjects, Post } from 'contentlayer/generated';
import { BASE_URL } from '@/lib/constants';

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

  const postsRes = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  const categoriesRes = allCategories.sort((a, b) => a.title!.localeCompare(b.title!));
  const tagsRes = allTags.sort((a, b) => a.title!.localeCompare(b.title!));
  const projectsRes = allProjects.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  
  const posts = postsRes.map((post) => ({
    url: `${BASE_URL}${post.url}`,
    lastModified: post.updated ?? post.date,
  }));

  const categories = blogCategoriesMetas.map(({ id, slug, date }) => ({
    url: `${BASE_URL}/${linker(id, slug!, 'blog/tags')}`,
    lastModified: date ? date : new Date(),
  }));

  const projects = projectMetas.map(({ slug, date }: WorkMetaProps) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: date,
  }));

  return [...baseSite, ...projects, ...blogPosts, ...blogPostCategories];
}
