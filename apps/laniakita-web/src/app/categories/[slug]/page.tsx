import { notFound } from 'next/navigation';
import { compareDesc } from 'date-fns';
import { allCategories, allPosts } from 'contentlayer/generated';
import { MiniLayout } from '@/components/cat-tag-common';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  if (params.slug === 'categories') {
    const category = allCategories.find((catX) => catX.url.split('/').pop() === params.slug);
    const matchingPosts = allPosts
      .filter((postX) => postX.categories?.some((cat) => (cat as unknown as { slug: string }).slug === params.slug))
      .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

    if (!category) return notFound();

    return <MiniLayout data={category} posts={matchingPosts} />;
  }
  
  return notFound();
}
