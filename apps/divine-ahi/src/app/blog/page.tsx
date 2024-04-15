import { queryPosts } from '@/lib/utils/mdxlite';

export default async function BlogPage() {
  const res = await queryPosts();
  const resMap = res.map((i) => {
    const prtDate = new Date(i.date);
    return prtDate.toLocaleString();
  });
  console.log(resMap);
  return <div>hello</div>;
}
