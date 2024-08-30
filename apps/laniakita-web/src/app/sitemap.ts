import type { MetadataRoute } from 'next';
import { compareDesc } from 'date-fns';
import allPosts from '@/app/contentlayermini/generated/Post/index.json';
import allPages from '@/app/contentlayermini/generated/Page/index.json';
import allCategories from '@/app/contentlayermini/generated/Category/index.json';
import allTags from '@/app/contentlayermini/generated/Tag/index.json';
import { allProjects, type Post, type Tag, type Category } from 'contentlayer/generated';
import { BASE_URL } from '@/lib/constants';

// funfact/improbable todo: google only supports 50,000 urls per sitemap, so filter
// old content if needed.

// eslint-disable-next-line @typescript-eslint/require-await -- return expects this to be async, so it's async now, albeit useless.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsRes: Post[] = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  ) as unknown as Post[];
  const categoriesRes: Category[] = allCategories.sort((a, b) =>
    a.title.localeCompare(b.title),
  ) as unknown as Category[];
  const tagsRes: Tag[] = allTags.sort((a, b) => a.title.localeCompare(b.title)) as unknown as Tag[];
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
      url: BASE_URL,
      lastModified: postsRes[0]?.updated ?? postsRes[0]?.date ?? new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: postsRes[0]?.updated ?? postsRes[0]?.date ?? new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: getPageDate('about'),
      changeFrequency: 'yearly',
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/projects`,
      lastModified: projectsRes[0]?.updated ?? projectsRes[0]?.date ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: getPageDate('contact'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/credits`,
      lastModified: getPageDate('credits'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const posts = postsRes.map((post) => ({
    url: `${BASE_URL}${post.url}`,
    lastModified: post.updated ?? post.date,
  }));

  const categories = categoriesRes.map((cat) => ({
    url: `${BASE_URL}${cat.url}`,
    lastModified: isNewPostInCatTag(cat, true),
  }));

  const tags = tagsRes.map((tag) => ({
    url: `${BASE_URL}${tag.url}`,
    lastModified: isNewPostInCatTag(tag, false),
  }));

  const projects = projectsRes.map((project) => ({
    url: `${BASE_URL}${project.url}`,
    lastModified: project.updated ?? project.date,
  }));

  return [...baseSite, ...posts, ...categories, ...tags, ...projects];
}
