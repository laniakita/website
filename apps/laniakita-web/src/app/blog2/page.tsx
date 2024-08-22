import { allPosts, Post } from "contentlayer/generated";
import {compareDesc, format, parseISO} from 'date-fns'
import PostRollerV4 from "./post-components";
import Sidebar from "./sidebar";

export default function BlogPage2 () {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  //console.dir(posts, {depth: null})
  return (
    <main className="flex flex-col-reverse md:flex-row gap-2 md:gap-4 size-full p-2 md:p-6 lg:p-10 lg:pt-28 bg-ctp-base dark:bg-ctp-midnight simple-color-trans justify-center ">
      <PostRollerV4 posts={posts} />
      <Sidebar />
    </main>
  );
}
