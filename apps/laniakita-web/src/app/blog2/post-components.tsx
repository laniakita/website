import { type Post } from 'contentlayer/generated';

export default function PostRollerV4({ posts }: { posts: Post[] }) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='w-full max-w-3xl'>
        {posts.map((post, idx) => (
          <PostPreviewV4 key={idx} {...post} />
        ))}
      </div>
    </div>
  );
}

function PostPreviewV4(post: Post) {
  return (
    <div className='basis-full border border-ctp-base p-4'>
      <h2 className='text-2xl font-black'>{post.headline}</h2>
      <h3 className='text-xl font-semibold'>{post.subheadline}</h3>
      <p className='pt-4'>{descriptionHelper(post.body.raw)}</p>
    </div>
  );
}

const descriptionHelper = (rawStr: string) => {
  if (!rawStr) return;
  
  const findDescr = rawStr.split('\n').map((strPara) => {
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && strPara.split(' ')[0] !== '##') {
      return strPara
    }
    return undefined;
  });

  return findDescr.filter(el => el)[0]

};
