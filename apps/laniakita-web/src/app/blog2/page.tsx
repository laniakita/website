import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import Sidebar from '@/components/sidebar/main';
import PostRollerV4 from './post-roller-v4';

export default function BlogPage2() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  //console.dir(posts, {depth: null})
  return (
    <main className='simple-color-trans common-padding flex size-full flex-col-reverse justify-center gap-4 md:gap-6 bg-ctp-base dark:bg-ctp-midnight md:flex-row'>
      <PostRollerV4 posts={posts} />
      <Sidebar />
    </main>
  );
}
