import { authors, categories, pages, projects, tags, works } from '$/.source';
import { allPostsFeedRes, allPostsRes } from './processed';
import { compareDesc } from 'date-fns';

export const allAuthors = authors.sort(
  (a, b) =>
    a?.name
      .split(' ')
      .pop()
      ?.localeCompare(b?.name.split(' ').pop() ?? '') ?? 0,
);
export const allTags = tags.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0);
export const allCategories = categories.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0);
export const allPages = pages.sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0);
export const allPosts = allPostsRes.sort((a, b) =>
  compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)),
);
export const allPostsFeed = allPostsFeedRes.sort((a, b) =>
  compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)),
);
export const allWorks = works.sort((a, b) => compareDesc(a.startDate, b.startDate));
export const allProjects = projects.sort((a, b) => compareDesc(a.date, b.date));
