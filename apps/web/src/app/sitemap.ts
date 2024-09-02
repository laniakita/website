import type { MetadataRoute } from 'next';
import { compareDesc } from 'date-fns';
import {
  allPosts,
  allProjects,
  allCategories,
  allTags,
  allPages,
  type Tag,
  type Category,
} from 'contentlayer/generated';
import { APP_URL } from '@/lib/constants';

// funfact/improbable todo: google only supports 50,000 urls per sitemap, so filter
// old content if needed.

// eslint-disable-next-line @typescript-eslint/require-await -- return expects this to be async, so it's async now, albeit useless.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsRes  = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  const categoriesRes = allCategories.sort((a, b) => a.title.localeCompare(b.title));
  const tagsRes = allTags.sort((a, b) => a.title.localeCompare(b.title));
  const projectsRes = allProjects.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  const isNewPostInCatTag = (cattag: Category | Tag, isCat: boolean) => {
    // note: using postsRes above
    if (isCat) {
      const postResX = postsRes.find((postX) =>
        postX.categories?.some(
          (catX) => (catX as unknown as Category).slug === cattag._raw.flattenedPath.split('/').pop(),
        ),
      );

      return postResX?.updated ?? postResX?.date ?? new Date();
    }

    const postResTag = postsRes.find((postY) =>
      postY.tags?.some((tagX) => (tagX as unknown as Tag).slug === cattag._raw.flattenedPath.split('/').pop()),
    );

    return postResTag?.updated ?? postResTag?.date ?? new Date();
  };

  const getPageDate = (pageSlug: string) => {
    const res = allPages.find((page) => page.url === `/${pageSlug}`);
    return res?.date ?? new Date();
  };

  const baseSite = [
    {
      url: APP_URL,
      lastModified: postsRes[0]?.updated ?? postsRes[0]?.date ?? new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${APP_URL}/blog`,
      lastModified: postsRes[0]?.updated ?? postsRes[0]?.date ?? new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${APP_URL}/about`,
      lastModified: getPageDate('about'),
      changeFrequency: 'yearly',
      priority: 0.7,
    },

    {
      url: `${APP_URL}/projects`,
      lastModified: projectsRes[0]?.updated ?? projectsRes[0]?.date ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${APP_URL}/contact`,
      lastModified: getPageDate('contact'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${APP_URL}/credits`,
      lastModified: getPageDate('credits'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const posts = postsRes.map((post) => ({
    url: `${APP_URL}${post.url}`,
    lastModified: post.updated ?? post.date,
  }));

  const categories = categoriesRes.map((cat) => ({
    url: `${APP_URL}${cat.url}`,
    lastModified: isNewPostInCatTag(cat, true),
  }));

  const tags = tagsRes.map((tag) => ({
    url: `${APP_URL}${tag.url}`,
    lastModified: isNewPostInCatTag(tag, false),
  }));

  const projects = projectsRes.map((project) => ({
    url: `${APP_URL}${project.url}`,
    lastModified: project.updated ?? project.date,
  }));

  return [...baseSite, ...posts, ...categories, ...tags, ...projects];
}
