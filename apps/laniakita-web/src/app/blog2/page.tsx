import { allPosts, Post } from "contentlayer/generated";
import {compareDesc, format, parseISO} from 'date-fns'

export default function BlogPage2 () {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  console.log(posts)
  return (
    <main>
    </main>
  );
}
