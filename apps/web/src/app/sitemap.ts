import type { MetadataRoute } from 'next';
import { allPosts, allProjects, allCategories, allTags, allPages, allWorks } from '@/lib/fumadocs';
import { APP_URL } from '@/lib/constants';

// funfact/improbable todo: google only supports 50,000 urls per sitemap, so filter
// old content if needed.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsRes = allPosts;
  const categoriesRes = allCategories;
  const tagsRes = allTags;
  const projectsRes = allProjects;

  const isNewPostInCatTag = (cattag: (typeof allCategories)[0] | (typeof allTags)[0], isCat: boolean) => {
    // note: using postsRes above
    if (isCat) {
      const postResX = postsRes.find((postX) => postX.categories?.some((catX) => catX.url === cattag.url));

      return postResX?.updated ?? postResX?.date ?? new Date();
    }

    const postResTag = postsRes.find((postY) => postY.tags?.some((tagX) => tagX.url === cattag.url));

    return postResTag?.updated ?? postResTag?.date ?? new Date();
  };

  const getPageDate = (pageSlug: string) => {
    const res = allPages.find((page) => page.url === `/pages/${pageSlug}`);
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
      priority: 0.8,
    },
    {
      url: `${APP_URL}/projects`,
      lastModified: projectsRes[0]?.updated ?? projectsRes[0]?.date ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${APP_URL}/work`,
      lastModified: allWorks[0]?.endDate ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.68,
    },
    {
      url: `${APP_URL}/resume`,
      lastModified: new Date('2024-10-05T07:42:42Z'),
      changeFrequency: 'yearly',
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

  const creditsRes = allPages.filter((page) => page.url.includes('credits/'));
  const credits = creditsRes.map((cred) => ({
    url: `${APP_URL}${cred.url.split('/pages').pop()}`,
    lastModified: cred.date,
  }));

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

  const embeddedProjectsSearch = projectsRes.map((proj) => {
    if (proj.embedded) {
      return proj;
    }
    return undefined;
  });

  const projRes = embeddedProjectsSearch.filter((el) => el) as typeof allProjects;

  const projects = projRes.map((project) => ({
    url: `${APP_URL}${project.url}`,
    lastModified: project.updated ?? project.date,
  }));

  return [...baseSite, ...credits, ...posts, ...categories, ...tags, ...projects];
}
