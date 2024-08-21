import { allPosts, Post } from "contentlayer/generated";
import {compareDesc, format, parseISO} from 'date-fns'
import PostRollerV4 from "./post-components";

export default function BlogPage2 () {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  console.dir(posts, {depth: null})
  return (
    <main className="size-full p-2 py-4 md:p-10 lg:pt-28 bg-ctp-base dark:bg-ctp-midnight simple-color-trans">
      <PostRollerV4 posts={posts} />
    </main>
  );
}
